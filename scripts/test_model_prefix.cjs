const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function test() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  // Try with 'models/' prefix
  const m = 'models/gemini-1.5-flash';
  try {
    const model = genAI.getGenerativeModel({ model: m });
    const result = await model.generateContent('hi');
    console.log('Success with models/gemini-1.5-flash');
  } catch (e) {
    console.log('Fail with models/gemini-1.5-flash:', e.status);
  }
}
test();
