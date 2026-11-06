import ChatWidget from "@/components/ChatWidget";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-sans">
      {/* Minimal Top Brand Bar */}
      <header className="border-b border-neutral-200 px-6 py-4 bg-white">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-black text-white font-bold flex items-center justify-center text-xs">
              T
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-black">
                Towa
              </span>
              <span className="text-xs text-neutral-500 block -mt-1">
                towastore.shop
              </span>
            </div>
          </div>

          <span className="text-xs px-3 py-1 rounded-full border border-neutral-200 bg-neutral-50 text-neutral-600 font-medium">
            AI Customer Support Active
          </span>
        </div>
      </header>

      {/* Clean Screen */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 flex flex-col items-center justify-center text-center">
        <div className="max-w-md p-8 rounded-2xl border border-neutral-200 bg-neutral-50 shadow-xs">
          <div className="w-10 h-10 rounded-full bg-black text-white mx-auto flex items-center justify-center font-bold mb-3">
            T
          </div>
          <h1 className="text-lg font-bold text-black">
            Towa Customer Support
          </h1>
          <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
            স্ক্রিনের নিচে ডান কোণায় থাকা কালো চ্যাট বাটনে ক্লিক করে সরাসরি সাপোর্ট এক্সিকিউটিভের সাথে চ্যাট করুন।
          </p>
        </div>
      </main>

      {/* Floating Chat Widget */}
      <ChatWidget />
    </div>
  );
}
