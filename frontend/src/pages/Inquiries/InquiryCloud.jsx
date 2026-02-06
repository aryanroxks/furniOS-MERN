import { useState } from "react";
import { HelpCircle, X } from "lucide-react";
import InquiryForm from "./InquiryForm";
import MyInquiriesMini from "./MyInquiriesMini";

export default function InquiryCloud() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState("form"); // form | my

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-black px-4 py-3 text-white shadow-lg hover:bg-gray-800"
      >
        <HelpCircle size={18} />
        Need Help?
      </button>

      {/* Cloud Panel */}
      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-[360px] rounded-2xl bg-white shadow-2xl border overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h3 className="font-semibold text-gray-800">
              Support
            </h3>
            <button onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b text-sm">
            <button
              onClick={() => setView("form")}
              className={`flex-1 py-2 ${
                view === "form"
                  ? "border-b-2 border-black font-medium"
                  : "text-gray-500"
              }`}
            >
              New Inquiry
            </button>
            <button
              onClick={() => setView("my")}
              className={`flex-1 py-2 ${
                view === "my"
                  ? "border-b-2 border-black font-medium"
                  : "text-gray-500"
              }`}
            >
              My Inquiries
            </button>
          </div>

          {/* Content */}
          <div className="p-4 max-h-[420px] overflow-y-auto">
            {view === "form" ? <InquiryForm /> : <MyInquiriesMini />}
          </div>
        </div>
      )}
    </>
  );
}
