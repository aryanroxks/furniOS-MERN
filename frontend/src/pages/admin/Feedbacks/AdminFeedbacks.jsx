import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";

const statusColor = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default function AdminFeedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await api.get("/feedbacks/admin");
      setFeedbacks(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch feedbacks", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">
        Product Feedbacks
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left">User</th>
              <th className="border px-3 py-2 text-left">Product</th>
              <th className="border px-3 py-2">Rating</th>
              <th className="border px-3 py-2">Verified</th>
              <th className="border px-3 py-2">Status</th>
              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {feedbacks.map((fb) => (
              <tr key={fb._id} className="hover:bg-gray-50">
                <td className="border px-3 py-2">
                  {fb.userID?.username}
                </td>

                <td className="border px-3 py-2">
                  {fb.productID?.name}
                </td>

                <td className="border px-3 py-2 text-center">
                  {"⭐".repeat(fb.rating)}
                </td>

                <td className="border px-3 py-2 text-center">
                  {fb.isVerifiedPurchase ? "✔" : "—"}
                </td>

                <td className="border px-3 py-2 text-center">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${statusColor[fb.status]}`}
                  >
                    {fb.status}
                  </span>
                </td>

                <td className="border px-3 py-2 text-center">
                  <button
                    onClick={() =>
                      navigate(`/dashboard/feedbacks/${fb._id}`)
                    }
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}

            {feedbacks.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-4 text-gray-500"
                >
                  No feedbacks found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
