const fs = require('fs');
const FILE_PATH = 'data/processed_hotel_data/hotels_processed_data.json';
const OUTPUT_PATH = 'tmp_pending_30.json';

try {
  const content = fs.readFileSync(FILE_PATH, 'utf8');
  const d = JSON.parse(content);
  const pendingIds = Object.keys(d)
    .filter((k) => d[k].processing_status === 'pending')
    .slice(0, 30);

  const result = pendingIds.map((id) => {
    const h = d[id];
    return {
      id,
      name: h.hotel_name,
      desc: h.description,
      am: h.amenities ? h.amenities.slice(0, 10) : [],
      pr: h.prices || {},
      rev: h.reviews ? h.reviews.slice(0, 2) : [],
    };
  });

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(result, null, 2));
  console.log(`Successfully extracted ${result.length} hotels.`);
} catch (e) {
  console.error('Error:', e.message);
}
