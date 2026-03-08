const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  // List models is not directly available in standard GenAI SDK easily?
  // Let's try gemini-pro or gemini-2.0-flash

  const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash-exp', 'gemini-2.0-flash'];
  for (const m of models) {
    try {
      const model = genAI.getGenerativeModel({ model: m });
      const result = await model.generateContent('hi');
      console.log(`Model ${m}: Success`);
      break;
    } catch (e) {
      console.log(`Model ${m}: Error ${e.status || e.message}`);
    }
  }
}
listModels();
