import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { mockCasts } from '@/data/castsmockData'
import CastDetail from '@/components/sections/casts/casts/CastDetail'
import Footer from '@/components/sections/casts/ui/Footer'

interface Props {
  params: { slug: string; cast: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cast = mockCasts.find(c => c.id === params.cast)
  
  if (!cast) {
    return {
      title: 'キャストが見つかりません | Strawberry Boys',
      description: '指定されたキャストは存在しません。',
    }
  }

  return {
    title: `${cast.name} - ${cast.catchphrase} | ${params.slug} | Strawberry Boys`,
    description: `${cast.name}(${cast.age}歳) - ${cast.catchphrase}。評価${cast.rating}、${cast.reviewCount}件のレビュー。${cast.profile.introduction}`,
    openGraph: {
      title: `${cast.name} - ${cast.catchphrase}`,
      description: cast.profile.introduction,
      images: [cast.avatar],
    },
  }
}

export default function CastDetailPage({ params }: Props) {
  const cast = mockCasts.find(c => c.id === params.cast)

  if (!cast) {
    notFound()
  }

  return (
    <>
      <CastDetail cast={cast} />
      <Footer />
    </>
  )
}