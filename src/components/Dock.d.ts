import React, { ReactNode } from 'react';

interface DockItem {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
}

interface DockProps {
  items: DockItem[];
  panelHeight?: number;
  baseItemSize?: number;
  magnification?: number;
  distance?: number;
  className?: string;
  spring?: {
    mass?: number;
    stiffness?: number;
    damping?: number;
  };
}

declare const Dock: React.FC<DockProps>;
export default Dock;
