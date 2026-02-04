import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Addresses() {
  const [address, setAddress] = useState({
    address: "",
    street: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const res = await api.get("/users/current-user");
        const user = res.data.data;

        setAddress({
          address: user.address || "",
          street: user.street || "",
          city: user.city || "",
          state: user.state || "",
          pincode: user.pincode || ""
        });
      } catch (err) {
        setError("Failed to load address!");
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, []);

  const handleChange = (e) => {
    setError("");
    setSuccess("");
    setAddress({
      ...address,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await api.patch("/users/update-profile", address);
      setSuccess("Address updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading address...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Manage Address</h2>

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

      <div className="space-y-4 max-w-xl">
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={address.address}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="text"
          name="street"
          placeholder="Street"
          value={address.street}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="text"
          name="city"
          placeholder="City"
          value={address.city}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="text"
          name="state"
          placeholder="State"
          value={address.state}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          value={address.pincode}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-orange-500 text-white py-2 rounded disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Address"}
        </button>
      </div>
    </div>
  );
}
