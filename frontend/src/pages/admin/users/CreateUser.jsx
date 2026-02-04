import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";

export default function CreateUser() {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    username: "",
    email: "",
    fullname: "",
    password: "",
    phone: "",
    gender: "",
    address: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    gstNumber: "",
  });

  // ===== handle input =====
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ===== submit =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!role) {
      setError("Please select a role");
      return;
    }

    if (role === "wholesale" && !form.gstNumber) {
      setError("GST Number is required for wholesale customers");
      return;
    }

    try {
      setLoading(true);

      let endpoint = "";

      if (role === "retail") {
        endpoint = "/users/register/retail-customer";
      } else if (role === "wholesale") {
        endpoint = "/users/register/wholesale-customer";
      } else if (role === "delivery") {
        endpoint = "/users/register/delivery-person";
      }

      await api.post(endpoint, form);

      navigate("/dashboard/users");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-xl font-semibold">Create User</h1>

        {/* ===== Error ===== */}
        {error && (
          <div className="mb-4 rounded-md bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ===== Role Radios ===== */}
          <div>
            <label className="mb-2 block text-sm font-medium">User Role</label>
            <div className="flex gap-6 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="retail"
                  checked={role === "retail"}
                  onChange={(e) => setRole(e.target.value)}
                />
                Retail Customer
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="wholesale"
                  checked={role === "wholesale"}
                  onChange={(e) => setRole(e.target.value)}
                />
                Wholesale Customer
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="delivery"
                  checked={role === "delivery"}
                  onChange={(e) => setRole(e.target.value)}
                />
                Delivery Person
              </label>
            </div>
          </div>

          {/* ===== Basic Info ===== */}
          <div className="grid grid-cols-2 gap-4">
            <input
              name="fullname"
              placeholder="Full Name"
              value={form.fullname}
              onChange={handleChange}
              className="h-10 rounded-md border px-3 text-sm"
              required
            />
            <input
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              className="h-10 rounded-md border px-3 text-sm"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="h-10 rounded-md border px-3 text-sm"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="h-10 rounded-md border px-3 text-sm"
              required
            />
            <input
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              className="h-10 rounded-md border px-3 text-sm"
            />
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="h-10 rounded-md border px-3 text-sm"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* ===== Address ===== */}
          <div className="grid grid-cols-2 gap-4">
            <input
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              className="h-10 rounded-md border px-3 text-sm col-span-2"
            />
            <input
              name="street"
              placeholder="Street"
              value={form.street}
              onChange={handleChange}
              className="h-10 rounded-md border px-3 text-sm"
            />
            <input
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              className="h-10 rounded-md border px-3 text-sm"
            />
            <input
              name="state"
              placeholder="State"
              value={form.state}
              onChange={handleChange}
              className="h-10 rounded-md border px-3 text-sm"
            />
            <input
              name="pincode"
              placeholder="Pincode"
              value={form.pincode}
              onChange={handleChange}
              className="h-10 rounded-md border px-3 text-sm"
            />
          </div>

          {/* ===== GST (Only Wholesale) ===== */}
          {role === "wholesale" && (
            <div>
              <input
                name="gstNumber"
                placeholder="GST Number"
                value={form.gstNumber}
                onChange={handleChange}
                className="h-10 w-full rounded-md border px-3 text-sm"
                required
              />
            </div>
          )}

          {/* ===== Actions ===== */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/dashboard/users")}
              className="rounded-md border px-4 py-2 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create User"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
