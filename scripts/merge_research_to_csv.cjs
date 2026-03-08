const fs = require('fs');
const path = require('path');

function mergeResearchToCSV() {
  const csvPath = path.join(process.cwd(), 'data', 'hotels_base_data.csv');
  const jsonPath = path.join(process.cwd(), 'data', 'hotels_research_facts.json');

  if (!fs.existsSync(jsonPath)) {
    console.error('Research JSON not found.');
    return;
  }

  const facts = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const factMap = new Map(facts.map((f) => [f.id, f.fact]));

  const rawData = fs.readFileSync(csvPath, 'utf8');
  const lines = rawData.split('\n');
  const header = lines[0];

  const updatedLines = lines.slice(1).map((line) => {
    const parts = line.split(','); // 簡易版。実際は引用符考慮が必要
    const id = parts[0];

    if (factMap.has(id)) {
      const factText = factMap.get(id);
      // 事実テキストをアメニティと口コミにパース（簡易）
      const amenities = factText.match(/設備:(.*)/)?.[1] || '';
      const reviews = factText.match(/口コミ:(.*)/)?.[1] || '';

      // CSVのカラムを埋める (5番目: scraped_amenities, 6番目: scraped_reviews)
      parts[5] = `"${amenities.replace(/"/g, '""').trim()}"`;
      parts[6] = `"${reviews.replace(/"/g, '""').trim()}"`;
    }
    return parts.join(',');
  });

  const finalCsv = [header, ...updatedLines].join('\n');
  fs.writeFileSync(path.join(process.cwd(), 'data', 'hotels_enriched_data.csv'), finalCsv, 'utf8');
  console.log('✅ 情報を統合したCSVを作成しました: hotels_enriched_data.csv');
}

mergeResearchToCSV();
