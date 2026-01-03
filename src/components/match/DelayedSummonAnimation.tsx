import React, { useEffect, useState } from 'react';
import SummonAnimation from '@/components/match2/SummonAnimation';

interface Props {
  delay: number; // 遅延開始 (ms)
  onComplete: () => void;
}

const DelayedSummonAnimation: React.FC<Props> = ({ delay, onComplete }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  // SummonAnimation 側でアニメ終了を検知して onComplete を呼ぶ
  return show ? <SummonAnimation onComplete={onComplete} /> : null;
};

export default DelayedSummonAnimation;
