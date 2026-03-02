import { Loader2 } from 'lucide-react';

export default function StoreLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-pink-500" />
        <p className="animate-pulse text-sm font-bold tracking-widest text-[#D43D6F]">LOADING...</p>
      </div>
    </div>
  );
}
