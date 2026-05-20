'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// ---------------------------------------------------------------------------
// 型定義
// ---------------------------------------------------------------------------

export type InterviewArticleType = 'solo_interview' | 'roundtable' | 'feature';

export interface InterviewMetaInput {
  article_type?: InterviewArticleType;
  series_slug?: string | null;
  vol_number?: number | null;
  area?: string | null;
  dialogue_data?: object | null;
  profile_data?: object | null;
  faq_data?: object | null;
  photos?: object | null;
  seo_keywords?: string | null;
  structured_data?: object | null;
  writer_note?: object | null;
  cta_data?: object | null;
  ogp_image_url?: string | null;
}

export interface InterviewCastLinkInput {
  cast_id?: string | null;
  cast_name: string;
  cast_name_romaji?: string | null;
  role?: 'interviewee' | 'participant' | 'host';
  display_order?: number;
}

export interface CreateInterviewInput {
  // MediaArticle フィールド
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  thumbnail_url?: string | null;
  category?: string;
  status?: 'draft' | 'published';
  author_name?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  tags?: string[];
  // InterviewMeta フィールド
  meta: InterviewMetaInput;
  // キャスト紐付け
  cast_links?: InterviewCastLinkInput[];
}

// ---------------------------------------------------------------------------
// 公開取得系
// ---------------------------------------------------------------------------

/**
 * 公開済みインタビュー記事一覧を取得
 * category='interview' の MediaArticle + InterviewMeta を JOIN して返す
 */
export async function getInterviewArticles(options?: {
  area?: string;
  series_slug?: string;
  article_type?: InterviewArticleType;
  limit?: number;
}) {
  try {
    const metaWhere: Record<string, unknown> = {};
    if (options?.area) {
      metaWhere.area = options.area === 'fukuoka' ? { in: ['fukuoka', '福岡'] } : options.area === 'yokohama' ? { in: ['yokohama', '横浜'] } : options.area;
    }
    if (options?.series_slug) metaWhere.series_slug = options.series_slug;
    if (options?.article_type) metaWhere.article_type = options.article_type;

    const metas = await prisma.interviewMeta.findMany({
      where: metaWhere,
      include: {
        cast_links: {
          orderBy: { display_order: 'asc' },
        },
      },
      orderBy: { created_at: 'desc' },
      take: options?.limit,
    });

    // MediaArticle を article_id で一括取得
    const articleIds = metas.map((m) => m.article_id);
    const articles = await prisma.mediaArticle.findMany({
      where: {
        id: { in: articleIds },
        status: 'published',
        category: 'interview',
      },
      include: {
        tags: { include: { tag: true } },
      },
    });

    // article_id をキーにした Map を作成
    const articleMap = new Map(articles.map((a) => [a.id, a]));

    // 公開済みのものだけを結合して返す
    const result = metas
      .map((meta) => {
        const article = articleMap.get(meta.article_id);
        if (!article) return null;
        return { ...article, interview_meta: meta };
      })
      .filter(Boolean);

    return { success: true, articles: result };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[interview] getInterviewArticles error:', message);
    return { success: false, articles: [], error: message };
  }
}

/**
 * 管理画面用：すべてのインタビュー記事を取得（下書き含む）
 */
