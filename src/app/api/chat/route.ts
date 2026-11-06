import { NextRequest, NextResponse } from "next/server";
import { getTowaSupportReply } from "@/lib/gemini";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history } = body;

    if (!message || typeof message !== "string" || message.trim() === "") {
      return NextResponse.json(
        { success: false, error: "মেসেজ লিখুন।" },
        { status: 400 }
      );
    }

    const reply = await getTowaSupportReply(message.trim(), history || []);

    return NextResponse.json({
      success: true,
      reply,
    });
  } catch (error: any) {
    console.error("[Chat API Error]:", error?.message || error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Internal server error",
        fallbackReply:
          "বর্তমানে সার্ভার সংযোগে সমস্যা হচ্ছে। কিছুক্ষণ পর আবার চেষ্টা করুন।",
      },
      { status: 500 }
    );
  }
}
