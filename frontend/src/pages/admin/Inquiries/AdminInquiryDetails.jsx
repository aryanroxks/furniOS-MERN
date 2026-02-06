import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../services/api";

export default function AdminInquiryDetails() {
  const { inquiryId } = useParams();
  const navigate = useNavigate();

  const [inquiry, setInquiry] = useState(null);
  const [reply, setReply] = useState("");
  const [status, setStatus] = useState("in_progress");

  useEffect(() => {
    fetchInquiry();
  }, []);

  const fetchInquiry = async () => {
    try {
      const res = await api.get(`/inquiries/admin/${inquiryId}`);
      setInquiry(res.data.data);
      setReply(res.data.data.adminReply || "");
      setStatus(res.data.data.status);
    } catch (err) {
      console.error("Failed to fetch inquiry", err);
    }
  };

  const handleReply = async () => {
    try {
      await api.patch(`/inquiries/admin/${inquiryId}/reply`, {
        adminReply: reply,
        status,
      });
      alert("Reply sent");
      navigate("/dashboard/inquiries");
    } catch (err) {
      console.error("Reply failed", err);
    }
  };

  if (!inquiry) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-xl font-semibold mb-4">
        Inquiry Details
      </h1>

      <div className="space-y-3 text-sm">
        <p>
          <strong>User:</strong>{" "}
          {inquiry.userID?.username} ({inquiry.userID?.email})
        </p>

        <p>
          <strong>Type:</strong> {inquiry.type}
        </p>

        {inquiry.productID && (
          <p>
            <strong>Product:</strong>{" "}
            {inquiry.productID.name}
          </p>
        )}

        <p>
          <strong>Status:</strong>{" "}
          {inquiry.status.replace("_", " ")}
        </p>

        <p>
          <strong>Subject:</strong> {inquiry.subject}
        </p>

        <p className="border p-3 rounded bg-gray-50">
          {inquiry.message}
        </p>
      </div>

      <div className="mt-4 space-y-3">
        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          rows={4}
          placeholder="Write admin reply..."
          className="w-full border rounded p-2 text-sm"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded p-2 text-sm"
        >
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>

        <div className="space-x-3">
          <button
            onClick={handleReply}
            className="bg-black text-white px-4 py-2 rounded text-sm"
          >
            Send Reply
          </button>

          <button
            onClick={() => navigate("/admin/inquiries")}
            className="text-gray-600 hover:underline text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
