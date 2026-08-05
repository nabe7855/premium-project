import fs from 'fs';

async function summarize() {
  const fileContent = fs.readFileSync('scratch/audit_result.json', 'utf8');
  console.log(fileContent.substring(0, 4000));
}

summarize().catch(console.error);
