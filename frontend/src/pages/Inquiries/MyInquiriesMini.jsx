import { useEffect, useState } from "react";
import api from "../../services/api";

const statusColor = {
  open: "bg-gray-200 text-gray-800",
  in_progress: "bg-blue-100 text-blue-700",
  resolved: "bg-green-100 text-green-700",
  closed: "bg-gray-300 text-gray-700",
};

export default function MyInquiriesMini() {
  const [inquiries, setInquiries] = useState([]);

  // 🔔 notification logic
  const hasNewReply = (inq) =>
    inq.adminReply && inq.status !== "closed";

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const res = await api.get("/inquiries/my");
      setInquiries(res.data.data || []);
    } catch {
      setInquiries([]);
    }
  };

  const handleCloseInquiry = async (id) => {
    const confirmClose = window.confirm(
      "Are you sure you want to close this inquiry?"
    );
    if (!confirmClose) return;

    try {
      await api.patch(`/inquiries/my/${id}/close`);
      fetchInquiries(); // refresh list
    } catch (err) {
      console.error("Failed to close inquiry", err);
    }
  };

  if (inquiries.length === 0) {
    return <p className="text-sm text-gray-500">No inquiries yet</p>;
  }

  return (
    <div className="space-y-3">
      {inquiries.map((inq) => (
        <div
          key={inq._id}
          className="rounded-md border p-3 text-sm bg-white"
        >
          {/* Header */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="font-medium">{inq.subject}</span>

              {/* 🔔 Admin reply notification */}
              {hasNewReply(inq) && (
                <span className="h-2 w-2 rounded-full bg-green-500" />
              )}
            </div>

            <span
              className={`px-2 py-0.5 rounded-full text-xs ${statusColor[inq.status]}`}
            >
              {inq.status.replace("_", " ")}
            </span>
          </div>

          {/* Message */}
          <p className="mt-1 text-gray-600 line-clamp-2">
            {inq.message}
          </p>

          {/* Admin Reply */}
          {inq.adminReply && (
            <p className="mt-2 text-xs text-green-700">
              <strong>Admin:</strong> {inq.adminReply}
            </p>
          )}

          {/* Close Inquiry */}
          {inq.status === "resolved" && (
            <button
              onClick={() => handleCloseInquiry(inq._id)}
              className="mt-2 text-xs text-red-600 hover:underline"
            >
              Close Inquiry
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
