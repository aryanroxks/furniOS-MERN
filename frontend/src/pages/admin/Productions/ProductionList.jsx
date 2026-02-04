import { useEffect, useState } from "react";
import {
  Eye,
  Pencil,
  PlayCircle,
  CheckCircle,
  XCircle,
  Trash2,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import DeleteConfirmModal from "../../../components/common/DeleteConfirmModal";
import ActionConfirmModal from "../../../components/common/ActionConfirmModal";

const STATUS_COLORS = {
  PLANNED: "bg-gray-100 text-gray-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function ProductionList() {
  const navigate = useNavigate();

  const [productions, setProductions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    status: "",
    startDate: "",
    endDate: "",
  });

  const [action, setAction] = useState(null); // { type, id }
  const [processing, setProcessing] = useState(false);

  /* ---------------- FETCH ---------------- */
  const fetchProductions = async () => {
    try {
      setLoading(true);
      const res = await api.get("/productions/all", {
        params: {
          status: filters.status || undefined,
          startDate: filters.startDate || undefined,
          endDate: filters.endDate || undefined,
        },
      });

      setProductions(res.data.data.productions || []);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load productions"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductions();
  }, [filters]);

  /* ---------------- ACTION HANDLERS ---------------- */
  const handleAction = async () => {
    if (!action) return;

    try {
      setProcessing(true);

      if (action.type === "START") {
        await api.post(`/productions/${action.id}/start`);
      }

      if (action.type === "COMPLETE") {
        await api.post(`/productions/${action.id}/complete`);
      }

      if (action.type === "CANCEL") {
        await api.post(`/productions/${action.id}/cancel`);
      }

      if (action.type === "DELETE") {
        await api.delete(`/productions/${action.id}`);
      }

      setAction(null);
      fetchProductions();
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Production Cycles</h1>
          <p className="text-sm text-gray-500">
            Manage manufacturing and inventory flow
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard/productions/create")}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          <Plus size={16} />
          Create Production
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white border rounded-lg p-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Status
          </label>
          <select
            className="w-full border rounded-md px-3 py-2 text-sm"
            value={filters.status}
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value })
            }
          >
            <option value="">All Status</option>
            <option value="PLANNED">Planned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Start Date
          </label>
          <input
            type="date"
            className="w-full border rounded-md px-3 py-2 text-sm"
            value={filters.startDate}
            onChange={(e) =>
              setFilters({ ...filters, startDate: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            End Date
          </label>
          <input
            type="date"
            className="w-full border rounded-md px-3 py-2 text-sm"
            value={filters.endDate}
            onChange={(e) =>
              setFilters({ ...filters, endDate: e.target.value })
            }
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Production No</th>
              <th className="px-4 py-3 text-left">Production Date</th>
              <th className="px-4 py-3 text-left">Products Count</th>
              <th className="px-4 py-3 text-left">Total Production Cost</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : productions.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-10 text-center text-gray-500">
                  No productions found
                </td>
              </tr>
            ) : (
              productions.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">
                    {p.productionNumber}
                  </td>

                  <td className="px-4 py-3">
                    {new Date(p.productionDate).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3">
                    {p.products.length}
                  </td>

                  <td className="px-4 py-3 font-medium">
                    ₹{p.totalProductionCost}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[p.status]}`}
                    >
                      {p.status}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() =>
                          navigate(`/dashboard/productions/${p._id}`)
                        }
                        className="p-2 rounded-md hover:bg-gray-100"
                        title="View Production"
                      >
                        <Eye size={16} />
                      </button>

                      {p.status === "PLANNED" && (
                        <>
                          <button
                            onClick={() =>
                              navigate(
                                `/dashboard/productions/${p._id}/edit`
                              )
                            }
                            className="p-2 rounded-md hover:bg-gray-100"
                            title="Edit Production"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            onClick={() =>
                              setAction({ type: "START", id: p._id })
                            }
                            className="p-2 rounded-md text-blue-600 hover:bg-blue-50"
                            title="Start Production"
                          >
                            <PlayCircle size={16} />
                          </button>

                          <button
                            onClick={() =>
                              setAction({ type: "DELETE", id: p._id })
                            }
                            className="p-2 rounded-md text-red-600 hover:bg-red-50"
                            title="Delete Production"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}

                      {p.status === "IN_PROGRESS" && (
                        <>
                          <button
                            onClick={() =>
                              setAction({ type: "COMPLETE", id: p._id })
                            }
                            className="p-2 rounded-md text-green-600 hover:bg-green-50"
                            title="Complete Production"
                          >
                            <CheckCircle size={16} />
                          </button>

                          <button
                            onClick={() =>
                              setAction({ type: "CANCEL", id: p._id })
                            }
                            className="p-2 rounded-md text-red-600 hover:bg-red-50"
                            title="Cancel Production"
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      <ActionConfirmModal
        open={!!action}
        loading={processing}
        onCancel={() => setAction(null)}
        onConfirm={handleAction}
        title={
          action?.type === "START"
            ? "Start Production?"
            : action?.type === "COMPLETE"
              ? "Complete Production?"
              : action?.type === "CANCEL"
                ? "Cancel Production?"
                : "Delete Production?"
        }
        description={
          action?.type === "START"
            ? "Starting production will mark it as IN PROGRESS. No stock will be changed at this stage."
            : action?.type === "COMPLETE"
              ? "Completing production will deduct raw materials and add finished goods stock. This action cannot be undone."
              : action?.type === "CANCEL"
                ? "Cancelling production will stop this cycle permanently."
                : "This production will be permanently deleted."
        }
        confirmText={
          action?.type === "START"
            ? "Start"
            : action?.type === "COMPLETE"
              ? "Complete"
              : action?.type === "CANCEL"
                ? "Cancel Production"
                : "Delete"
        }
        confirmColor={
          action?.type === "START"
            ? "bg-blue-600 hover:bg-blue-700"
            : action?.type === "COMPLETE"
              ? "bg-green-600 hover:bg-green-700"
              : action?.type === "CANCEL"
                ? "bg-orange-600 hover:bg-orange-700"
                : "bg-red-600 hover:bg-red-700"
        }
      />

    </div>
  );
}
