import HotelForm from '@/components/admin/hotels/HotelForm';

interface Props {
  params: {
    id: string;
  };
}

export default function EditHotelPage({ params }: Props) {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">ホテル情報編集</h1>
        <p className="mt-2 text-brand-text-secondary">登録済みのホテル情報を変更します</p>
      </div>
      <HotelForm id={params.id} />
    </div>
  );
}
