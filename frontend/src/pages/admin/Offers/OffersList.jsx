import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import {
  Eye,
  Pencil,
  Trash2,
  Power,
  Plus,
} from "lucide-react";

export default function OffersList() {
  const navigate = useNavigate();

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ---------- FILTERS ---------- */
  const [status, setStatus] = useState("");
  const [appliesTo, setAppliesTo] = useState("");
  const [isActive, setIsActive] = useState("");

  /* ---------- PAGINATION ---------- */
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  /* ---------- SORT ---------- */
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    fetchOffers();
  }, [page, status, appliesTo, isActive, sortBy, sortOrder]);

  const fetchOffers = async () => {
    try {
      setLoading(true);

      const params = {
        page,
        limit,
        sortBy,
        sortOrder,
      };

      if (status) params.status = status;
      if (appliesTo) params.appliesTo = appliesTo;
      if (isActive !== "") params.isActive = isActive;

      const res = await api.get("/offers", { params });

      setOffers(res.data.data.offers);
      setTotalPages(res.data.data.pagination.totalPages);
    } catch (error) {
      console.error("Failed to fetch offers", error);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- HELPERS ---------- */
  const getStatusBadge = (offer) => {
    const now = new Date();
    const start = new Date(offer.startDate);
    const end = new Date(offer.endDate);

    if (now < start) return "UPCOMING";
    if (now > end) return "EXPIRED";
    return "ACTIVE";
  };

  const statusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700";
      case "UPCOMING":
        return "bg-blue-100 text-blue-700";
      case "EXPIRED":
        return "bg-gray-200 text-gray-600";
      default:
        return "";
    }
  };

  /* ---------- ACTIONS ---------- */

  const toggleOfferStatus = async (offerId) => {
    try {
      await api.patch(`/offers/${offerId}/toggle`);
      fetchOffers();
    } catch (error) {
      console.error("Failed to toggle offer", error);
    }
  };

  const deleteOffer = async (offerId) => {
    const confirm = window.confirm("Are you sure you want to delete this offer?");
    if (!confirm) return;

    try {
      // backend expects offerId in body
      await api.delete(`/offers/${offerId}/delete`);
      fetchOffers();
    } catch (error) {
      console.error("Failed to delete offer", error);
    }
  };

  /* ---------- UI ---------- */

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Offers</h1>
        <button
          onClick={() => navigate("/dashboard/offers/create")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Plus size={18} /> Create Offer
        </button>
      </div>

      {/* FILTERS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded shadow">
        <select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
          className="border rounded px-3 py-2"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="upcoming">Upcoming</option>
          <option value="expired">Expired</option>
        </select>

        <select
          value={appliesTo}
          onChange={(e) => {
            setPage(1);
            setAppliesTo(e.target.value);
          }}
          className="border rounded px-3 py-2"
        >
          <option value="">All Applies To</option>
          <option value="ALL">All</option>
          <option value="PRODUCT">Product</option>
          <option value="SUBCATEGORY">SubCategory</option>
        </select>

        <select
          value={isActive}
          onChange={(e) => {
            setPage(1);
            setIsActive(e.target.value);
          }}
          className="border rounded px-3 py-2"
        >
          <option value="">All (Active Flag)</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        <select
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {
            const [sb, so] = e.target.value.split("-");
            setSortBy(sb);
            setSortOrder(so);
          }}
          className="border rounded px-3 py-2"
        >
          <option value="createdAt-desc">Newest First</option>
          <option value="createdAt-asc">Oldest First</option>
          <option value="priority-asc">Priority ↑</option>
          <option value="priority-desc">Priority ↓</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3">Discount</th>
              <th className="p-3">Applies To</th>
              <th className="p-3">Status</th>
              <th className="p-3">Active</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : offers.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No offers found
                </td>
              </tr>
            ) : (
              offers.map((offer) => {
                const status = getStatusBadge(offer);

                return (
                  <tr key={offer._id} className="border-t">
                    <td className="p-3 font-medium">{offer.title}</td>

                    <td className="p-3 text-center">
                      {offer.discountType === "PERCENTAGE"
                        ? `${offer.discountValue}%`
                        : `₹${offer.discountValue}`}
                    </td>

                    <td className="p-3 text-center">{offer.appliesTo}</td>

                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${statusColor(
                          status
                        )}`}
                      >
                        {status}
                      </span>
                    </td>

                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          offer.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {offer.isActive ? "Yes" : "No"}
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() =>
                            navigate(`/dashboard/offers/${offer._id}`)
                          }
                          title="View"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          onClick={() =>
                            navigate(`/dashboard/offers/${offer._id}/edit`)
                          }
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => toggleOfferStatus(offer._id)}
                          title="Toggle Active"
                        >
                          <Power size={16} />
                        </button>

                        <button
                          onClick={() => deleteOffer(offer._id)}
                          title="Delete"
                          className="text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-end gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="px-3 py-1">
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
    </div>
  );
}
