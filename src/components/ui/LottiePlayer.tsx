// components/ui/LottiePlayer.tsx
'use client';

import Lottie from 'lottie-react';
import { FC } from 'react';

interface LottiePlayerProps {
  animationPath: string;
  loop?: boolean;
  autoplay?: boolean;
}

const LottiePlayer: FC<LottiePlayerProps> = ({ animationPath, loop = true, autoplay = true }) => {
  return (
    <Lottie
      animationData={require(`@/../public/${animationPath}`)}
      loop={loop}
      autoplay={autoplay}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default LottiePlayer;
