import { useState } from "react";
import api from "../../../services/api.js";

export default function EditDeliveryPersonModal({
  user,
  onClose,
  onSuccess,
}) {
  const [form, setForm] = useState({
    fullname: user.fullname || "",
    phone: user.phone || "",
    gender: user.gender || "",
    address: user.address || "",
    street: user.street || "",
    city: user.city || "",
    state: user.state || "",
    pincode: user.pincode || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================================
     HANDLE INPUT CHANGE
  ================================= */
  const handleChange = (e) => {
    setError("");
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* ================================
     UPDATE USER
  ================================= */
  const handleUpdate = async () => {
    setError("");

    try {
      setLoading(true);

      await api.patch(`/users/admin/${user._id}`, form);

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update delivery person"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh]">
        {/* ================= HEADER ================= */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Edit Delivery Person
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
        </div>

        {/* ================= ERROR ================= */}
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded">
            {error}
          </div>
        )}

        {/* ================= FORM ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <input
            type="text"
            name="fullname"
            placeholder="Full Name"
            value={form.fullname}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
          />

          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="border px-3 py-2 rounded md:col-span-2"
          />

          <input
            type="text"
            name="street"
            placeholder="Street"
            value={form.street}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
          />

          <input
            type="text"
            name="state"
            placeholder="State"
            value={form.state}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
          />

          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={form.pincode}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
          />
        </div>

        {/* ================= ACTIONS ================= */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
