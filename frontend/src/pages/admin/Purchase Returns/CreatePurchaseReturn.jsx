import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../../services/api";
import PurchaseReturnForm from "./PurchaseReturnForm";

export default function CreatePurchaseReturn() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (payload) => {
    try {
      setLoading(true);
      await api.post("/purchase-returns", payload);
      navigate("/dashboard/purchase-returns");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create return");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Create Purchase Return</h1>

      <PurchaseReturnForm
        mode="create"
        onSubmit={handleCreate}
        loading={loading}
      />
    </div>
  );
}
