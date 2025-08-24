import { ReactElement } from 'react';
import { ResponsiveContainer } from 'recharts';

interface ChartProps {
  children: ReactElement;
}

export function Chart({ children }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      {children}
    </ResponsiveContainer>
  );
}