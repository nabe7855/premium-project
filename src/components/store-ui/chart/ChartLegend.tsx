'use client';

import React from 'react';
import type { LegendPayload, LegendProps } from 'recharts';
import { cn } from '@/lib/utils';
import { useChart } from '@/components/store-ui/chart/context';
import { getPayloadConfigFromPayload } from '@/components/store-ui/chart/helpers';

type ChartLegendProps = {
  className?: string;
  payload?: LegendPayload[];
  verticalAlign?: LegendProps['verticalAlign'];
  hideIcon?: boolean;
  nameKey?: string;
};

export const ChartLegendContent = React.forwardRef<HTMLDivElement, ChartLegendProps>(
  ({ className, hideIcon = false, payload = [], verticalAlign = 'bottom', nameKey }, ref) => {
    const { config } = useChart();
    if (!payload.length) return null;

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-center gap-4',
          verticalAlign === 'top' ? 'pb-3' : 'pt-3',
          className,
        )}
      >
        {payload.map((item) => {
          const key = nameKey || item.dataKey || 'value';
          const itemConfig = getPayloadConfigFromPayload(config, item, key as string);
          return (
            <div key={item.value} className="flex items-center gap-1.5">
              {!hideIcon &&
                (itemConfig?.icon ? (
                  <itemConfig.icon />
                ) : (
                  <div
                    className="h-2 w-2 shrink-0 rounded-[2px]"
                    style={{ backgroundColor: item.color }}
                  />
                ))}
              {itemConfig?.label}
            </div>
          );
        })}
      </div>
    );
  },
);
ChartLegendContent.displayName = 'ChartLegendContent';
