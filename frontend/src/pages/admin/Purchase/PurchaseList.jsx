import { useEffect, useState } from "react";
import { Eye, Pencil, CheckCircle, XCircle, Trash2, Plus } from "lucide-react";
import api from "../../../services/api.js";
import { useNavigate } from "react-router-dom";
import DeleteConfirmModal from "../../../components/common/DeleteConfirmModal.jsx";
import ReceivePurchaseModal from "../../../components/common/ReceivePurchaseModal.jsx";
import CancelPurchaseModal from "../../../components/common/CancelPurchaseModal.jsx";

const STATUS_COLORS = {
  PENDING: "bg-yellow-100 text-yellow-800",
  RECEIVED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function PurchaseList() {
  const navigate = useNavigate();

  // ===== State =====
  const [purchases, setPurchases] = useState([]);
  const [vendors, setVendors] = useState([]);

  const [filters, setFilters] = useState({
    status: "",
    vendorId: "",
    startDate: "",
    endDate: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // modals
  const [deleteId, setDeleteId] = useState(null);
  const [cancelId, setCancelId] = useState(null);
  const [receiveId, setReceiveId] = useState(null);
  const [processing, setProcessing] = useState(false);

  // ===== Fetch Vendors (for filter dropdown) =====
  useEffect(() => {
    api.get("/vendors")
      .then(res => setVendors(res.data.data || []))
      .catch(() => { });
  }, []);

  // ===== Fetch Purchases =====
  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const res = await api.get("/purchases", {
        params: {
          status: filters.status || undefined,
          vendorId: filters.vendorId || undefined,
          startDate: filters.startDate || undefined,
          endDate: filters.endDate || undefined,
        },
      });

      setPurchases(res.data.data || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load purchases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, [filters]);

  // ===== Actions =====
  const handleReceive = async () => {
    try {
      setProcessing(true);
      await api.patch(`/purchases/${receiveId}/receive`);
      setReceiveId(null);
      fetchPurchases();
    } catch (err) {
      alert(err.response?.data?.message || "Receive failed");
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = async () => {
    try {
      setProcessing(true);
      await api.patch(`/purchases/${cancelId}/cancel`);
      setCancelId(null);
      fetchPurchases();
    } catch (err) {
      alert(err.response?.data?.message || "Cancel failed");
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async () => {
    try {
      setProcessing(true);
      await api.delete(`/purchases/${deleteId}`);
      setDeleteId(null);
      fetchPurchases();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    } finally {
      setProcessing(false);
    }
  };

  const downloadPDF = () => {
    const params = new URLSearchParams({
      ...(filters.status && { status: filters.status }),
      ...(filters.vendorId && { vendorId: filters.vendorId }),
      ...(filters.startDate && { startDate: filters.startDate }),
      ...(filters.endDate && { endDate: filters.endDate }),
    });

    const url = `${import.meta.env.VITE_API_BASE_URL}/purchases/pdf?${params.toString()}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };


  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* ===== Header ===== */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Purchases</h1>
          <p className="text-sm text-gray-500">
            Manage vendor purchases and stock receiving
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard/purchases/create")}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            <Plus size={16} />
            Add Purchase
          </button>

          <button
            onClick={downloadPDF}
            disabled={loading || purchases.length === 0}
            className="px-4 py-2 rounded-md border bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Download PDF
          </button>
        </div>

      </div>

      {/* ===== Filters ===== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white border rounded-lg p-4">
        <select
          className="border rounded-md px-3 py-2 text-sm"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="RECEIVED">Received</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <select
          className="border rounded-md px-3 py-2 text-sm"
          value={filters.vendorId}
          onChange={(e) =>
            setFilters({ ...filters, vendorId: e.target.value })
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
          value={filters.startDate}
          onChange={(e) =>
            setFilters({ ...filters, startDate: e.target.value })
          }
        />

        <input
          type="date"
          className="border rounded-md px-3 py-2 text-sm"
          value={filters.endDate}
          onChange={(e) =>
            setFilters({ ...filters, endDate: e.target.value })
          }
        />
      </div>

      {/* ===== Error ===== */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md">
          {error}
        </div>
      )}

      {/* ===== Table ===== */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Vendor</th>
              <th className="px-4 py-3 text-left">Items</th>
              <th className="px-4 py-3 text-left">Total</th>
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
            ) : purchases.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-10 text-center text-gray-500">
                  No purchases found
                </td>
              </tr>
            ) : (
              purchases.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {new Date(p.purchaseDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {p.vendorId?.name}
                  </td>
                  <td className="px-4 py-3">
                    {p.items.length}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    ₹{p.totalAmount}
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
                          navigate(`/dashboard/purchases/${p._id}`)
                        }
                        className="p-2 rounded-md hover:bg-gray-100"
                      >
                        <Eye size={16} />
                      </button>

                      {p.status === "PENDING" && (
                        <>
                          <button
                            onClick={() =>
                              navigate(`/dashboard/purchases/${p._id}/edit`)
                            }
                            className="p-2 rounded-md hover:bg-gray-100"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            onClick={() => setReceiveId(p._id)}
                            className="p-2 rounded-md text-green-600 hover:bg-green-50"
                          >
                            <CheckCircle size={16} />
                          </button>

                          <button
                            onClick={() => setCancelId(p._id)}
                            className="p-2 rounded-md text-orange-600 hover:bg-orange-50"
                          >
                            <XCircle size={16} />
                          </button>

                          <button
                            onClick={() => setDeleteId(p._id)}
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

      {/* ===== Modals ===== */}
      {receiveId && (
        <ReceivePurchaseModal
          loading={processing}
          onCancel={() => setReceiveId(null)}
          onConfirm={handleReceive}
        />
      )}

      {cancelId && (
        <CancelPurchaseModal
          loading={processing}
          onCancel={() => setCancelId(null)}
          onConfirm={handleCancel}
        />
      )}


      {deleteId && (
        <DeleteConfirmModal
          title="Delete Purchase?"
          message="This purchase will be permanently deleted."
          loading={processing}
          onCancel={() => setDeleteId(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
