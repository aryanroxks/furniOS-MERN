import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../services/api";
import DeleteConfirmModal from "../../../components/common/DeleteConfirmModal";

const STATUS_COLORS = {
    CREATED: "bg-yellow-100 text-yellow-800",
    COMPLETED: "bg-green-100 text-green-800",
};

export default function ViewPurchaseReturn() {
    const { returnID } = useParams();
    const navigate = useNavigate();

    const [purchaseReturn, setPurchaseReturn] = useState(null);
    const [loading, setLoading] = useState(true);

    const [completeOpen, setCompleteOpen] = useState(false);
    const [processing, setProcessing] = useState(false);

    /* ---------------- FETCH RETURN ---------------- */
    const fetchReturn = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/purchase-returns/${returnID}`);
            setPurchaseReturn(res.data.data);
        } catch (err) {
            alert("Failed to load purchase return");
            navigate("/dashboard/purchase-returns");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReturn();
    }, [returnID]);

    /* ---------------- COMPLETE ---------------- */
    const handleComplete = async () => {
        try {
            setProcessing(true);
            await api.post(`/purchase-returns/${returnID}/complete`);
            setCompleteOpen(false);
            fetchReturn();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to complete return");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;
    if (!purchaseReturn) return null;

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold">Purchase Return Details</h1>
                    <p className="text-sm text-gray-500">
                        View returned items and stock impact
                    </p>
                </div>

                <button
                    onClick={() => navigate("/dashboard/purchase-returns")}
                    className="border px-4 py-2 rounded-md"
                >
                    Back
                </button>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white border rounded-lg p-4">
                <div>
                    <p className="text-sm text-gray-500">Vendor</p>
                    <p className="font-medium">
                        {purchaseReturn.vendorID?.name || "—"}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Purchase ID</p>
                    <p className="text-xs break-all">
                        {purchaseReturn.purchaseID}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Return Amount</p>
                    <p className="font-medium">
                        ₹{purchaseReturn.returnAmount}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span
                        className={`inline-block mt-1 px-3 py-1 rounded-full text-sm ${STATUS_COLORS[purchaseReturn.status]}`}
                    >
                        {purchaseReturn.status}
                    </span>
                </div>
            </div>

            {/* Items */}
            <div className="bg-white border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left">Item</th>
                            <th className="px-4 py-3 text-left">Type</th>
                            <th className="px-4 py-3 text-left">Qty</th>
                            <th className="px-4 py-3 text-left">Unit Price</th>
                            <th className="px-4 py-3 text-left">Line Total</th>
                            <th className="px-4 py-3 text-left">Reason</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y">
                        {purchaseReturn.items.map((i, idx) => (
                            <tr key={idx}>
                                <td className="px-4 py-3 font-medium">
                                    {i.itemID?.name || "—"}
                                </td>

                                <td className="px-4 py-3">{i.itemType}</td>

                                <td className="px-4 py-3">{i.quantity}</td>

                                <td className="px-4 py-3">₹{i.unitPrice}</td>

                                <td className="px-4 py-3 font-medium">
                                    ₹{i.lineTotal}
                                </td>

                                <td className="px-4 py-3">
                                    {i.reason || "—"}
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

            {/* Overall reason */}
            {purchaseReturn.reason && (
                <div className="bg-white border rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Overall Reason</p>
                    <p>{purchaseReturn.reason}</p>
                </div>
            )}

            {/* Actions */}
            {purchaseReturn.status === "CREATED" && (
                <div className="flex gap-3">
                    <button
                        onClick={() =>
                            navigate(
                                `/dashboard/purchase-returns/${returnID}/edit`
                            )
                        }
                        className="border px-5 py-2 rounded-md"
                    >
                        Edit
                    </button>

                    <button
                        onClick={() => setCompleteOpen(true)}
                        className="bg-green-600 text-white px-5 py-2 rounded-md"
                    >
                        Complete Return
                    </button>
                </div>
            )}

            {/* Complete Modal */}
            {completeOpen && (
                <DeleteConfirmModal
                    title="Complete Purchase Return?"
                    message="Completing this return will permanently reduce inventory stock. This action cannot be undone."
                    loading={processing}
                    onCancel={() => setCompleteOpen(false)}
                    onConfirm={handleComplete}
                />
            )}
        </div>
    );
}
