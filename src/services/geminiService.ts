import { GoogleGenAI } from '@google/genai';
import { Client, MockData, Message } from '../types';

let aiClient: GoogleGenAI | null = null;

function getAI() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

const getSystemInstruction = (client: Client | null, data: MockData | null) => {
  let basePrompt = `You are TaxAssist Pro, an elite AI Tax Assistant tailored for Chartered Accountants, financial advisors, and modern enterprises in India.
Your main role is to provide expert tax advice, analyze GST data, draft compliance notices, and assist with complex financial reconciliations.

CORE RULES:
1. PROFESSIONAL EXPERTISE: Respond with clarity, precision, and a highly professional tone. Layout data using Markdown (tables, bullet points).
2. REJECT IRRELEVANT QUERIES: If asked about general chat, pop culture, non-tax coding, loudly decline and steer back to Indian taxation and finance.
3. CONTEXT AWARENESS: You can answer general tax queries without a specific client. If a user asks a client-specific question (like "what is my liability?") and NO client is selected, politely ask them to select a client using the selector above the chat.
4. MOCK FILES: If requested to generate a report, provide a descriptive markdown link, e.g., [\`Download [Report Name].pdf\`](#download-mock), indicating the document is ready.`;

  if (client && data) {
    basePrompt += `\n\n--- CURRENT WORKSPACE CONTEXT ---
Name: ${client.name}
GSTIN: ${client.gstin}
PAN: ${client.pan}

MOCK DATABASE:
- Books of Accounts: ${data.booksAccounts}
- Filed Returns: ${data.filedReturns}
- Pending Returns: ${data.pendingReturns}
- Notices: ${data.notices}
- Tax Liability: ${data.taxLiability}
- ITC: ${data.itc}
- Ledger Balances: ${data.ledgerBalances}
- Reconciliation: ${data.reconciliation}

Strictly ground your answers using this database when asked about client data.`;
  } else {
    basePrompt += `\n\n--- NO ACTIVE CLIENT ---
The user currently has NO client selected. You may answer general tax law and compliance questions, but for specific financial data queries, instruct the user to select a client context.`;
  }

  return basePrompt;
};

export async function chatWithTaxBot(
  history: Message[],
  newMessage: string,
  client: Client | null,
  data: MockData | null,
  onStream: (text: string) => void
) {
  const ai = getAI();

  if (!ai) {
    const response = "👋 **Welcome to the TaxMind AI Demo!**\n\nI'm currently running in **offline/demo mode** because no Gemini API key was found in the environment secrets.\n\nIn a production environment, I would analyze your client registers (like the GSTR maps and ITC ledgers) to provide precise taxation advice. For now, you can still explore the interface and view your session's chat history!\n\n*To enable full intelligence, please add your `GEMINI_API_KEY` in the workspace settings.*";
    
    let current = "";
    const words = response.split(" ");
    for (const word of words) {
      current += word + " ";
      onStream(current);
      await new Promise(r => setTimeout(r, 20));
    }
    return response;
  }

  try {

    const formattedHistory = history
      .filter(msg => msg.content.trim() !== '') // Filter out empty messages that might break the API
      .map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: [
        ...formattedHistory,
        { role: 'user', parts: [{ text: newMessage }] }
      ],
      config: {
        systemInstruction: getSystemInstruction(client, data),
        temperature: 0.2,
      }
    });

    let fullOutput = '';
    for await (const chunk of responseStream) {
       const chunkText = chunk.text;
       if (chunkText) {
         fullOutput += chunkText;
         onStream(fullOutput);
       }
    }
    return fullOutput;

  } catch (error) {
    console.error("Detailed Gemini API Error:", error);
    // Re-throw with a more descriptive message if possible
    if (error instanceof Error) {
      if (error.message.includes('API_KEY_INVALID')) {
        throw new Error("Invalid Gemini API Key. Please check your secrets configuration.");
      }
    }
    throw error;
  }
}
