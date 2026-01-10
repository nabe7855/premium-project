
import { SessionRecord } from "@/types/counseling&survey";

const STORAGE_KEY = 'healing_pulse_records';

export const saveRecord = (record: SessionRecord) => {
  const existing = getRecords();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([record, ...existing]));
};

export const getRecords = (): SessionRecord[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const getDeviceType = () => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "tablet";
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return "mobile";
  }
  return "desktop";
};
