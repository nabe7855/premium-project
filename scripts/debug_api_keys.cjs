const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function checkKeys() {
  const keys = [process.env.GEMINI_API_KEY, process.env.GEMINI_API_KEY_2].filter(Boolean);

  console.log(`Checking ${keys.length} API Keys...`);

  for (let i = 0; i < keys.length; i++) {
    const genAI = new GoogleGenerativeAI(keys[i]);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    try {
      const start = Date.now();
      const result = await model.generateContent('Hello');
      const end = Date.now();
      console.log(`[Key-${i}] ✅ Success! (${end - start}ms)`);
      console.log(`    Response sample: "${result.response.text().trim().substring(0, 20)}..."`);
    } catch (error) {
      console.error(`[Key-${i}] ❌ Error: Status ${error.status || 'Unknown'} - ${error.message}`);
      if (error.status === 404) {
        console.log(`    -> Note: Model name might be wrong or API not active for this project.`);
      }
    }
  }
}

checkKeys();
