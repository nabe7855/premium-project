import MasterManagement from '@/components/admin/hotels/MasterManagement';

export default function HotelMastersPage() {
  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">ホテルマスタ管理</h1>
        <p className="mt-2 text-brand-text-secondary">
          サイト全体で使用するエリアや条件のマスタを管理します
        </p>
      </div>
      <MasterManagement />
    </div>
  );
}
