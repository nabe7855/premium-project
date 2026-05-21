import React from 'react';
import DialogueBubble, { SpeakerType } from './DialogueBubble';
import FAQSection, { FaqItem } from './FAQSection';
import ProfileCard, { CastProfileData } from './ProfileCard';
import { prisma } from '@/lib/prisma';

// ---------------------------------------------------------------------------
// インタビュー記事の本体UIコンポーネント（サーバーコンポーネント）
// amolab の NoteArticleUI に相当するもの
// ---------------------------------------------------------------------------

interface DialogueItem {
  type: 'dialogue' | 'narration' | 'editor_note' | 'photo';
  speaker?: 'interviewer' | 'cast'; // type=dialogue のとき
  speaker_name?: string;
  icon_url?: string;
  text?: string; // type=dialogue|narration|editor_note
  photo_key?: string; // type=photo
}

interface DialogueSection {
  heading?: string;
  items: DialogueItem[];
}

interface PhotoData {
  [key: string]: {
    url: string;
    alt?: string;
    caption?: string;
  };
}

interface InterviewArticleUIProps {
  article: {
    title: string;
    excerpt?: string | null;
    thumbnail_url?: string | null;
    author_name?: string | null;
    published_at?: Date | null;
    created_at: Date;
    tags?: { tag: { name: string } }[];
  };
  interviewMeta: {
    article_type: string;
    series_slug?: string | null;
    vol_number?: number | null;
    area?: string | null;
    dialogue_data?: unknown;
    profile_data?: unknown;
    faq_data?: unknown;
    photos?: unknown;
    writer_note?: unknown;
    seo_keywords?: string | null;
  } | null;
  castLinks?: {
    cast_id?: string | null;
    cast_name: string;
    cast_name_romaji?: string | null;
    role: string;
    display_order: number;
  }[];
}

