import HotelForm from '@/components/admin/hotels/HotelForm';

export default function NewHotelPage() {
  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">ホテル新規登録</h1>
        <p className="mt-2 text-brand-text-secondary">新しく掲載するホテル情報を入力してください</p>
      </div>
      <HotelForm />
    </div>
  );
}
