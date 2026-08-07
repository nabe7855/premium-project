import fs from 'fs';

function findUrls() {
  const data = JSON.parse(fs.readFileSync('scratch/lh_report.json', 'utf8'));
  const networkItems = data.audits['network-requests']?.details?.items || [];
  
  const supabaseUrls = networkItems
    .map(i => i.url)
    .filter(u => u.includes('supabase.co/storage/v1/object/public/'));

  console.log('Found Supabase Storage URLs in Lighthouse report:');
  console.log(supabaseUrls);
}

findUrls();
