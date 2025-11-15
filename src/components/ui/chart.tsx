'use client';

import React from 'react';
import {
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  TooltipProps as RechartsTooltipProps,
  Legend as RechartsLegend,
  LegendProps,
  LegendPayload,
} from 'recharts';
import { cn } from '@/lib/utils';

const THEMES = { light: '', dark: '.dark' } as const;

export type ChartConfig = {
  [k: string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />');
  }
  return context;
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    config: ChartConfig;
    children: React.ComponentProps<typeof ResponsiveContainer>['children'];
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn('flex aspect-video justify-center text-xs', className)}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <ResponsiveContainer>{children}</ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = 'ChartContainer';

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(([_, cfg]) => cfg.theme || cfg.color);
  if (!colorConfig.length) return null;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) =>
              `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, cfg]) => {
    const color = cfg.theme?.[theme as keyof typeof cfg.theme] || cfg.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .join('\n')}
}`,
          )
          .join('\n'),
      }}
    />
  );
};

type TooltipPayload = {
  name: string;
  value: string | number;
  dataKey?: string;
  color?: string;
  payload?: Record<string, any>;
};

type CustomTooltipProps = Omit<RechartsTooltipProps<string | number, string>, 'payload'> & {
  className?: string;
  hideLabel?: boolean;
  hideIndicator?: boolean;
  indicator?: 'line' | 'dot' | 'dashed';
  nameKey?: string;
  labelKey?: string;
  color?: string;
  label?: string;
  labelClassName?: string;
  payload?: TooltipPayload[];
};

const ChartTooltipContent = React.forwardRef<HTMLDivElement, CustomTooltipProps>((props, ref) => {
  const {
    active,
    className,
    hideLabel = false,
    hideIndicator = false,
    labelFormatter,
    labelClassName,
    nameKey,
    labelKey,
    payload = [],
    color,
    label,
  } = props;

  const { config } = useChart();

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload.length) return null;
    const [item] = payload;
    const key = `${labelKey || item.dataKey || 'value'}`;
    const itemConfig = getPayloadConfigFromPayload(config, item, key);

    const labelValue =
      typeof label === 'string'
        ? config[label as keyof typeof config]?.label || label
        : itemConfig?.label;

    return (
      <div className={cn('font-medium', labelClassName)}>
        {labelFormatter ? labelFormatter(labelValue, payload) : labelValue}
      </div>
    );
  }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey]);

  if (!active || !payload.length) return null;

  return (
    <div
      ref={ref}
      className={cn(
        'grid min-w-[8rem] items-start gap-1.5 rounded-lg border bg-background px-2.5 py-1.5 text-xs shadow-xl',
        className,
      )}
    >
      {tooltipLabel}
      <div className="grid gap-1.5">
        {payload.map((item, index) => {
          const key = `${nameKey || item.dataKey || 'value'}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);
          const indicatorColor =
            color ||
            (item.payload && 'fill' in item.payload ? (item.payload?.fill as string) : item.color);

          return (
            <div key={item.dataKey?.toString() || index} className="flex items-center gap-2">
              {!hideIndicator && (
                <div className="h-2 w-2 rounded" style={{ backgroundColor: indicatorColor }} />
              )}
              <span>{itemConfig?.label || item.value}</span>
              <span>{item.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
});
ChartTooltipContent.displayName = 'ChartTooltipContent';

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    payload?: LegendPayload[];
    verticalAlign?: LegendProps['verticalAlign'];
    hideIcon?: boolean;
    nameKey?: string;
  }
>(({ className, hideIcon = false, payload = [], verticalAlign = 'bottom', nameKey }, ref) => {
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
      {payload.map((item, index) => {
        const key = `${nameKey || item.dataKey || 'value'}`;
        const itemConfig = config[key];
        return (
          <div key={item.dataKey?.toString() || index} className="flex items-center gap-1.5">
            {!hideIcon && (
              <div className="h-2 w-2 rounded" style={{ backgroundColor: item.color }} />
            )}
            <span>{itemConfig?.label || item.value}</span>
          </div>
        );
      })}
    </div>
  );
});
ChartLegendContent.displayName = 'ChartLegendContent';

function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: TooltipPayload,
  key: string,
): { label?: React.ReactNode; icon?: React.ComponentType } | undefined {
  const payloadPayload = typeof payload.payload === 'object' ? payload.payload : undefined;

  let configLabelKey = key;

  if (key in payload && typeof payload[key as keyof TooltipPayload] === 'string') {
    configLabelKey = payload[key as keyof TooltipPayload] as string;
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof (payloadPayload as Record<string, unknown>)[key] === 'string'
  ) {
    configLabelKey = (payloadPayload as Record<string, unknown>)[key] as string;
  }

  return configLabelKey in config ? config[configLabelKey] : config[key];
}

export {
  ChartContainer,
  RechartsTooltip as ChartTooltip,
  ChartTooltipContent,
  RechartsLegend as ChartLegend,
  ChartLegendContent,
  ChartStyle,
};
