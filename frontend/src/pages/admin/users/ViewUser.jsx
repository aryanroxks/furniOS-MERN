import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../services/api";

const ROLE_LABELS = {
  "6952c7fedae4dbfc1f6977ac": "Admin",
  "6952c7c7dae4dbfc1f6977a6": "Retail Customer",
  "6952c80adae4dbfc1f6977b0": "Wholesale Customer",
  "6952c813dae4dbfc1f6977b4": "Delivery Person"
};

export default function ViewUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/users/${id}`);
        setUser(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Loading user...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-sm text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-sm">

        <h1 className="mb-6 text-xl font-semibold">User Details</h1>

        {/* ===== Basic Info ===== */}
        <Section title="Basic Information">
          <Item label="Full Name" value={user.fullname} />
          <Item label="Username" value={user.username} />
          <Item label="Email" value={user.email} />
          <Item label="Phone" value={user.phone || "-"} />
          <Item label="Gender" value={user.gender} />
          <Item label="Role" value={ROLE_LABELS[user.roleID] || "Unknown"} />
        </Section>

        {/* ===== Address ===== */}
        <Section title="Address">
          <Item label="Address" value={user.address} />
          <Item label="Street" value={user.street} />
          <Item label="City" value={user.city} />
          <Item label="State" value={user.state} />
          <Item label="Pincode" value={user.pincode} />
        </Section>

        {/* ===== GST (only if exists) ===== */}
        {user.gstNumber && (
          <Section title="Business Information">
            <Item label="GST Number" value={user.gstNumber} />
          </Section>
        )}

        {/* ===== Actions ===== */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => navigate("/dashboard/users")}
            className="rounded-md border px-4 py-2 text-sm"
          >
            Back to Users
          </button>
        </div>

      </div>
    </div>
  );
}

/* ===== Small reusable components ===== */

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <h2 className="mb-3 text-sm font-semibold text-gray-700">
        {title}
      </h2>
      <div className="grid grid-cols-2 gap-4 text-sm">
        {children}
      </div>
    </div>
  );
}

function Item({ label, value }) {
  return (
    <div>
      <p className="text-gray-500">{label}</p>
      <p className="font-medium text-gray-900">{value || "-"}</p>
    </div>
  );
}
