const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function list() {
  const g = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  // Actually, listModels is in the genAI client if it's recent enough, or use REST?
  // SDK 0.24 has it.
  try {
    // Wait, listModels used to be separate.
    // Let's use REST to be sure.
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`,
    );
    const data = await resp.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.log(e);
  }
}
list();
