/**
 * クライアントサイドで画像を圧縮し、WebP形式に変換する
 * @param file 圧縮前の画像ファイル
 * @param quality 圧縮クオリティ (0.0 〜 1.0)
 * @param maxWidth 最大幅 (デフォルト: 1200px)
 * @returns 圧縮・変換後のBlob
 */
export async function compressAndConvertToWebP(
  file: File,
  quality: number = 0.8,
  maxWidth: number = 1200,
): Promise<Blob> {
  // 画像ファイルでない場合はそのまま返す（念のため）
  if (!file.type.startsWith('image/')) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // アスペクト比を維持しながらリサイズ
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context could not be created'));
          return;
        }

        // 背景を白にする（透過画像が黒くならないように）
        // ただしWebPは透過対応しているので、単純に描画だけでもOK
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Canvas toBlob failed'));
            }
          },
          'image/webp',
          quality,
        );
      };
      img.onerror = (err) => reject(new Error('Image load failed'));
    };
    reader.onerror = (err) => reject(new Error('File read failed'));
  });
}
