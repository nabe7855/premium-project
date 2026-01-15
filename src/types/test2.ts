
import { ReactNode } from 'react';

export interface NavItem {
  id: string;
  label: string;
  subLabel?: string;
  icon?: ReactNode;
  link: string;
  isLogo?: boolean;
}

export interface CTAInfo {
  label: string;
  subLabel?: string;
  icon: ReactNode;
  bgColor: string;
  textColor: string;
  link: string;
}
