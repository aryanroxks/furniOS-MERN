import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import ActionConfirmModal from "../../../components/common/ActionConfirmModal.jsx";
import DeleteConfirmModal from "../../../components/common/DeleteConfirmModal.jsx";

const statusStyles = {
  REQUESTED: "bg-yellow-100 text-yellow-800",
  REVERTED: "bg-blue-100 text-blue-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  ORDER_CREATED: "bg-emerald-100 text-emerald-800",
};

const AdminWholesaleQuotations = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const [statusFilter, setStatusFilter] = useState("");

  const navigate = useNavigate();

  /* ================= FETCH ================= */
  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const res = await api.get("/wholesale/admin/quotations", {
        params: statusFilter ? { status: statusFilter } : {},
      });
      setQuotations(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch wholesale quotations", err);
      setQuotations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, [statusFilter]);

  /* ================= ACTIONS ================= */
  const openRejectModal = (quotation) => {
    setSelectedQuotation(quotation);
    setShowRejectModal(true);
  };

  const rejectQuotation = async () => {
    try {
      await api.post(
        `/wholesale/admin/quotations/${selectedQuotation._id}/reject`
      );
      setShowRejectModal(false);
      setSelectedQuotation(null);
      fetchQuotations();
    } catch (err) {
      console.error("Reject failed", err);
      alert("Failed to reject quotation");
    }
  };


  const downloadWholesaleQuotationsPDF = () => {
  const params = new URLSearchParams({
    reportType: "WHOLESALE_QUOTATION",
    ...(status && { status }), // only if you add filter later
  });

  window.open(
    `${import.meta.env.VITE_API_BASE_URL}/reports/pdf?${params.toString()}`,
    "_blank",
    "noopener,noreferrer"
  );
};


  /* ================= UI STATES ================= */
  if (loading) {
    return <p className="p-6">Loading wholesale quotations...</p>;
  }

  /* ================= RENDER ================= */
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">
          Wholesale Quotations
        </h1>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-3 py-2 w-48"
        >
          <option value="">All Status</option>
          <option value="REQUESTED">Requested</option>
          <option value="REVERTED">Reverted</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="ORDER_CREATED">Order Created</option>
        </select>
        <button
  onClick={downloadWholesaleQuotationsPDF}
  disabled={quotations.length === 0}
  className="border px-4 py-2 rounded-md bg-white hover:bg-gray-50 text-sm disabled:opacity-50"
>
  Download Quotations PDF
</button>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Quotation #</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-center">Total Qty</th>
              <th className="p-3 text-right">Total Amount</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Created</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {quotations.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  className="p-6 text-center text-gray-500"
                >
                  No wholesale quotations found.
                </td>
              </tr>
            )}

            {quotations.map((q) => (
              <tr
                key={q._id}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-3 font-medium">
                  {q.quotationNumber}
                </td>

                <td className="p-3">
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {q.userID?.fullname}
                    </span>
                    <span className="text-xs text-gray-500">
                      {q.userID?.email}
                    </span>
                  </div>
                </td>

                <td className="p-3 text-center">
                  {q.totalQuantity}
                </td>

                <td className="p-3 text-right">
                  ₹{q.totalAmount}
                </td>

                <td className="p-3 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      statusStyles[q.status]
                    }`}
                  >
                    {q.status.replace("_", " ")}
                  </span>
                </td>

                <td className="p-3 text-center text-gray-600">
                  {new Date(q.createdAt).toLocaleDateString()}
                </td>

                <td className="p-3 text-center space-x-2">
                  <button
                    onClick={() =>
                      navigate(
                        `/dashboard/quotations/${q._id}`
                      )
                    }
                    className="text-blue-600 hover:underline font-medium"
                  >
                    View
                  </button>

                  {q.status === "REQUESTED" && (
                    <button
                      onClick={() => openRejectModal(q)}
                      className="text-red-600 hover:underline font-medium"
                    >
                      Reject
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* REJECT MODAL */}
      {showRejectModal && (
        <DeleteConfirmModal
          title="Reject Wholesale Quotation"
          description={`Are you sure you want to reject quotation ${selectedQuotation?.quotationNumber}?`}
          onCancel={() => setShowRejectModal(false)}
          onConfirm={rejectQuotation}
        />
      )}
    </div>
  );
};

export default AdminWholesaleQuotations;
