const fs = require('fs');
const RAW_PATH = 'data/raw_hotel_data/hotels_raw_data.json';
const PROCESSED_PATH = 'data/processed_hotel_data/hotels_processed_data.json';

try {
  const data = JSON.parse(fs.readFileSync(RAW_PATH, 'utf8'));
  const hotelIds = Object.keys(data);
  console.log(`Read ${hotelIds.length} hotels.`);

  for (const id of hotelIds) {
    data[id].processing_status = 'pending';
  }

  fs.writeFileSync(PROCESSED_PATH, JSON.stringify(data, null, 2));
  console.log(`Initialized ${hotelIds.length} hotels with 'pending' status in ${PROCESSED_PATH}`);
} catch (err) {
  console.error('Error:', err);
}
