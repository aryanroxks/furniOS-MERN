import api from "../../../services/api.js";

export default function VendorsTable({ vendors, loading, onEdit, onRefresh }) {
  if (loading) return <p>Loading...</p>;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 text-sm">
          <tr>
            <th className="p-4 text-left">Vendor</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {vendors.map((vendor) => (
            <tr key={vendor._id} className="border-t">
              <td className="p-4 font-medium">{vendor.name}</td>
              <td>{vendor.email || "-"}</td>
              <td>{vendor.phone || "-"}</td>
              <td>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    vendor.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {vendor.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="p-4 text-right space-x-3">
                <button
                  onClick={() => onEdit(vendor)}
                  className="text-indigo-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={async () => {
                    await api.patch(`/vendors/${vendor._id}/status`);
                    onRefresh();
                  }}
                  className="text-gray-600 hover:underline"
                >
                  Toggle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
