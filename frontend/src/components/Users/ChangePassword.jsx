import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api.js";

export default function ChangePassword() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setError("");
    setSuccess("");
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    const { oldPassword, newPassword, confirmPassword } = form;

    // Frontend validations
    if (!oldPassword || !newPassword || !confirmPassword) {
      return setError("All fields are required");
    }

    if (newPassword.length < 8) {
      return setError("New password must be at least 8 characters long");
    }

    if (newPassword !== confirmPassword) {
      return setError("New password and confirm password do not match");
    }

    if (oldPassword === newPassword) {
      return setError("New password must be different from old password");
    }

    try {
      setLoading(true);

      await api.post("/users/change-password", {
        oldPassword,
        newPassword,
      });

      setSuccess("Password changed successfully");
      setForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header with Back button */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back
        </button>

        <h2 className="text-xl font-semibold">Change Password</h2>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 text-sm text-green-600 bg-green-50 border border-green-200 px-4 py-2 rounded">
          {success}
        </div>
      )}

      <div className="space-y-4 max-w-xl text-gray-600">
        <input
          type="password"
          name="oldPassword"
          placeholder="Old Password"
          value={form.oldPassword}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={form.newPassword}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm New Password"
          value={form.confirmPassword}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-orange-500 text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>

        {/* Secondary back option (safe fallback) */}
        <Link
          to="/profile"
          className="text-sm text-orange-600 hover:underline block text-center"
        >
          Back to Account
        </Link>
      </div>
    </div>
  );
}
