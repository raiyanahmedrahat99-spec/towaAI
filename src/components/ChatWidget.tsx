"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, RefreshCw } from "lucide-react";

interface Message {
  role: "user" | "model";
  text: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "Towa কাস্টমার সার্ভিসে আপনাকে আন্তরিক ধন্যবাদ। আমাদের সেবা বা পণ্য সম্পর্কে আপনার যেকোনো জিজ্ঞাসা অনুগ্রহ করে লিখুন, আমি আপনাকে সহায়তা করছি।",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: Message = { role: "user", text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    if (!textToSend) setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: updatedMessages.slice(0, -1),
        }),
      });

      const data = await response.json();

      if (data.success && data.reply) {
        setMessages((prev) => [...prev, { role: "model", text: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "model",
            text:
              data.fallbackReply ||
              "আন্তরিকভাবে দুঃখিত, সংযোগের সমস্যার কারণে উত্তরটি দেওয়া সম্ভব হচ্ছে না। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "সংযোগ বিচ্ছিন্ন হয়েছে। অনুগ্রহ করে আপনার ইন্টারনেট সংযোগটি চেক করে আবার বার্তা পাঠান।",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([
      {
        role: "model",
        text: "Towa কাস্টমার কেয়ার। আপনার যেকোনো তথ্যের জন্য অনুগ্রহ করে প্রশ্নটি লিখুন।",
      },
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans antialiased">
      {/* 1. Floating Circular Launcher Button with Smooth Pulse Animation */}
      <div
        className={`transition-all duration-300 transform ${
          isOpen ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100"
        }`}
      >
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-black text-white shadow-2xl hover:bg-neutral-800 hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white cursor-pointer"
          aria-label="Open Towa Support Chat"
        >
          <MessageSquare className="w-6 h-6 text-white transition-transform duration-300 group-hover:scale-110" />
          <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-40"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-white border-2 border-black"></span>
          </span>
        </button>
      </div>

      {/* 2. Floating Popup Chat Window with Spring Zoom & Fade Animation */}
      <div
        className={`transition-all duration-300 origin-bottom-right transform ${
          isOpen
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-90 opacity-0 translate-y-4 pointer-events-none absolute bottom-0 right-0"
        }`}
      >
        <div className="w-[360px] sm:w-[380px] h-[520px] max-h-[85vh] flex flex-col rounded-2xl bg-white border border-neutral-300 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 bg-black text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-white text-black font-extrabold flex items-center justify-center text-xs tracking-wider shadow-xs">
                T
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-tight text-white leading-none">
                  Towa Support
                </h3>
                <span className="text-[11px] text-neutral-400">
                  towastore.shop
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={resetChat}
                title="রিসেট করুন"
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="বন্ধ করুন"
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sub Header Notice */}
          <div className="px-3.5 py-1.5 bg-neutral-100 border-b border-neutral-200 text-[11px] text-neutral-700 font-medium flex justify-between">
            <span>১০০% ক্যাশ অন ডেলিভারি (COD)</span>
            <span>SMS আপডেট সুবিধা</span>
          </div>

          {/* Messages Container with Slide & Fade Animations */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-50/70">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed shadow-xs ${
                    msg.role === "user"
                      ? "bg-black text-white rounded-br-none"
                      : "bg-white text-neutral-900 border border-neutral-200 rounded-bl-none whitespace-pre-line"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing Loader Indicator with animated pulsing dots */}
            {isLoading && (
              <div className="flex justify-start animate-in fade-in duration-200">
                <div className="bg-white text-neutral-600 border border-neutral-200 rounded-2xl rounded-bl-none px-4 py-2.5 text-[12px] flex items-center gap-2 shadow-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-neutral-900 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-neutral-900 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-neutral-900 rounded-full animate-bounce"></span>
                  </div>
                  <span className="text-[11px] text-neutral-500 font-medium">সহায়তা লিখছি...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Field with focus transition */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-neutral-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="আপনার প্রশ্নটি এখানে লিখুন..."
              disabled={isLoading}
              className="flex-1 bg-neutral-100 text-neutral-900 placeholder-neutral-400 text-[13px] px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-black focus:bg-white transition-all duration-200"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center hover:bg-neutral-800 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed shrink-0 cursor-pointer shadow-xs active:scale-95"
              aria-label="Send Message"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
