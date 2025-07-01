'use client';

import { useState, useCallback } from 'react';

export function useAgeVerification() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const requireAgeVerification = useCallback((action: () => void) => {
    // Check if user has already verified age in this session
    const isVerified = sessionStorage.getItem('age-verified') === 'true';
    
    if (isVerified) {
      action();
    } else {
      setPendingAction(() => action);
      setIsModalOpen(true);
    }
  }, []);

  const handleConfirm = useCallback(() => {
    sessionStorage.setItem('age-verified', 'true');
    setIsModalOpen(false);
    
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  }, [pendingAction]);

  const handleClose = useCallback(() => {
    setIsModalOpen(false);
    setPendingAction(null);
  }, []);

  return {
    isModalOpen,
    requireAgeVerification,
    handleConfirm,
    handleClose
  };
}