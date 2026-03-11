const { GoogleGenerativeAI } = require('@google/generative-ai');

// Alt key from .env
const API_KEY = 'AIzaSyD1WKfwCbvtztk6EgUhVHUnMbjCKCVzGXE';
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

async function test() {
  try {
    const result = await model.generateContent("Say 'Ready' if you can read this.");
    console.log('RESPONSE:', result.response.text());
  } catch (err) {
    console.error('FULL ERROR:', JSON.stringify(err, null, 2));
    console.error('MESSAGE:', err.message);
  }
}

test();
