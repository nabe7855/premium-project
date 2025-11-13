'use client';

import React from 'react';
import { TooltipProps } from 'recharts';
import { cn } from '@/lib/utils';
import { useChart } from '@/components/store-ui/chart/context';

function getPayloadConfigFromPayload(config: any, payload: any, key: string) {
  const payloadData = payload?.payload;
  let configLabelKey = key;

  if (payload && typeof payload[key] === 'string') {
    configLabelKey = payload[key] as string;
  } else if (payloadData && typeof payloadData[key] === 'string') {
    configLabelKey = payloadData[key] as string;
  }

  return config[configLabelKey] ?? config[key];
}

export type CustomTooltipProps = TooltipProps<number, string> & {
  payload?: any[]; // ← 明示的に any[]
  label?: string | number; // ← これを追加！
  className?: string;
  hideLabel?: boolean;
  hideIndicator?: boolean;
  indicator?: 'line' | 'dot' | 'dashed';
  nameKey?: string;
  labelKey?: string;
  labelClassName?: string;
  formatter?: (
    value: number,
    name: string,
    item: any,
    index: number,
    payload: any,
  ) => React.ReactNode;
  labelFormatter?: (label: any, payload: any[]) => React.ReactNode;
  color?: string;
};

export const ChartTooltipContent = React.forwardRef<HTMLDivElement, CustomTooltipProps>(
  ({ active, payload = [], label, className, ...props }, ref) => {
    const chartContext = useChart();
    const config = chartContext?.config ?? {};

    if (!active || !payload.length) return null;

    return (
      <div ref={ref} className={cn('tooltip-style', className)}>
        <p className="text-xs">カスタムツールチップ</p>
        <p className="text-muted-foreground">{label}</p>

        {payload.map((item: any, index: number) => {
          const key = props.nameKey || item.name || item.dataKey || 'value';
          const itemConfig = getPayloadConfigFromPayload(config, item, key);
          return (
            <div key={index} className="flex justify-between">
              <span>{itemConfig?.label ?? item.name}</span>
              <span>{item.value}</span>
            </div>
          );
        })}
      </div>
    );
  },
);

ChartTooltipContent.displayName = 'ChartTooltipContent';
