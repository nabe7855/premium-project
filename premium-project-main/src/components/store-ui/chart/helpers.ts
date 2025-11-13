import { ChartConfig } from './context';

export function getPayloadConfigFromPayload(config: ChartConfig, payload: any, key: string) {
  const payloadPayload = payload?.payload;
  let configLabelKey: string = key;

  if (typeof payload[key] === 'string') {
    configLabelKey = payload[key];
  } else if (payloadPayload && typeof payloadPayload[key] === 'string') {
    configLabelKey = payloadPayload[key];
  }

  return config[configLabelKey] ?? config[key];
}
