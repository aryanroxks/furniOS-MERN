import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../services/api";

// ===== ROLE CONSTANTS (ID ONLY) =====
const ROLES = {
  admin: "6952c7fedae4dbfc1f6977ac",
  retail_customer: "6952c7c7dae4dbfc1f6977a6",
  wholesale_customer: "6952c80adae4dbfc1f6977b0",
  delivery_person: "6952c813dae4dbfc1f6977b4",
};

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  const [roleID, setRoleID] = useState("");

  const [form, setForm] = useState({
    username: "",
    email: "",
    fullname: "",
    phone: "",
    gender: "",
    address: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    gstNumber: "",
  });

  /* ================= FETCH USER ================= */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/users/${id}`);
        const user = res.data.data;

        setForm({
          username: user.username || "",
          email: user.email || "",
          fullname: user.fullname || "",
          phone: user.phone || "",
          gender: user.gender || "",
          address: user.address || "",
          street: user.street || "",
          city: user.city || "",
          state: user.state || "",
          pincode: user.pincode || "",
          gstNumber: user.gstNumber || "",
        });

        setRoleID(user.roleID || "");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= SUBMIT UPDATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (roleID === ROLES.wholesale_customer && !form.gstNumber) {
      setError("GST Number is required for wholesale customer");
      return;
    }

    try {
      setSaving(true);

      await api.patch(`/users/admin/${id}`, {
        ...form,
        roleID,
      });
      setSuccess("User updated successfully");

      setTimeout(() => {
        navigate("/dashboard/users");
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-sm text-gray-500">
        Loading user...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-xl font-semibold">Edit User</h1>
        {success && (
          <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-md bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ===== ROLE ===== */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              User Role
            </label>
            <div className="flex gap-6 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value={ROLES.retail_customer}
                  checked={roleID === ROLES.retail_customer}
                  onChange={(e) => setRoleID(e.target.value)}
                />
                Retail Customer
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value={ROLES.wholesale_customer}
                  checked={roleID === ROLES.wholesale_customer}
                  onChange={(e) => setRoleID(e.target.value)}
                />
                Wholesale Customer
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value={ROLES.delivery_person}
                  checked={roleID === ROLES.delivery_person}
                  onChange={(e) => setRoleID(e.target.value)}
                />
                Delivery Person
              </label>
            </div>
          </div>

          {/* ===== BASIC INFO ===== */}
          <div className="grid grid-cols-2 gap-4">
            <input
              name="fullname"
              value={form.fullname}
              onChange={handleChange}
              placeholder="Full Name"
              className="h-10 rounded-md border px-3 text-sm"
            />

            <input
              name="username"
              value={form.username}
              disabled
              className="h-10 rounded-md border bg-gray-100 px-3 text-sm"
            />

            <input
              type="email"
              name="email"
              value={form.email}
              disabled
              className="h-10 rounded-md border bg-gray-100 px-3 text-sm"
            />

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="h-10 rounded-md border px-3 text-sm"
            />

            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="h-10 rounded-md border px-3 text-sm"
            >
              <option value="">Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* ===== ADDRESS ===== */}
          <div className="grid grid-cols-2 gap-4">
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Address"
              className="col-span-2 h-10 rounded-md border px-3 text-sm"
            />

            <input
              name="street"
              value={form.street}
              onChange={handleChange}
              placeholder="Street"
              className="h-10 rounded-md border px-3 text-sm"
            />

            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="City"
              className="h-10 rounded-md border px-3 text-sm"
            />

            <input
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="State"
              className="h-10 rounded-md border px-3 text-sm"
            />

            <input
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              placeholder="Pincode"
              className="h-10 rounded-md border px-3 text-sm"
            />
          </div>

          {/* ===== GST ===== */}
          {roleID === ROLES.wholesale_customer && (
            <input
              name="gstNumber"
              value={form.gstNumber}
              onChange={handleChange}
              placeholder="GST Number"
              className="h-10 w-full rounded-md border px-3 text-sm"
            />
          )}

          {/* ===== ACTIONS ===== */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-md border px-4 py-2 text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
