export function extractImageUrls(content: any): string[] {
  const urls: string[] = [];
  const traverse = (obj: any) => {
    if (!obj) return;
    if (typeof obj === 'string') {
      if (obj.includes('/storage/v1/object/public/')) {
        urls.push(obj);
      }
      return;
    }
    if (Array.isArray(obj)) {
      obj.forEach(traverse);
      return;
    }
    if (typeof obj === 'object') {
      Object.values(obj).forEach(traverse);
    }
  };
  traverse(content);
  return urls;
}