export default async function InterviewArticleUI({
  article,
  interviewMeta,
  castLinks,
}: InterviewArticleUIProps) {
  const dialogueData = interviewMeta?.dialogue_data as
    | { sections: DialogueSection[] }
    | undefined;
  const profileDataRaw = interviewMeta?.profile_data as any | undefined;
  const faqData = interviewMeta?.faq_data as { items: FaqItem[] } | undefined;
  const photos = (interviewMeta?.photos ?? {}) as PhotoData;
  const photosAny = photos as any;
  const writerNote = interviewMeta?.writer_note as string[] | string | undefined;

  // DBからキャストの公式画像を引いてくる
  const castIds = castLinks?.map(c => c.cast_id).filter(Boolean) as string[];
  const castPhotoMap = new Map<string, string>();
  const castNameToIdMap = new Map<string, string>();
  
  if (castLinks) {
    for (const cl of castLinks) {
      if (cl.cast_id && cl.cast_name) {
        castNameToIdMap.set(cl.cast_name, cl.cast_id);
      }
    }
  }

  const castStoreSlugMap = new Map<string, string>();

  if (castIds && castIds.length > 0) {
    const casts = await prisma.cast.findMany({
      where: { id: { in: castIds } },
      select: { 
        id: true, 
        main_image_url: true, 
        image_url: true, 
        memberships: { select: { store: { select: { slug: true } } } } 
      },
    });
    for (const c of casts) {
      castPhotoMap.set(c.id, c.main_image_url || c.image_url || '');
      if (c.memberships && c.memberships.length > 0 && c.memberships[0].store?.slug) {
        castStoreSlugMap.set(c.id, c.memberships[0].store.slug);
      }
    }
  }

  console.log('[DEBUG InterviewArticleUI] castLinks:', JSON.stringify(castLinks, null, 2));
  console.log('[DEBUG InterviewArticleUI] castIds:', castIds);
  console.log('[DEBUG InterviewArticleUI] castNameToIdMap:', Array.from(castNameToIdMap.entries()));
  console.log('[DEBUG InterviewArticleUI] castPhotoMap:', Array.from(castPhotoMap.entries()));

  // ✅ DBに保存されている profile_data の形式（配列、オブジェクト、または { fields: [...] }）を判別し、安全に CastProfileData[] に正規化します。
  const profileList: CastProfileData[] = [];
  if (profileDataRaw) {
    if (Array.isArray(profileDataRaw)) {
      // 1. 複数キャスト（座談会など）の配列データの場合
      profileList.push(...profileDataRaw);
    } else if (profileDataRaw.fields && Array.isArray(profileDataRaw.fields)) {
      // 2. 単一キャスト用の独自項目項目リスト { fields: [...] } の場合、キャストリンクとマージする
      const primaryCast = castLinks && castLinks.length > 0 ? castLinks[0] : null;
      if (primaryCast) {
        // cast_idがあればそれを、なければcast_name_romajiをslugとして利用する
        const castSlug = (primaryCast as any).cast_id || primaryCast.cast_name_romaji || '';
        const areaSlug = interviewMeta?.area === '福岡' ? 'fukuoka' : interviewMeta?.area === '横浜' ? 'yokohama' : 'fukuoka';
        const profileUrl = castSlug ? `/store/${areaSlug}/cast/${castSlug}` : undefined;

        // DBから取得した公式画像を最優先とし、なければ記事内の写真を使用する
        const officialPhotoUrl = (primaryCast as any).cast_id ? castPhotoMap.get((primaryCast as any).cast_id) : undefined;
        const photosData = photos as any;
        const fallbackPhotoUrl = photosData?.fullbody?.url || photosData?.saiphoto1?.url || photosData?.saiphoto2?.url || photosData?.saiphoto3?.url;
        const mainPhotoUrl = officialPhotoUrl || fallbackPhotoUrl;

        profileList.push({
          name: primaryCast.cast_name || '',
          name_romaji: primaryCast.cast_name_romaji || undefined,
          area: interviewMeta?.area || undefined,
          attributes: profileDataRaw.fields.map((f: any) => ({
            label: f.key,
            value: f.value,
          })),
          icon_url: mainPhotoUrl,
          profile_url: profileUrl,
        });
      }
    } else if (profileDataRaw.name) {
      // 3. 通常の name を持った単一キャストオブジェクトの場合
      profileList.push(profileDataRaw as CastProfileData);
    }
  }
  const writerNoteList: string[] = writerNote
    ? Array.isArray(writerNote)
      ? writerNote
      : [writerNote]
    : [];

  // ✅ speaker_name と speaker タイプからアイコンURLを解決するヘルパー
  const resolveIconUrl = (speakerType: string | undefined, speakerName: string | undefined, itemIconUrl: string | undefined): string | undefined => {
    // 1. アイテムに直接 icon_url が設定されていればそれを優先
    if (itemIconUrl) return itemIconUrl;
    if (!speakerName) return undefined;
    
    // 2. インタビュアー（スタッフ）の場合: photos.staff_photos[speakerName]
    if (speakerType === 'interviewer') {
      return photosAny?.staff_photos?.[speakerName] ?? undefined;
    }
    
    // 3. キャスト側: DBから取得した公式アイコン画像を最優先
    // speakerType が castId に一致するか確認
    let castId = speakerType && castPhotoMap.has(speakerType) ? speakerType : undefined;
    
    // 見つからなければ名前で完全一致または部分一致を試みる
    if (!castId && speakerName) {
      castId = castNameToIdMap.get(speakerName);
      if (!castId) {
        castId = Array.from(castNameToIdMap.entries()).find(([name]) => name.includes(speakerName) || speakerName.includes(name))?.[1];
      }
    }

    if (castId) {
      const officialUrl = castPhotoMap.get(castId);
      if (officialUrl) {
        console.log(`[DEBUG InterviewArticleUI] resolveIconUrl for ${speakerName}: using officialUrl`, officialUrl);
        return officialUrl;
      }
    }
    
    // 4. フォールバック: photos.fullbody > saiphoto1 > saiphoto2 の順で探す
    const fallbackUrl = photosAny?.fullbody?.url || photosAny?.saiphoto1?.url || photosAny?.saiphoto2?.url || photosAny?.saiphoto3?.url || undefined;
    console.log(`[DEBUG InterviewArticleUI] resolveIconUrl for ${speakerName}: using fallbackUrl`, fallbackUrl);
    return fallbackUrl;
  };

  const publishedDate = article.published_at ?? article.created_at;
  const dateStr = publishedDate.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div style={{ background: '#FAFAF8', minHeight: '100vh' }}>
      {/* ヒーローエリア */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 20px 0' }}>
        {/* シリーズ・巻数バッジ */}
        {interviewMeta?.series_slug && (
          <div className="mb-4 flex flex-wrap gap-2">
            <span
              className="rounded-full px-3 py-1 text-xs font-bold text-white"
              style={{ background: '#E8567A' }}
            >
              {interviewMeta.article_type === 'roundtable'
                ? '座談会'
                : interviewMeta.article_type === 'feature'
                ? '特集'
                : 'キャストインタビュー'}
              {interviewMeta.vol_number != null &&
                ` vol.${interviewMeta.vol_number}`}
            </span>
            {interviewMeta.area && (
              <span
                className="rounded-full border px-3 py-1 text-xs font-medium"
                style={{ borderColor: '#E8567A', color: '#E8567A' }}
              >
                {interviewMeta.area}エリア
              </span>
            )}
          </div>
        )}

        {/* タイトル */}
        <h1
          className="mb-4 font-serif text-2xl font-bold leading-snug"
          style={{ color: '#1a1a1a', letterSpacing: '-0.3px' }}
        >
          {article.title}
        </h1>

        {/* リード文 */}
        {article.excerpt && (
          <p
            className="mb-5 text-sm leading-loose"
            style={{ color: '#555' }}
          >
            {article.excerpt}
          </p>
        )}

        {/* メタ情報バー */}
        <div
          className="mb-10 flex items-center justify-between border-y py-3 text-xs"
          style={{ borderColor: '#E8E5DE', color: '#888' }}
        >
          <span>{dateStr}</span>
          <div className="flex flex-wrap gap-1">
            {article.tags?.map(({ tag }) => (
              <span
                key={tag.name}
                className="rounded-full px-2 py-0.5 text-[10px]"
                style={{ background: '#F9D1DA', color: '#E8567A' }}
              >
                #{tag.name}
              </span>
            ))}
          </div>
        </div>

        {/* サムネイル */}
        {article.thumbnail_url && (
          <div className="mb-10 overflow-hidden rounded-2xl shadow-md">
            <img
              src={article.thumbnail_url}
              alt={article.title}
              className="w-full object-cover"
              style={{ maxHeight: 420 }}
            />
          </div>
        )}
      </div>

      {/* 記事本文 */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 20px 60px' }}>
        {/* ダイアログセクション */}
        {dialogueData?.sections?.map((section, si) => (
          <div key={si} className="mb-10">
            {section.heading && (
              <h2
                className="mb-6 border-l-4 pl-4 font-serif text-lg font-bold"
                style={{
                  borderColor: '#E8567A',
                  color: '#1a1a1a',
                }}
              >
                {section.heading}
              </h2>
            )}

            <div className="space-y-5">
              {section.items.map((item, ii) => {
                if (item.type === 'dialogue' && item.text) {
                  return (
                    <DialogueBubble
                      key={ii}
                      speaker={(item.speaker ?? 'cast') as SpeakerType}
                      speakerName={item.speaker_name}
                      iconUrl={resolveIconUrl(item.speaker, item.speaker_name, item.icon_url)}
                      text={item.text}
                    />
                  );
                }

                if (item.type === 'narration' && item.text) {
                  return (
                    <p
                      key={ii}
                      className="px-2 text-sm leading-loose"
                      style={{ color: '#555' }}
                    >
                      {item.text}
                    </p>
                  );
                }

                if (item.type === 'editor_note' && item.text) {
                  return (
                    <div
                      key={ii}
                      className="rounded-xl px-4 py-3 text-sm italic leading-loose"
                      style={{ background: '#F7F5F0', color: '#888' }}
                    >
                      📝 {item.text}
                    </div>
                  );
                }

                if (item.type === 'photo' && item.photo_key) {
                  const photo = photos[item.photo_key] as any;
                  if (!photo) return null;

                  // ペアレイアウト（横並び）の処理
                  if (photo.layout === 'pair' && Array.isArray(photo.images)) {
                    return (
                      <div key={ii} className="my-8 grid grid-cols-2 gap-3">
                        {photo.images.map((img: any, idx: number) => (
                          <figure key={idx}>
                            <img
                              src={img.url || img.filename}
                              alt={img.alt ?? ''}
                              className="aspect-[4/5] w-full rounded-xl object-cover shadow-sm"
                            />
                            {img.caption && (
                              <figcaption
                                className="mt-2 text-[10px] leading-relaxed"
                                style={{ color: '#9ca3af' }}
                              >
                                {img.caption}
                              </figcaption>
                            )}
                          </figure>
                        ))}
                      </div>
                    );
                  }

                  // 通常の1枚表示
                  return (
                    <figure key={ii} className="my-8">
                      <img
                        src={photo.url || photo.filename}
                        alt={photo.alt ?? ''}
                        className={`w-full rounded-xl object-cover shadow-sm ${
                          photo.layout === 'portrait' ? 'max-w-[400px] mx-auto' : ''
                        }`}
                      />
                      {photo.caption && (
                        <figcaption
                          className="mt-2 text-center text-xs"
                          style={{ color: '#9ca3af' }}
                        >
                          {photo.caption}
                        </figcaption>
                      )}
                    </figure>
                  );
                }

                return null;
              })}
            </div>
          </div>
        ))}

        {/* プロフィールカード */}
        {profileList.length > 0 && (
          <div className="mt-12">
            <h2
              className="mb-5 font-serif text-lg font-bold"
              style={{ color: '#1a1a1a' }}
            >
              出演キャスト
            </h2>
            <div
              className={`grid gap-4 ${profileList.length > 1 ? 'sm:grid-cols-2' : ''}`}
            >
              {profileList.map((cast, i) => (
                <ProfileCard key={i} cast={cast} />
              ))}
            </div>
          </div>
        )}

        {/* FAQ */}
        {faqData?.items && <FAQSection items={faqData.items} />}

        {/* ライター後記（writer_note JSON がある場合はそれを優先、なければ author_name） */}
        {(writerNoteList.length > 0 || article.author_name) && (
          <div
            className="mt-12 rounded-2xl p-6"
            style={{ background: '#FFF0F3' }}
          >
            <p
              className="mb-3 text-[11px] font-bold tracking-widest"
              style={{ color: '#E8567A' }}
            >
              WRITER'S NOTE
            </p>
            {writerNoteList.length > 0 ? (
              <div className="space-y-4 text-sm leading-loose text-[#333]">
                {writerNoteList.map((note, i) => (
                  <p key={i}>{note}</p>
                ))}
                {article.author_name && (
                  <p className="pt-2 text-right font-bold">— {article.author_name}</p>
                )}
              </div>
            ) : (
              <p className="text-sm font-bold" style={{ color: '#1a1a1a' }}>
                {article.author_name}
              </p>
            )}
          </div>
        )}

        {/* CTA */}
        <div
          className="mt-12 rounded-2xl p-6 text-center"
          style={{ background: 'linear-gradient(135deg, #FFF0F3, #FFF8FA)' }}
        >
          <p
            className="mb-2 text-[11px] font-bold tracking-widest"
            style={{ color: '#E8567A' }}
          >
            RESERVATION
          </p>
          <p className="mb-5 text-sm leading-relaxed" style={{ color: '#555' }}>
            {castLinks && castLinks.length > 0
              ? `${castLinks[0].cast_name}に会いに行く`
              : 'キャストのプロフィールを見る'}
          </p>
          <a
            href={
              castLinks && castLinks.length > 0 && castLinks[0].cast_id
                ? `/store/${castStoreSlugMap.get(castLinks[0].cast_id) || 'fukuoka'}/cast/${castLinks[0].cast_id}#reservation`
                : '/store/fukuoka'
            }
            className="inline-block rounded-full px-8 py-3 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-80"
            style={{ background: '#E8567A' }}
          >
            ご予約・お問い合わせはこちら →
          </a>
        </div>
      </div>
    </div>
  );
}
