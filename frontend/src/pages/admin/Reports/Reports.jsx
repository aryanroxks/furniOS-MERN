import { useEffect, useState } from "react";
import api from "../../../services/api";

const REPORT_TYPES = {
  ORDER: "ORDER",
  REVENUE: "REVENUE",
  STOCK: "STOCK",
  PRODUCTION: "PRODUCTION",
  PURCHASE: "PURCHASE",
};

export default function Reports() {
  const [reportType, setReportType] = useState(REPORT_TYPES.ORDER);
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    status: "",
  });

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ========================
     FETCH REPORT (SCREEN)
  ======================== */
  const fetchReport = async () => {
    setLoading(true);
    try {
      const payload = {
        reportType,
        ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
        ...(filters.dateTo && { dateTo: filters.dateTo }),
        ...(filters.status && { status: filters.status }),
      };

      const res = await api.post("/reports", payload);
      setData(res.data.data);
    } catch (err) {
      console.error("Failed to load report", err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  /* ========================
     AUTO FETCH FOR STOCK
  ======================== */
  useEffect(() => {
    if (reportType === REPORT_TYPES.STOCK) {
      fetchReport();
    }
  }, [reportType]);

  /* ========================
     DOWNLOAD PDF (NO BLOB)
  ======================== */
  const downloadReportPDF = () => {
    const params = new URLSearchParams({
      reportType,
      ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
      ...(filters.dateTo && { dateTo: filters.dateTo }),
      ...(filters.status && { status: filters.status }),
    });

    const url = `${import.meta.env.VITE_API_BASE_URL}/reports/pdf?${params.toString()}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Reports</h1>
        <p className="text-gray-500 text-sm">
          Analyze orders, revenue, stock, production and purchases
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {Object.values(REPORT_TYPES).map((type) => (
          <button
            key={type}
            onClick={() => {
              setReportType(type);
              setFilters({ dateFrom: "", dateTo: "", status: "" });
              setData(null);
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              reportType === type
                ? "bg-black text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Filters */}
      {reportType !== REPORT_TYPES.STOCK && (
        <div className="flex flex-wrap gap-4 items-end bg-gray-50 p-4 rounded-lg">
          <div>
            <label className="block text-sm">From</label>
            <input
              type="date"
              className="border rounded px-3 py-2"
              value={filters.dateFrom}
              onChange={(e) =>
                setFilters({ ...filters, dateFrom: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm">To</label>
            <input
              type="date"
              className="border rounded px-3 py-2"
              value={filters.dateTo}
              onChange={(e) =>
                setFilters({ ...filters, dateTo: e.target.value })
              }
            />
          </div>

          {/* Status Filter */}
          {[REPORT_TYPES.ORDER, REPORT_TYPES.PRODUCTION, REPORT_TYPES.PURCHASE].includes(
            reportType
          ) && (
            <div>
              <label className="block text-sm">Status</label>
              <select
                className="border rounded px-3 py-2"
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <option value="">All</option>

                {reportType === REPORT_TYPES.ORDER && (
                  <>
                    <option value="PENDING">Pending</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </>
                )}

                {reportType === REPORT_TYPES.PRODUCTION && (
                  <>
                    <option value="PLANNED">Planned</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </>
                )}

                {reportType === REPORT_TYPES.PURCHASE && (
                  <>
                    <option value="RECEIVED">Received</option>
                    <option value="PENDING">Pending</option>
                    <option value="CANCELLED">Cancelled</option>
                  </>
                )}
              </select>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={fetchReport}
              className="bg-black text-white px-6 py-2 rounded-md"
            >
              Generate
            </button>

            <button
              onClick={downloadReportPDF}
              disabled={!data || loading}
              className={`px-6 py-2 rounded-md border ${
                !data || loading
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              Download PDF
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="bg-white rounded-lg p-4 min-h-[200px]">
        {loading && <p>Loading...</p>}
        {!loading && !data && (
          <p className="text-gray-500">No report generated</p>
        )}

        {/* ORDER REPORT */}
        {reportType === REPORT_TYPES.ORDER && Array.isArray(data) && (
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Order</th>
                <th>Customer</th>
                <th>Role</th>
                <th>Status</th>
                <th>Total</th>
                <th>Ordered</th>
                <th>Delivered</th>
              </tr>
            </thead>
            <tbody>
              {data.map((o) => (
                <tr key={o.orderId} className="border-t">
                  <td className="p-2">{o.orderId}</td>
                  <td>{o.customerName}</td>
                  <td>{o.customerType}</td>
                  <td>{o.status}</td>
                  <td>₹{o.total}</td>
                  <td>{new Date(o.orderedAt).toLocaleDateString()}</td>
                  <td>
                    {o.deliveredAt
                      ? new Date(o.deliveredAt).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* REVENUE REPORT */}
        {reportType === REPORT_TYPES.REVENUE && data && (
          <div className="grid grid-cols-2 gap-6 max-w-xl">
            <div className="p-4 border rounded">
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-semibold">₹{data.totalRevenue}</p>
            </div>
            <div className="p-4 border rounded">
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-semibold">{data.totalOrders}</p>
            </div>
          </div>
        )}

        {/* STOCK REPORT */}
        {reportType === REPORT_TYPES.STOCK && Array.isArray(data) && (
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Product</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((p) => (
                <tr key={p.productName} className="border-t">
                  <td className="p-2">{p.productName}</td>
                  <td>{p.stock}</td>
                  <td>₹{p.price}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        p.isLowStock
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {p.isLowStock ? "Low Stock" : "In Stock"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* PRODUCTION REPORT */}
        {reportType === REPORT_TYPES.PRODUCTION && Array.isArray(data) && (
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Production No</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total Qty</th>
                <th>Total Cost</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {data.map((p) => (
                <tr key={p.productionNumber} className="border-t">
                  <td className="p-2">{p.productionNumber}</td>
                  <td>{new Date(p.productionDate).toLocaleDateString()}</td>
                  <td>{p.status}</td>
                  <td>{p.totalQuantityProduced}</td>
                  <td>₹{p.totalProductionCost}</td>
                  <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* PURCHASE REPORT */}
        {reportType === REPORT_TYPES.PURCHASE && Array.isArray(data) && (
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Purchase ID</th>
                <th>Vendor</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total Items</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.map((p) => (
                <tr key={p.purchaseId} className="border-t">
                  <td className="p-2">{p.purchaseId}</td>
                  <td>{p.vendorName}</td>
                  <td>{new Date(p.purchaseDate).toLocaleDateString()}</td>
                  <td>{p.status}</td>
                  <td>{p.totalItems}</td>
                  <td>₹{p.totalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
