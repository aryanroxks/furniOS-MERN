import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../services/api";
import OfferForm from "./OfferForm";

export default function EditOffer() {
  const { offerId } = useParams();
  const navigate = useNavigate();

  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ---------- FETCH OFFER ---------- */
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

  /* ---------- UPDATE ---------- */
  const handleUpdateOffer = async (payload) => {
    try {
      setSaving(true);

      await api.put(`/offers/${offerId}`, payload);

      navigate("/dashboard/offers");
    } catch (error) {
      console.error("Failed to update offer", error);

      const message =
        error?.response?.data?.message || "Failed to update offer";

      alert(message);
    } finally {
      setSaving(false);
    }
  };

  /* ---------- UI ---------- */
  if (loading) {
    return (
      <div className="p-6">
        <p>Loading offer...</p>
      </div>
    );
  }

  if (!offer) return null;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Edit Offer</h1>

      <OfferForm
        mode="edit"
        initialData={offer}
        onSubmit={handleUpdateOffer}
        loading={saving}
      />
    </div>
  );
}
