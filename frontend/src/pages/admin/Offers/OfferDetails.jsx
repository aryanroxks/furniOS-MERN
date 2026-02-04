import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../services/api";

export default function OfferDetails() {
  const { offerId } = useParams();
  const navigate = useNavigate();

  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOffer = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/offers/${offerId}`);
      setOffer(res.data.data);
    } catch (error) {
      console.error("Failed to fetch offer", error);
      alert("Offer not found");
      navigate("/dashboard/offers");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- HELPERS ---------- */
  const getStatus = () => {
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

  if (loading) {
    return (
      <div className="p-6">
        <p>Loading offer details...</p>
      </div>
    );
  }

  if (!offer) return null;

  const status = getStatus();

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Offer Details</h1>

        <div className="flex gap-2">
          <button
            onClick={() => navigate("/dashboard/offers")}
            className="px-4 py-2 border rounded"
          >
            Back
          </button>

          <button
            onClick={() => navigate(`/dashboard/offers/${offer._id}/edit`)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit
          </button>
        </div>
      </div>

      {/* SUMMARY CARD */}
      <div className="bg-white rounded shadow p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-medium">{offer.title}</h2>

          <span
            className={`px-3 py-1 rounded text-sm font-medium ${statusColor(
              status
            )}`}
          >
            {status}
          </span>
        </div>

        {offer.description && (
          <p className="text-gray-600">{offer.description}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Discount</p>
            <p className="font-medium">
              {offer.discountType === "PERCENTAGE"
                ? `${offer.discountValue}%`
                : `₹${offer.discountValue}`}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Applies To</p>
            <p className="font-medium">{offer.appliesTo}</p>
          </div>

          <div>
            <p className="text-gray-500">Priority</p>
            <p className="font-medium">{offer.priority}</p>
          </div>

          <div>
            <p className="text-gray-500">Start Date</p>
            <p className="font-medium">
              {new Date(offer.startDate).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-gray-500">End Date</p>
            <p className="font-medium">
              {new Date(offer.endDate).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Active Flag</p>
            <p
              className={`font-medium ${
                offer.isActive ? "text-green-600" : "text-red-600"
              }`}
            >
              {offer.isActive ? "Yes" : "No"}
            </p>
          </div>
        </div>
      </div>

      {/* PRODUCTS / SUBCATEGORIES */}
      {offer.appliesTo === "PRODUCT" && (
        <div className="bg-white rounded shadow p-6">
          <h3 className="font-medium mb-3">Products</h3>
          {offer.products.length === 0 ? (
            <p className="text-gray-500 text-sm">No products attached</p>
          ) : (
            <ul className="list-disc list-inside space-y-1 text-sm">
              {offer.products.map((p) => (
                <li key={p._id}>
                  {p.name}{" "}
                  <span className="text-gray-500">(₹{p.price})</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {offer.appliesTo === "SUBCATEGORY" && (
        <div className="bg-white rounded shadow p-6">
          <h3 className="font-medium mb-3">SubCategories</h3>
          {offer.subCategories.length === 0 ? (
            <p className="text-gray-500 text-sm">No subcategories attached</p>
          ) : (
            <ul className="list-disc list-inside space-y-1 text-sm">
              {offer.subCategories.map((s) => (
                <li key={s._id}>{s.name}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* META */}
      <div className="bg-white rounded shadow p-6 text-sm text-gray-600">
        <p>
          Created At:{" "}
          <span className="font-medium">
            {new Date(offer.createdAt).toLocaleString()}
          </span>
        </p>
        <p>
          Last Updated:{" "}
          <span className="font-medium">
            {new Date(offer.updatedAt).toLocaleString()}
          </span>
        </p>
      </div>
    </div>
  );
}
