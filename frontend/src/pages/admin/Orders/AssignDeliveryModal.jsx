import { useEffect, useState } from "react";
import api from "../../../services/api";

export default function AssignDeliveryModal({ order, onClose, onSuccess }) {
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState("");
  const [loading, setLoading] = useState(false);

  const isReassign = Boolean(order.deliveryPersonID);

  useEffect(() => {
    const fetchDeliveryPersons = async () => {
      try {
        const res = await api.get("/delivery-persons", {
          params: {
            status: "AVAILABLE",
            isActive: true,
          },
        });

        // ✅ USE RESPONSE CORRECTLY
        setDeliveryPersons(res.data.data.deliveryPersons);
      } catch (error) {
        console.error("Failed to fetch delivery persons");
      }
    };

    fetchDeliveryPersons();
  }, []);

  const handleAssign = async () => {
    if (!selectedPerson) return;

    setLoading(true);

    try {
      if (isReassign) {
        await api.patch(
          `/orders/${order._id}/reassign-order`,
          { newDeliveryPersonId: selectedPerson }
        );
      } else {
        await api.patch(
          `/orders/${order._id}/assign-order`,
          { deliveryPersonId: selectedPerson }
        );
      }

      onSuccess();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Assignment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">
          {isReassign ? "Reassign Delivery" : "Assign Delivery"}
        </h2>

        {/* Dropdown */}
        <select
          className="w-full border rounded px-3 py-2"
          value={selectedPerson}
          onChange={(e) => setSelectedPerson(e.target.value)}
        >
          <option value="">Select Delivery Person</option>

          {deliveryPersons.map((dp) => (
            <option key={dp._id} value={dp._id}>
              {dp.userID.fullname} ({dp.userID.phone})
            </option>
          ))}
        </select>


        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            disabled={!selectedPerson || loading}
            onClick={handleAssign}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {loading
              ? "Processing..."
              : isReassign
                ? "Reassign"
                : "Assign"}
          </button>
        </div>
      </div>
    </div>
  );
}
