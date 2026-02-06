import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../services/api";

export default function AdminFeedbackDetails() {
  const { feedbackId } = useParams();
  const navigate = useNavigate();

  const [feedback, setFeedback] = useState(null);
  const [status, setStatus] = useState("approved");
  const [adminReply, setAdminReply] = useState("");

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const res = await api.get(`/feedbacks/admin/${feedbackId}`);
      setFeedback(res.data.data);
      setStatus(res.data.data.status);
      setAdminReply(res.data.data.adminReply || "");
    } catch (err) {
      console.error("Failed to fetch feedback", err);
    }
  };

  const handleUpdate = async () => {
    try {
      await api.patch(`/feedbacks/admin/${feedbackId}`, {
        status,
        adminReply,
      });

      alert("Feedback updated");
      navigate("/dashboard/feedbacks");
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  if (!feedback) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-xl font-semibold mb-4">
        Feedback Details
      </h1>

      <div className="space-y-3 text-sm">
        <p>
          <strong>User:</strong>{" "}
          {feedback.userID?.username}
        </p>

        <p>
          <strong>Product:</strong>{" "}
          {feedback.productID?.name}
        </p>

        <p>
          <strong>Rating:</strong>{" "}
          {"⭐".repeat(feedback.rating)}
        </p>

        <p>
          <strong>Verified Purchase:</strong>{" "}
          {feedback.isVerifiedPurchase ? "Yes" : "No"}
        </p>

        {feedback.description && (
          <p className="border p-3 rounded bg-gray-50">
            {feedback.description}
          </p>
        )}
      </div>

      <div className="mt-4 space-y-3">
        <textarea
          value={adminReply}
          onChange={(e) => setAdminReply(e.target.value)}
          placeholder="Admin reply (optional)"
          className="w-full border rounded p-2 text-sm"
          rows={3}
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded p-2 text-sm"
        >
          <option value="approved">Approve</option>
          <option value="rejected">Reject</option>
          <option value="pending">Pending</option>
        </select>

        <div className="space-x-3">
          <button
            onClick={handleUpdate}
            className="bg-black text-white px-4 py-2 rounded text-sm"
          >
            Save
          </button>

          <button
            onClick={() => navigate("/dashboard/feedbacks")}
            className="text-gray-600 hover:underline text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
