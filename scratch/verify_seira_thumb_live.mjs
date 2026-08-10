import { execSync } from 'child_process';

function verifySeiraThumbLive() {
  console.log('=== VERIFYING WEBP THUMBNAIL LIVE IN HTML ===\n');

  const detailUrl = 'https://www.sutoroberrys.jp/store/fukuoka/interview/-130642/seira-interview-vol4';
  const detailHtml = execSync(`curl.exe -s "${detailUrl}"`, { encoding: 'utf8' });

  const hasNewWebp = detailHtml.includes('seira_interview_vol4_thumb_');
  console.log('Detail Article Page has new WebP Thumbnail URL (Expected: true):', hasNewWebp);

  const listUrl = 'https://www.sutoroberrys.jp/store/fukuoka/interview';
  const listHtml = execSync(`curl.exe -s "${listUrl}"`, { encoding: 'utf8' });
  const listHasNewWebp = listHtml.includes('seira_interview_vol4_thumb_');
  console.log('Interview List Page has new WebP Thumbnail URL (Expected: true):', listHasNewWebp);
}

verifySeiraThumbLive();