export async function getAdminInterviewArticles() {
  try {
    const metas = await prisma.interviewMeta.findMany({
      include: {
        cast_links: {
          orderBy: { display_order: 'asc' },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    const articleIds = metas.map((m) => m.article_id);
    const articles = await prisma.mediaArticle.findMany({
      where: {
        id: { in: articleIds },
        category: 'interview',
      },
      include: {
        tags: { include: { tag: true } },
      },
    });

    const articleMap = new Map(articles.map((a) => [a.id, a]));

    const result = metas
      .map((meta) => {
        const article = articleMap.get(meta.article_id);
        if (!article) return null;
        return { ...article, interview_meta: meta };
      })
      .filter(Boolean);

    return { success: true, articles: result };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[interview] getAdminInterviewArticles error:', message);
    return { success: false, articles: [], error: message };
  }
}

/**
 * エディタ選択用：すべてのキャストを取得
 */
export async function getAllCasts() {
  try {
    const castsRaw = await prisma.cast.findMany({
      where: { is_active: true },
      select: {
        id: true,
        name: true,
        image_url: true,
        main_image_url: true,
      },
      orderBy: { name: 'asc' },
    });

    const casts = castsRaw.map(c => ({
      id: c.id,
      name: c.name,
      photoUrl: c.main_image_url || c.image_url || '',
    }));

    return { success: true, casts };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[interview] getAllCasts error:', message);
    return { success: false, casts: [], error: message };
  }
}

/**
 * slug からインタビュー記事を1件取得
 */
export async function getInterviewArticleBySlug(slug: string) {
  try {
    const article = await prisma.mediaArticle.findUnique({
      where: { slug },
      include: {
        tags: { include: { tag: true } },
      },
    });

    if (!article) return { success: false, article: null };

    const meta = await prisma.interviewMeta.findUnique({
      where: { article_id: article.id },
      include: {
        cast_links: { orderBy: { display_order: 'asc' } },
      },
    });

    return {
      success: true,
      article: { ...article, interview_meta: meta ?? null },
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[interview] getInterviewArticleBySlug error:', message);
    return { success: false, article: null, error: message };
  }
}

/**
 * シリーズ（例: 'sai-interview'）の記事一覧を vol_number 順に取得
 */
export async function getInterviewsBySeries(seriesSlug: string) {
  try {
    const metas = await prisma.interviewMeta.findMany({
      where: { series_slug: seriesSlug },
      include: {
        cast_links: { orderBy: { display_order: 'asc' } },
      },
      orderBy: { vol_number: 'asc' },
    });

    const articleIds = metas.map((m) => m.article_id);
    const articles = await prisma.mediaArticle.findMany({
      where: { id: { in: articleIds } },
      include: { tags: { include: { tag: true } } },
    });

    const articleMap = new Map(articles.map((a) => [a.id, a]));

    const result = metas
      .map((meta) => {
        const article = articleMap.get(meta.article_id);
        if (!article) return null;
        return { ...article, interview_meta: meta };
      })
      .filter(Boolean);

    return { success: true, articles: result };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[interview] getInterviewsBySeries error:', message);
    return { success: false, articles: [], error: message };
  }
}

// ---------------------------------------------------------------------------
// 管理系（作成・更新・削除）
// ---------------------------------------------------------------------------

/**
 * インタビュー記事の新規作成
 * MediaArticle + InterviewMeta + InterviewCastLink をトランザクションで作成
 */
export async function createInterviewArticle(data: CreateInterviewInput) {
  try {
    // slug 重複チェック
    const existing = await prisma.mediaArticle.findUnique({
      where: { slug: data.slug },
    });
    if (existing) {
      return { success: false, error: 'このURLスラグは既に使用されています。' };
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. MediaArticle 作成
      const article = await tx.mediaArticle.create({
        data: {
          title: data.title,
          slug: data.slug,
          content: data.content,
          excerpt: data.excerpt ?? null,
          thumbnail_url: data.thumbnail_url ?? null,
          category: data.category ?? 'interview',
          target_audience: 'user',
          status: data.status ?? 'draft',
          author_name: data.author_name ?? '運営事務局',
          seo_title: data.seo_title ?? null,
          seo_description: data.seo_description ?? null,
          published_at: data.status === 'published' ? new Date() : null,
        },
      });

      // 2. タグ処理
      if (data.tags && data.tags.length > 0) {
        for (const tagName of data.tags) {
          let tag = await tx.mediaTag.findUnique({ where: { name: tagName } });
          if (!tag) {
            tag = await tx.mediaTag.create({ data: { name: tagName } });
          }
          await tx.mediaArticleTag.create({
            data: { article_id: article.id, tag_id: tag.id },
          });
        }
      }

      // 3. InterviewMeta 作成
      const meta = await tx.interviewMeta.create({
        data: {
          article_id: article.id,
          article_type: data.meta.article_type ?? 'solo_interview',
          series_slug: data.meta.series_slug ?? null,
          vol_number: data.meta.vol_number ?? null,
          area: data.meta.area ?? null,
          dialogue_data: (data.meta.dialogue_data as object) ?? undefined,
          profile_data: (data.meta.profile_data as object) ?? undefined,
          faq_data: (data.meta.faq_data as object) ?? undefined,
          photos: (data.meta.photos as object) ?? undefined,
          seo_keywords: data.meta.seo_keywords ?? null,
          structured_data: (data.meta.structured_data as object) ?? undefined,
          writer_note: (data.meta.writer_note as object) ?? undefined,
          cta_data: (data.meta.cta_data as object) ?? undefined,
          ogp_image_url: data.meta.ogp_image_url ?? null,
        },
      });

      // 4. キャストリンク作成
      if (data.cast_links && data.cast_links.length > 0) {
        for (const link of data.cast_links) {
          await tx.interviewCastLink.create({
            data: {
              interview_meta_id: meta.id,
              cast_id: link.cast_id ?? null,
              cast_name: link.cast_name,
              cast_name_romaji: link.cast_name_romaji ?? null,
              role: link.role ?? 'interviewee',
              display_order: link.display_order ?? 0,
            },
          });
        }
      }

      return { article, meta };
    });

    revalidatePath('/magazine');
    revalidatePath('/admin/media-management');
    return { success: true, ...result };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[interview] createInterviewArticle error:', message);
    return { success: false, error: message };
  }
}

/**
 * InterviewMeta の更新（記事本文は media.ts の updateMediaArticle を使う）
 */
export async function updateInterviewMeta(
  articleId: string,
  metaData: InterviewMetaInput,
  castLinks?: InterviewCastLinkInput[],
) {
  try {
    const meta = await prisma.interviewMeta.upsert({
      where: { article_id: articleId },
      update: {
        article_type: metaData.article_type ?? undefined,
        series_slug: metaData.series_slug,
        vol_number: metaData.vol_number,
        area: metaData.area,
        dialogue_data: (metaData.dialogue_data as object) ?? undefined,
        profile_data: (metaData.profile_data as object) ?? undefined,
        faq_data: (metaData.faq_data as object) ?? undefined,
        photos: (metaData.photos as object) ?? undefined,
        seo_keywords: metaData.seo_keywords,
        structured_data: (metaData.structured_data as object) ?? undefined,
        writer_note: (metaData.writer_note as object) ?? undefined,
        cta_data: (metaData.cta_data as object) ?? undefined,
        ogp_image_url: metaData.ogp_image_url,
      },
      create: {
        article_id: articleId,
        article_type: metaData.article_type ?? 'solo_interview',
        series_slug: metaData.series_slug ?? null,
        vol_number: metaData.vol_number ?? null,
        area: metaData.area ?? null,
        dialogue_data: (metaData.dialogue_data as object) ?? undefined,
        profile_data: (metaData.profile_data as object) ?? undefined,
        faq_data: (metaData.faq_data as object) ?? undefined,
        photos: (metaData.photos as object) ?? undefined,
        seo_keywords: metaData.seo_keywords ?? null,
        structured_data: (metaData.structured_data as object) ?? undefined,
        writer_note: (metaData.writer_note as object) ?? undefined,
        cta_data: (metaData.cta_data as object) ?? undefined,
        ogp_image_url: metaData.ogp_image_url ?? null,
      },
    });

    // キャストリンクの更新（全削除→再作成）
    if (castLinks !== undefined) {
      await prisma.interviewCastLink.deleteMany({
        where: { interview_meta_id: meta.id },
      });

      for (const link of castLinks) {
        await prisma.interviewCastLink.create({
          data: {
            interview_meta_id: meta.id,
            cast_id: link.cast_id ?? null,
            cast_name: link.cast_name,
            cast_name_romaji: link.cast_name_romaji ?? null,
            role: link.role ?? 'interviewee',
            display_order: link.display_order ?? 0,
          },
        });
      }
    }

    revalidatePath('/magazine');
    return { success: true, meta };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[interview] updateInterviewMeta error:', message);
    return { success: false, error: message };
  }
}
