import { getStoreConfigsForAdmin } from '@/lib/actions/priceConfig';
import PriceManagementClient from './PriceManagementClient';

export const dynamic = 'force-dynamic';

export default async function PriceManagementPage() {
  const initialStores = await getStoreConfigsForAdmin();

  return <PriceManagementClient initialStores={initialStores} />;
}
