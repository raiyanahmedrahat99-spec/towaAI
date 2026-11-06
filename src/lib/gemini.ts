import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = (process.env.GEMINI_API_KEY || "").trim();

if (!apiKey) {
  console.error("[CRITICAL ERROR]: GEMINI_API_KEY is missing from environment.");
}

const genAI = new GoogleGenerativeAI(apiKey);

export const SYSTEM_INSTRUCTION = `
আপনি 'Towa' (towastore.shop)-এর অফিশিয়াল কাস্টমার সাপোর্ট এক্সিকিউটিভ এআই।

আচরণবিধি ও বাচনভঙ্গি (Customer Care Etiquette):
১. গ্রাহকের সাথে অত্যন্ত বিনয়ী, শ্রদ্ধাশীল, মার্জিত এবং আন্তরিক ভঙ্গিতে কথা বলুন (যেমন: 'আপনি', 'অনুগ্রহ করে', 'ধন্যবাদ')।
২. কোনো অতিরিক্ত শুভেচ্ছা (যেমন: সালাম, নমস্কার, হ্যালো) ছাড়াই সরাসরি কিন্তু অত্যন্ত বিনীত ও সহযোগিতাপূর্ণ ভাষায় প্রশ্নের সমাধান দিন।
৩. গ্রাহক বাংলায় লিখলে বিশুদ্ধ ও মার্জিত বাংলায় এবং ইংরেজিতে লিখলে সম্মানজনক ইংরেজিতে উত্তর দিন।
৪. ভাষা হবে প্রাঞ্জল, স্পষ্ট, সংক্ষিপ্ত এবং পেশাদার। কোনো ফালতু রোবটিক টেক্সট বা ইমোজি ব্যবহার করবেন না।

Towa সম্পর্কিত তথ্য (towastore.shop):
- পেমেন্ট: সারা বাংলাদেশে শতভাগ ক্যাশ অন ডেলিভারি (Cash on Delivery - COD)। ওয়েবসাইটে কোনো প্রকার অগ্রিম অনলাইন পেমেন্ট নেওয়া হয় না। গ্রাহক পণ্য হাতে পেয়ে দেখে নিশ্চিন্তে মূল্য পরিশোধ করবেন।
- ডেলিভারি ও ট্র্যাকিং: প্রতিটি অর্ডার কনফার্মেশন এবং শিপিং ট্র্যাকিং আপডেট স্বয়ংক্রিয়ভাবে গ্রাহকের মোবাইল নম্বরে এসএমএস (SMS)-এর মাধ্যমে পৌঁছে দেওয়া হয়।
- প্রোডাক্ট ক্যাটালগ: নিত্যপ্রয়োজনীয় গ্রোসারি, স্ন্যাকস, বিস্কুট এবং টয়লেট্রিজ মিলিয়ে ১৮৬টিরও বেশি কিউরেটেড প্রোডাক্ট রয়েছে।
- কোনো ইমেইল ঠিকানা অপ্রয়োজনে উল্লেখ করবেন না। গ্রাহক যা জানতে চান ঠিক ততটুকুই অত্যন্ত বিনয়ের সাথে বুঝিয়ে বলুন।
`;

export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

async function callWithTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("Request timed out")), timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
}

/**
 * Directly calls Google Gemini API (starting with Gemini 3.8 / Flash) with polite executive tone
 */
export async function getTowaSupportReply(
  userMessage: string,
  rawHistory: ChatMessage[] = []
): Promise<string> {
  const formattedHistory: Array<{ role: "user" | "model"; parts: [{ text: string }] }> = [];
  let userTurnFound = false;

  for (const msg of rawHistory) {
    if (!userTurnFound) {
      if (msg.role === "user" && msg.text.trim()) {
        userTurnFound = true;
        formattedHistory.push({
          role: "user",
          parts: [{ text: msg.text.trim() }],
        });
      }
    } else {
      if (msg.text.trim()) {
        formattedHistory.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.text.trim() }],
        });
      }
    }
  }

  const candidateModels = ["gemini-3.8-flash", "gemini-flash-lite-latest", "gemini-2.5-flash-lite"];

  for (const modelName of candidateModels) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: SYSTEM_INSTRUCTION,
        generationConfig: {
          temperature: 0.25,
          topP: 0.8,
          maxOutputTokens: 500,
        },
      });

      const chat = model.startChat({
        history: formattedHistory,
      });

      const result = await callWithTimeout(chat.sendMessage(userMessage.trim()), 7000);
      const response = await result.response;
      const text = response.text().trim();

      if (text) {
        return text;
      }
    } catch (err: any) {
      console.warn(`[Gemini model ${modelName} delayed/busy, trying next candidate]:`, err?.message || err);
    }
  }

  throw new Error("Unable to retrieve response from Google Gemini API.");
}
