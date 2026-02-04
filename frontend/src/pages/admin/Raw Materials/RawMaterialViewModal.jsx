import { useEffect, useState } from "react";
import api from "../../../services/api";

export default function RawMaterialViewModal({ id, onClose }) {
  const [rm, setRm] = useState(null);

  useEffect(() => {
    api.get(`/raw-materials/${id}`).then(res => {
      setRm(res.data.data);
    });
  }, [id]);

  if (!rm) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold">Raw Material Details</h2>

        <p><b>Name:</b> {rm.name}</p>
        <p><b>UOM:</b> {rm.uomId?.name}</p>
        <p><b>Quantity:</b> {rm.quantity}</p>

        <div className="text-right">
          <button onClick={onClose} className="bg-gray-200 px-4 py-2 rounded-lg">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
