import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import OfferForm from "./OfferForm";

export default function CreateOffer() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreateOffer = async (payload) => {
    try {
      setLoading(true);

      await api.post("/offers", payload);

      // success → redirect to list
      navigate("/dashboard/offers");
    } catch (error) {
      console.error("Failed to create offer", error);

      const message =
        error?.response?.data?.message || "Failed to create offer";

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Create Offer</h1>

      <OfferForm
        mode="create"
        onSubmit={handleCreateOffer}
        loading={loading}
      />
    </div>
  );
}
