import { useEffect, useState } from "react";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import api from "../../../services/api.js";
import { useNavigate } from "react-router-dom";
import DeleteConfirmModal from "../../../components/common/DeleteConfirmModal.jsx";

// ===== Role ID → Label mapping (UI only) =====
const ROLE_LABELS = {
  "6952c7fedae4dbfc1f6977ac": "Admin",
  "6952c7c7dae4dbfc1f6977a6": "Retail Customer",
  "6952c80adae4dbfc1f6977b0": "Wholesale Customer",
  "6952c813dae4dbfc1f6977b4": "Delivery Person",
};

export default function UsersList() {
  // ===== State =====
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    role: "",
  });

  const [deleteUserId, setDeleteUserId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  // ===== Fetch users =====
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users/all", {
          params: {
            search: filters.search || undefined,
            role: filters.role || undefined,
          },
        });
        setUsers(res.data.data || []);
        setError("");
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to load users!"
        );
      }
    };

    fetchUsers();
  }, [filters]);

  // ===== DELETE (modal-based) =====
  const handleDelete = async () => {
    try {
      setDeleting(true);
      await api.delete(`/users/${deleteUserId}`);

      // keep existing behaviour (local state update)
      setUsers((prev) => prev.filter((u) => u._id !== deleteUserId));
      setDeleteUserId(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* ===== Page Header ===== */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500">
            Manage all registered users on FurniOS
          </p>
        </div>

        <button
          className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          onClick={() => navigate("/dashboard/users/create")}
        >
          <Plus size={16} />
          Add User
        </button>
      </div>

      {/* ===== Filters ===== */}
      <div className="flex flex-wrap items-center gap-4 rounded-lg border bg-white p-4">
        <input
          type="text"
          placeholder="Search users..."
          className="h-10 w-64 rounded-md border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={filters.search}
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value })
          }
        />

        <select
          className="h-10 rounded-md border px-3 text-sm focus:outline-none"
          value={filters.role}
          onChange={(e) =>
            setFilters({ ...filters, role: e.target.value })
          }
        >
          <option value="">All Roles</option>
          <option value="6952c7fedae4dbfc1f6977ac">Admin</option>
          <option value="6952c7c7dae4dbfc1f6977a6">Retail Customer</option>
          <option value="6952c80adae4dbfc1f6977b0">Wholesale Customer</option>
          <option value="6952c813dae4dbfc1f6977b4">Delivery Person</option>
        </select>
      </div>

      {/* ===== Error ===== */}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* ===== Table ===== */}
      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">Username</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-4 py-10 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {user.username}
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {user.email}
                  </td>

                  <td className="px-4 py-3">
                    {ROLE_LABELS[user.roleID] || "Unknown"}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() =>
                          navigate(`/dashboard/users/${user._id}`)
                        }
                        className="rounded-md p-2 hover:bg-gray-100"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        onClick={() =>
                          navigate(`/dashboard/users/${user._id}/edit`)
                        }
                        className="rounded-md p-2 hover:bg-gray-100"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => setDeleteUserId(user._id)}
                        className="rounded-md p-2 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ===== DELETE MODAL ===== */}
      {deleteUserId && (
        <DeleteConfirmModal
          title="Delete User?"
          message="This action will permanently delete the user. Continue?"
          loading={deleting}
          onCancel={() => setDeleteUserId(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
