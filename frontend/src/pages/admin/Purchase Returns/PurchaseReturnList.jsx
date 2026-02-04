import { useEffect, useState } from "react";
import { Eye, Pencil, CheckCircle, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import DeleteConfirmModal from "../../../components/common/DeleteConfirmModal";
import CompleteConfirmModal from "../../../components/common/CompleteConfirmModal";

const STATUS_COLORS = {
  CREATED: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-green-100 text-green-800",
};

export default function PurchaseReturnList() {
  const navigate = useNavigate();

  // data
  const [returns, setReturns] = useState([]);
  const [vendors, setVendors] = useState([]);

  // filters
  const [filters, setFilters] = useState({
    status: "",
    vendorID: "",
    fromDate: "",
    toDate: "",
  });

  // pagination
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);

  // ui states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // modals
  const [deleteId, setDeleteId] = useState(null);
  const [completeId, setCompleteId] = useState(null);
  const [processing, setProcessing] = useState(false);

  /* ---------------- FETCH VENDORS ---------------- */
  useEffect(() => {
    api
      .get("/vendors")
      .then((res) => setVendors(res.data.data || []))
      .catch(() => { });
  }, []);

  /* ---------------- FETCH RETURNS ---------------- */
  const fetchReturns = async () => {
    try {
      setLoading(true);

      const res = await api.get("/purchase-returns", {
        params: {
          ...filters,
          page,
          limit,
        },
      });

      setReturns(res.data.data.data || []);
      setTotalPages(res.data.data.pagination.totalPages);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load purchase returns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, [filters, page]);

  /* ---------------- ACTIONS ---------------- */
  const handleComplete = async () => {
    try {
      setProcessing(true);
      await api.post(`/purchase-returns/${completeId}/complete`);
      setCompleteId(null);
      fetchReturns();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to complete return");
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async () => {
    try {
      setProcessing(true);
      await api.delete(`/purchase-returns/${deleteId}`);
      setDeleteId(null);
      fetchReturns();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    } finally {
      setProcessing(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Purchase Returns</h1>
          <p className="text-sm text-gray-500">
            Manage returns for received purchases
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard/purchase-returns/create")}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md"
        >
          + Create Return
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-white border rounded-lg p-4">
        <select
          className="border rounded-md px-3 py-2 text-sm"
          value={filters.status}
          onChange={(e) =>
            setFilters({ ...filters, status: e.target.value })
          }
        >
          <option value="">All Status</option>
          <option value="CREATED">Created</option>
          <option value="COMPLETED">Completed</option>
        </select>

        <select
          className="border rounded-md px-3 py-2 text-sm"
          value={filters.vendorID}
          onChange={(e) =>
            setFilters({ ...filters, vendorID: e.target.value })
          }
        >
          <option value="">All Vendors</option>
          {vendors.map((v) => (
            <option key={v._id} value={v._id}>
              {v.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="border rounded-md px-3 py-2 text-sm"
          value={filters.fromDate}
          onChange={(e) =>
            setFilters({ ...filters, fromDate: e.target.value })
          }
        />

        <input
          type="date"
          className="border rounded-md px-3 py-2 text-sm"
          value={filters.toDate}
          onChange={(e) =>
            setFilters({ ...filters, toDate: e.target.value })
          }
        />
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
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Vendor</th>
              <th className="px-4 py-3 text-left">Purchase</th>
              <th className="px-4 py-3 text-left">Items</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-4 py-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : returns.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-10 text-center text-gray-500">
                  No purchase returns found
                </td>
              </tr>
            ) : (
              returns.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {r.vendorID?.name || "—"}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {r.purchaseID}
                  </td>
                  <td className="px-4 py-3">{r.items.length}</td>
                  <td className="px-4 py-3 font-medium">
                    ₹{r.returnAmount}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[r.status]}`}
                    >
                      {r.status}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() =>
                          navigate(`/dashboard/purchase-returns/${r._id}`)
                        }
                        className="p-2 rounded-md hover:bg-gray-100"
                      >
                        <Eye size={16} />
                      </button>

                      {r.status === "CREATED" && (
                        <>
                          <button
                            onClick={() =>
                              navigate(
                                `/dashboard/purchase-returns/${r._id}/edit`
                              )
                            }
                            className="p-2 rounded-md hover:bg-gray-100"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            onClick={() => setCompleteId(r._id)}
                            className="p-2 rounded-md text-green-600 hover:bg-green-50"
                          >
                            <CheckCircle size={16} />
                          </button>

                          <button
                            onClick={() => setDeleteId(r._id)}
                            className="p-2 rounded-md text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="px-3 py-1 text-sm">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Complete Modal */}
      {completeId && (
        <CompleteConfirmModal
          title="Complete Purchase Return?"
          message="Once completed, inventory stock will be reduced and this return cannot be edited."
          loading={processing}
          onCancel={() => setCompleteId(null)}
          onConfirm={handleComplete}
        />
      )}


      {/* Delete Modal */}
      {deleteId && (
        <DeleteConfirmModal
          title="Delete Purchase Return?"
          message="Only CREATED returns can be deleted."
          loading={processing}
          onCancel={() => setDeleteId(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
