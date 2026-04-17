import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

async function checkModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    fs.writeFileSync('model_list_error.txt', 'Error: GEMINI_API_KEY is not set in .env');
    return;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // モデル名に明示的なプレフィックスを付けるテスト
    const models = [
      'models/gemini-1.5-flash',
      'models/gemini-1.5-flash-latest',
      'gemini-1.5-flash',
      'gemini-pro'
    ];
    
    let result = "--- API Key Network Access Check ---\n";
    for (const m of models) {
      try {
        const model = genAI.getGenerativeModel({ model: m });
        result += `Testing ${m}... `;
        const testResult = await model.generateContent("Hi");
        const response = await testResult.response;
        result += `Success: ${response.text().substring(0, 10)}...\n`;
      } catch (e: any) {
        result += `Failed to call ${m}: ${e.message}\n`;
      }
    }
    
    fs.writeFileSync('model_check_result.txt', result);
  } catch (error: any) {
    fs.writeFileSync('model_list_error.txt', error.message);
  }
}

checkModels();
