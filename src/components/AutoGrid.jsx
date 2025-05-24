import { useResponsiveGrid } from '../util/useResponsiveGrid';

export default function AutoGrid({ children, min = 220 }) {
  useResponsiveGrid('.selection-grid');
  
  return (
    <div className="selection-grid grid gap-6 w-full">
      {children}
    </div>
  );
} 