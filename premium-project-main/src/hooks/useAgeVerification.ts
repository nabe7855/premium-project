'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export function useAgeVerification() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const router = useRouter(); // ✅ 追加

  const requireAgeVerification = useCallback((action: () => void) => {
    const isVerified = Cookies.get('age-verified') === 'true';

    if (isVerified) {
      action();
    } else {
      setPendingAction(() => action);
      setIsModalOpen(true);
    }
  }, []);

  const handleConfirm = useCallback(() => {
    Cookies.set('age-verified', 'true', { expires: 7 });
    setIsModalOpen(false);

    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }

    router.push('/'); // ✅ 「はい」 → 店舗選択へ
  }, [pendingAction, router]);

  const handleClose = useCallback(() => {
    setIsModalOpen(false);
    setPendingAction(null);

    window.history.back(); // ✅ 「いいえ」 → 戻る
  }, []);

  return {
    isModalOpen,
    requireAgeVerification,
    handleConfirm,
    handleClose,
  };
}
