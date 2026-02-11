import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [status, setStatus] = useState("");
  const [method, setMethod] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPayments = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/payments", {
        params: {
          status,
          method,
          dateFrom,
          dateTo,
          page,
          limit: 10,
        },
      });

      setPayments(data.data.payments);
      setTotalPages(data.data.pagination.totalPages);
    } catch (error) {
      console.error("Failed to fetch payments", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [status, method, dateFrom, dateTo, page]);

  const downloadPaymentsPDF = () => {
  const params = new URLSearchParams({
    reportType: "PAYMENT",
    ...(status && { status }),
    ...(method && { method }),
    ...(dateFrom && { dateFrom }),
    ...(dateTo && { dateTo }),
  });

  const url = `${import.meta.env.VITE_API_BASE_URL}/reports/pdf?${params.toString()}`;
  window.open(url, "_blank", "noopener,noreferrer");
};


  return (
    <div className="p-6 space-y-6">
      {/* Header */}
   <div className="flex items-center justify-between">
  <h1 className="text-2xl font-semibold text-gray-800">
    Payments Management
  </h1>

  <button
    onClick={downloadPaymentsPDF}
    disabled={payments.length === 0}
    className="border px-4 py-2 rounded-md bg-white hover:bg-gray-50 text-sm disabled:opacity-50"
  >
    Download Payments PDF
  </button>
</div>


      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 grid grid-cols-1 md:grid-cols-5 gap-4">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="SUCCESS">Success</option>
          <option value="FAILED">Failed</option>
        </select>

        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="">All Methods</option>
          <option value="COD">COD</option>
          <option value="ONLINE">Online</option>
        </select>

        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        />

        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        />

        <button
          onClick={() => {
            setStatus("");
            setMethod("");
            setDateFrom("");
            setDateTo("");
            setPage(1);
          }}
          className="bg-gray-100 hover:bg-gray-200 text-sm rounded px-3 py-2"
        >
          Clear Filters
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Order</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Method</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-500">
                  Loading payments...
                </td>
              </tr>
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-500">
                  No payments found
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr
                  key={payment._id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    {payment.orderID?.orderNumber || payment.orderID?._id}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    ₹{payment.amount}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded bg-blue-50 text-blue-600 text-xs">
                      {payment.method}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        payment.status === "SUCCESS"
                          ? "bg-green-100 text-green-700"
                          : payment.status === "FAILED"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Page {page} of {totalPages}
        </p>

        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
