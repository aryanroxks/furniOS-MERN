import { useState } from "react";
import api from "../../services/api.js";


export default function ForgotPasswordModal({ onClose }) {
  const [step, setStep] = useState(1); // 1 = email, 2 = otp
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // STEP 1: Send OTP
  const handleSendOtp = async () => {
    setError("");
    setSuccess("");

    if (!email) {
      return setError("Email is required");
    }

    try {
      setLoading(true);
      await api.post("/users/forgot-password", { email });
      setSuccess("OTP sent to your email");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP & Reset Password
  const handleResetPassword = async () => {
    setError("");
    setSuccess("");

    if (!otp || !newPassword || !confirmPassword) {
      return setError("All fields are required");
    }

    if (newPassword.length < 8) {
      return setError("Password must be at least 8 characters");
    }

    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);
      await api.post("/users/reset-password", {
        email,
        otp,
        newPassword,
      });

      setSuccess("Password reset successfully");
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-4">
          {step === 1 ? "Forgot Password" : "Reset Password"}
        </h3>

        {error && (
          <p className="text-sm text-red-600 mb-3">{error}</p>
        )}

        {success && (
          <p className="text-sm text-green-600 mb-3">{success}</p>
        )}

        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-4 py-2 rounded mb-4"
            />

            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-[#100F57] text-white py-2 rounded disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border px-4 py-2 rounded mb-3"
            />

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border px-4 py-2 rounded mb-3"
            />

            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border px-4 py-2 rounded mb-4"
            />

            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full bg-[#100F57] text-white py-2 rounded disabled:opacity-60"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}

        <button
          onClick={onClose}
          className="w-full mt-3 border py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
