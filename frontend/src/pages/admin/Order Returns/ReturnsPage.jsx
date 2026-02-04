import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";

/* ======================
   STATUS BADGE STYLES
====================== */
const STATUS_STYLES = {
  REQUESTED: "bg-blue-50 text-blue-700",
  APPROVED: "bg-green-50 text-green-700",
  REJECTED: "bg-red-50 text-red-700",
  PICKED_UP: "bg-purple-50 text-purple-700",
  RECEIVED: "bg-amber-50 text-amber-700",
  REFUNDED: "bg-emerald-50 text-emerald-700",
};

export default function ReturnsPage() {
  const navigate = useNavigate();

  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  /* ======================
     FETCH RETURNS
  ====================== */
  const fetchReturns = async () => {
    try {
      setLoading(true);

      const res = await api.get("/orders/admin/returns", {
        params: statusFilter ? { status: statusFilter } : {},
      });

      setReturns(res.data.data);
    } catch (err) {
      console.error("Failed to fetch returns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, [statusFilter]);

  /* ======================
     UI
  ====================== */
  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Order Returns</h1>

        {/* STATUS FILTER */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All Statuses</option>
          <option value="REQUESTED">Requested</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="PICKED_UP">Picked Up</option>
          <option value="RECEIVED">Received</option>
          <option value="REFUNDED">Refunded</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Return ID</th>
              <th className="px-4 py-3 text-left">Order ID</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Refund</th>
              <th className="px-4 py-3 text-center">Items</th>
              <th className="px-4 py-3 text-left">Requested</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-8 text-gray-500">
                  Loading returns...
                </td>
              </tr>
            ) : returns.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-8 text-gray-500">
                  No return requests found
                </td>
              </tr>
            ) : (
              returns.map((r) => (
                <tr key={r.returnId} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">
                    #{r.returnId.slice(-6)}
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    #{r.orderId.slice(-6)}
                  </td>

                  <td className="px-4 py-3">
                    <div className="font-medium">{r.user.name}</div>
                    <div className="text-xs text-gray-500">
                      {r.user.email}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        STATUS_STYLES[r.status]
                      }`}
                    >
                      {r.status.replaceAll("_", " ")}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right font-semibold">
                    ₹{r.refundAmount}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {r.productCount} / {r.totalItems}
                  </td>

                  <td className="px-4 py-3 text-gray-500">
                    {new Date(r.requestedAt).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() =>
                        navigate(`/dashboard/returns/${r.returnId}`)
                      }
                      className="text-blue-600 hover:underline text-sm font-medium"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
