import { Metadata } from 'next';
import CastList from '@/components/sections/casts/casts/CastList';
import Footer from '@/components/sections/casts/ui/Footer';
import { MBTI_INFO, ANIMAL_INFO } from '@/data/matchingData';
import { FACE_TYPES } from '@/data/faceTypes';

interface Props {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = params;
  const search = searchParams.search as string;
  const mbti = searchParams.mbti as string;
  const animalType = searchParams.animalType as string;
  const faceTypes = searchParams.faceTypes as string;
  const loveStyles = searchParams.loveStyles as string;

  let title = `${slug} - キャスト検索`;
  let description = `${slug}であなたの理想のキャストを見つけてください。`;

  if (search) title += ` - "${search}"`;
  if (mbti) {
    const mbtiInfo = MBTI_INFO.find((type) => type.id === mbti);
    if (mbtiInfo) {
      title += ` - ${mbti}(${mbtiInfo.name})`;
      description += ` ${mbti}(${mbtiInfo.name})タイプとの相性抜群。`;
    }
  }
  if (animalType) {
    const animalInfo = ANIMAL_INFO.find((type) => type.id === animalType);
    if (animalInfo) {
      title += ` - ${animalType}(${animalInfo.name})`;
      description += ` ${animalType}(${animalInfo.name})との相性診断結果。`;
    }
  }
  if (faceTypes) {
    const faceTypeList = faceTypes.split(',');
    const faceTypeNames = faceTypeList
      .map((ft) => {
        const faceType = FACE_TYPES.find((type) => type.id === ft);
        return faceType?.name;
      })
      .filter(Boolean);

    if (faceTypeNames.length > 0) {
      title += ` - ${faceTypeNames.join('・')}`;
      description += ` ${faceTypeNames.join('・')}の魅力的なキャスト。`;
    }
  }
  if (loveStyles) {
    const styleList = loveStyles.split(',');
    title += ` - ${styleList.join('・')}`;
    description += ` ${styleList.join('・')}を希望する方におすすめ。`;
  }

  return {
    title: `${title} | Strawberry Boys`,
    description,
  };
}

export default function SearchPage({ params, searchParams }: Props) {
  // 診断結果ページかどうかを判定
  const isDiagnosisResult = !!(
    searchParams.mbti ||
    searchParams.animalType ||
    searchParams.loveStyles
  );

  // 動的なタイトルと説明を生成
  const getPageTitle = () => {
    if (isDiagnosisResult) {
      return `${params.slug} - 相性診断結果`;
    }
    return `${params.slug} - キャスト検索`;
  };

  const getPageDescription = () => {
    if (isDiagnosisResult) {
      return 'あなたの診断結果に基づいて、相性の良いキャストをご紹介します';
    }
    return 'あなたの理想のキャストを見つけてください';
  };

  const searchHints = [
    { label: 'MBTI相性診断', icon: '🧠' },
    { label: '顔タイプ別検索', icon: '😊' },
    { label: 'フレーバータグ', icon: '🏷️' },
  ];

  return (
    <>
      <div className="from-secondary bg-gradient-to-br via-white to-neutral-100 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-3 font-serif text-xl font-bold text-neutral-800 sm:mb-4 sm:text-2xl md:text-3xl">
            {getPageTitle()}
          </h1>
          <p className="mx-auto max-w-2xl text-base text-neutral-600 sm:text-lg">
            {getPageDescription()}
          </p>

          {!isDiagnosisResult && (
            <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs text-neutral-500 sm:mt-6 sm:text-sm">
              <span>💡 検索のヒント:</span>
              {searchHints.map(({ label, icon }) => (
                <span key={label} className="rounded bg-white/50 px-2 py-1">
                  {icon} {label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <CastList storeSlug={params.slug} />
      <Footer />
    </>
  );
}
