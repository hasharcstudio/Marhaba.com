import React, { ReactNode } from 'react';

interface ScrollStackItemProps {
  children?: ReactNode;
  itemClassName?: string;
}

export declare const ScrollStackItem: React.FC<ScrollStackItemProps>;

interface ScrollStackProps {
  children?: ReactNode;
  className?: string;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string | number;
  scaleEndPosition?: string | number;
  baseScale?: number;
  scaleDuration?: number;
  rotationAmount?: number;
  blurAmount?: number;
  useWindowScroll?: boolean;
  onStackComplete?: () => void;
}

declare const ScrollStack: React.FC<ScrollStackProps>;
export default ScrollStack;
