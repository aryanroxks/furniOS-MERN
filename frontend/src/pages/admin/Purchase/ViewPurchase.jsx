import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../services/api";
import ReceivePurchaseModal from "../../../components/common/ReceivePurchaseModal";
import CancelPurchaseModal from "../../../components/common/CancelPurchaseModal";

const STATUS_COLORS = {
  PENDING: "bg-yellow-100 text-yellow-800",
  RECEIVED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function ViewPurchase() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(true);

  const [receiveOpen, setReceiveOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const fetchPurchase = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/purchases/${id}`);
      setPurchase(res.data.data);
    } catch (err) {
      alert("Failed to load purchase");
      navigate("/dashboard/purchases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchase();
  }, [id]);

  const handleReceive = async () => {
    try {
      setProcessing(true);
      await api.patch(`/purchases/${id}/receive`);
      setReceiveOpen(false);
      fetchPurchase();
    } catch (err) {
      alert(err.response?.data?.message || "Receive failed");
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = async () => {
    try {
      setProcessing(true);
      await api.patch(`/purchases/${id}/cancel`);
      setCancelOpen(false);
      fetchPurchase();
    } catch (err) {
      alert(err.response?.data?.message || "Cancel failed");
    } finally {
      setProcessing(false);
    }
  };


  //pdf
  const handleDownloadInvoice = () => {
    const invoiceUrl = `${import.meta.env.VITE_API_BASE_URL}/purchases/${id}/invoice`;
    window.open(invoiceUrl, "_blank", "noopener,noreferrer");
  };




  if (loading) return <div className="p-6">Loading...</div>;
  if (!purchase) return null;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Purchase Details</h1>
          <p className="text-sm text-gray-500">
            View complete purchase information
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard/purchases")}
          className="border px-4 py-2 rounded-md"
        >
          Back
        </button>
      </div>

      {/* Meta */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white border rounded-lg p-4">
        <div>
          <p className="text-sm text-gray-500">Vendor</p>
          <p className="font-medium">{purchase.vendorId?.name}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Purchase Date</p>
          <p className="font-medium">
            {new Date(purchase.purchaseDate).toLocaleDateString()}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Total Amount</p>
          <p className="font-medium">₹{purchase.totalAmount}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Status</p>
          <span
            className={`inline-block mt-1 px-3 py-1 rounded-full text-sm ${STATUS_COLORS[purchase.status]}`}
          >
            {purchase.status}
          </span>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Item ID</th>
              <th className="px-4 py-3 text-left">Qty</th>
              <th className="px-4 py-3 text-left">Unit Price</th>
              <th className="px-4 py-3 text-left">Line Total</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {purchase.items.map((i, idx) => (
              <tr key={idx}>
                <td className="px-4 py-3">{i.itemType}</td>
                <td className="px-4 py-3">{i.itemId}</td>
                <td className="px-4 py-3">{i.quantity}</td>
                <td className="px-4 py-3">₹{i.unitPrice}</td>
                <td className="px-4 py-3 font-medium">₹{i.lineTotal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Actions */}
      {/* Actions */}
      <div className="flex gap-3">
        {purchase.status === "PENDING" && (
          <>
            <button
              onClick={() => navigate(`/dashboard/purchases/${id}/edit`)}
              className="border px-5 py-2 rounded-md"
            >
              Edit
            </button>

            <button
              onClick={() => setReceiveOpen(true)}
              className="bg-green-600 text-white px-5 py-2 rounded-md"
            >
              Receive
            </button>

            <button
              onClick={() => setCancelOpen(true)}
              className="bg-red-600 text-white px-5 py-2 rounded-md"
            >
              Cancel
            </button>
          </>
        )}

        {purchase.status === "RECEIVED" && (
          <button
            onClick={handleDownloadInvoice}
            className="bg-blue-600 text-white px-5 py-2 rounded-md"
          >
            Download Invoice
          </button>
        )}
      </div>


      {/* Receive Modal */}
      {receiveOpen && (
        <ReceivePurchaseModal
          loading={processing}
          onCancel={() => setReceiveOpen(false)}
          onConfirm={handleReceive}
        />
      )}

      {/* Cancel Modal */}
      {cancelOpen && (
        <CancelPurchaseModal
          loading={processing}
          onCancel={() => setCancelOpen(false)}
          onConfirm={handleCancel}
        />
      )}
    </div>
  );
}
