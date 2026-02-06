import { useState } from "react";
import api from "../../services/api";
import { useNavigate, useLocation } from "react-router-dom";

export default function InquiryForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const [type, setType] = useState("inquiry");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!subject || !message) {
      setError("Subject and message are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.post("/inquiries", {
        type,
        subject,
        message,
      });

      setSubject("");
      setMessage("");
      alert("Inquiry submitted successfully");
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.setItem("redirectAfterLogin", location.pathname);
        navigate("/login");
      } else {
        setError("Failed to submit inquiry");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="w-full rounded-md border px-3 py-2 text-sm"
      >
        <option value="inquiry">Inquiry</option>
        <option value="complaint">Complaint</option>
        <option value="return">Return</option>
        <option value="payment">Payment</option>
        <option value="other">Other</option>
      </select>

      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="w-full rounded-md border px-3 py-2 text-sm"
      />

      <textarea
        placeholder="Describe your issue"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full rounded-md border px-3 py-2 text-sm resize-none"
        rows={4}
      />

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full rounded-md bg-black py-2 text-sm text-white hover:bg-gray-800"
      >
        {loading ? "Submitting..." : "Submit Inquiry"}
      </button>
    </div>
  );
}
