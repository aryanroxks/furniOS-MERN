import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const statusStyles = {
  REQUESTED: "bg-yellow-100 text-yellow-800",
  REVERTED: "bg-blue-100 text-blue-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  ORDER_CREATED: "bg-emerald-100 text-emerald-800",
};

const QuotationsList = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  /* ================= FETCH QUOTATIONS ================= */
  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const res = await api.get("/wholesale/quotations/my");
      setQuotations(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch quotations", err);
      setQuotations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  /* ================= UI STATES ================= */
  if (loading) {
    return <p className="p-6">Loading quotations...</p>;
  }

  if (!quotations.length) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">My Quotations</h2>
        <p className="text-gray-600">
          You haven’t created any wholesale quotations yet.
        </p>
      </div>
    );
  }

  /* ================= RENDER ================= */
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">My Quotations</h2>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Quotation #</th>
              <th className="p-3 text-center">Total Qty</th>
              <th className="p-3 text-right">Total Amount</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Created</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {quotations.map((q) => (
              <tr key={q._id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">
                  {q.quotationNumber}
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
                      statusStyles[q.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {q.status.replace("_", " ")}
                  </span>
                </td>

                <td className="p-3 text-center text-gray-600">
                  {new Date(q.createdAt).toLocaleDateString()}
                </td>

                <td className="p-3 text-center">
                  <button
                    onClick={() =>
                      navigate(`/profile/quotations/${q._id}`)
                    }
                    className="text-blue-600 hover:underline font-medium"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuotationsList;
