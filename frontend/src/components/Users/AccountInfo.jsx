import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../services/api.js";

export default function AccountInfo() {
  const [user, setUser] = useState({
    fullname: "",
    email: "",
    phone: "",
    gender: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/current-user");
        const user = res.data.data;

        setUser({
          fullname: user.fullname || "",
          email: user.email || "",
          phone: user.phone || "",
          gender: user.gender || "",
        });

        setOriginalEmail(user.email);
      } catch (error) {
        console.log("Failed to load user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setError("");
    setSuccess("");
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    setShowOtpModal(false);

    try {
      const res = await api.patch("/users/update-profile", user);

      if (res.data.data.otpRequired) {
        setShowOtpModal(true);
      } else {
        setSuccess("Account information updated successfully");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleOtpVerify = async () => {
    try {
      await api.post("/users/verify-email-otp", { otp });

      setShowOtpModal(false);
      setOtp("");
      setSuccess("Email verified and account updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Account Info</h2>

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
          type="text"
          name="fullname"
          placeholder="Full Name"
          value={user.fullname}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={user.email}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          value={user.phone}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />

        <select
          name="gender"
          value={user.gender}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        >
          <option value="">Select Gender</option>
          <option value="male">male</option>
          <option value="female">female</option>
          <option value="other">other</option>
        </select>

        <button
          onClick={handleUpdate}
          disabled={saving}
          className="w-full bg-orange-500 text-white py-2 rounded disabled:opacity-50"
        >
          {saving ? "Saving..." : "Update"}
        </button>

        <Link
          to="/profile/change-password"
          className="text-sm text-orange-600 hover:underline block text-center"
        >
          Change Password?
        </Link>
      </div>

      {showOtpModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Verify Email</h3>

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border px-4 py-2 rounded mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={handleOtpVerify}
                className="flex-1 bg-orange-500 text-white py-2 rounded"
              >
                Verify
              </button>

              <button
                onClick={() => setShowOtpModal(false)}
                className="flex-1 border py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
