import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const faqs = [
  {
    id: '1',
    question: 'お店を利用する事が初めての経験で不安です',
    answer:
      'ご利用が初めてのお客様に対しても安心してご利用頂けるよう、経験豊富なセラピストさんによる優しいエスコートの後、入念なカウンセリングのお時間をお取りし、出来る限り不安無くご案内が出来るように努めております♫',
  },
  {
    id: '2',
    question: '風俗店という言葉に怖いイメージがあります',
    answer:
      '当店は国に定められた風俗営業法の許可を取得している正規店です、お店の電話回線も携帯電話ではなく一般回線での登録となりますので、ぜひご安心してお問い合わせください♫',
  },
  {
    id: '3',
    question: '本番はできますか?',
    answer:
      '風俗営業法上、本番行為は違法となりますので、そういった行為が目的、または強要の事実が発覚した場合、次回からのご利用をお断りさせていただく場合がございます。当店セラピストからも本番行為を強要することはございません。',
  },
  {
    id: '4',
    question: '衛生面や性病感染などの心配がありますが大丈夫ですか?',
    answer:
      '当店セラピストは施術前に、殺菌作用の高い洗浄液にて消毒いたしております。さらに、セラピスト全員に定期的な性病検査を義務付けておりますのでご安心ください♫',
  },
  {
    id: '5',
    question: '太っていて可愛くないけど相手してくれる?',
    answer:
      'もちろんです!選ぶのは私達ではなく、貴女です。何も遠慮することはありません。女性は気持ちのいいセックスをすると女性ホルモンの分泌で綺麗になると言われています。綺麗な女性はその機会が多く更に綺麗になります。そうでない女性は意地になって「私なんて」とマイナス思考になってしまいがちです。これを機会に心も身体も綺麗いに変身してはいかがですか?',
  },
  {
    id: '6',
    question: '初めての利用で何を伝えれば良いか分かりません....',
    answer:
      '基本的には、ご利用日程、駅等のお待ち合わせ場所、ご利用コース、セラピストの指名有無をお伝え頂ければご案内をお取りします。HPを参考にお問い合わせ下さいませ♫',
  },
  {
    id: '7',
    question: '当日予約はできますか?',
    answer:
      'もちろん可能です。その際、混雑の状況にもよりますがメール、LINEよりも直接お電話頂いた方がご案内がスムーズです♫',
  },
  {
    id: '8',
    question: '深夜に利用はできますか?',
    answer:
      '基本的に当日受付は23時で終了致しますので、深夜帯にご利用の場合は予め早い段階でのご連絡をお願い致します。かつ深夜帯の待機セラピストは少数ですのでお早めにご連絡を頂いた方がご案内がスムーズです♫',
  },
  {
    id: '9',
    question: '予約は何日先まで可能ですか?',
    answer:
      '基本的には長くとも2週間前程でお願いしております。例外として出張、ご旅行などで日程が予め決まっている場合は受付をしておりますのでお気軽にお問い合わせ下さい♫',
  },
  {
    id: '10',
    question: '待ち合わせはどうすれば良いですか?',
    answer:
      '基本的にセラピストは電車での移動となりますので駅でのお待ち合わせとなります。その際何処か改札口、お店の前、ホテルなど目印をご指定頂けると幸いです♫',
  },
  {
    id: '11',
    question: '自宅利用したいが住所は教えたくない',
    answer:
      '最寄りの駅でのお待ち合わせをして、そのままご自宅へ移動という事もできますので、受付にご相談下さい♫',
  },
  {
    id: '12',
    question: 'ホテルはどうすれば良いですか?',
    answer:
      'ご利用のお部屋はお客様で決めて頂き、先に入室されていても大丈夫です。もしお決まりでなければセラピストにお任せする事もできますのでお気軽にお伝え下さい♫',
  },
  {
    id: '13',
    question: 'セラピストが多くて選べない',
    answer:
      '年齢、タイプなどお伝え頂ければ受付の方でご希望に近いセラピストさんを選定致しますのでお気軽にお伝え下さい♫',
  },
  {
    id: '14',
    question: '本名を伝えたくありません',
    answer:
      '偽名で大丈夫です、セラピストにもお客様の個人情報は基本的にお伝えはしませんのでご安心ください♫',
  },
  {
    id: '15',
    question: '時間のカウントは会ってからですか?',
    answer:
      '施術コースのお時間のカウントはお部屋に入室後、カウンセリング、シャワーを浴びた後になりますので、お時間一杯ごゆっくりお過ごしください♫',
  },
];

export async function GET() {
  try {
    const storesToUpdate = ['fukuoka', 'yokohama', 'tokyo', 'osaka', 'nagoya'];
    const results = [];

    for (const slug of storesToUpdate) {
      const store = await prisma.store.findUnique({
        where: { slug },
      });

      if (!store) {
        results.push({ slug, status: 'Store not found' });
        continue;
      }

      // Upsert PriceConfig
      // Check if exists first
      const existingConfig = await prisma.priceConfig.findUnique({
        where: { store_id: store.id },
      });

      if (existingConfig) {
        await prisma.priceConfig.update({
          where: { store_id: store.id },
          data: {
            faqs: faqs as any,
          },
        });
        results.push({ slug, status: 'Updated' });
      } else {
        // Create new if not exists (minimal)
        await prisma.priceConfig.create({
          data: {
            store_id: store.id,
            faqs: faqs as any,
            // other required fields might fail here if not nullable,
            // but schema says most are nullable? Let's check schema.
            // hero_image_url: String?
            // prohibitions: Json? @default("[]")
            // faqs: Json? @default("[]")
            // cancellation_policy: Json?
            // So we can create safe.
          },
        });
        results.push({ slug, status: 'Created' });
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message, stack: error.stack },
      { status: 500 },
    );
  }
}
