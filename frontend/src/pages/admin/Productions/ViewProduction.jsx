import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../services/api";
import DeleteConfirmModal from "../../../components/common/DeleteConfirmModal";

const STATUS_COLORS = {
    PLANNED: "bg-gray-100 text-gray-800",
    IN_PROGRESS: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
};

export default function ViewProduction() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [production, setProduction] = useState(null);
    const [loading, setLoading] = useState(true);

    const [action, setAction] = useState(null); // START | COMPLETE | CANCEL
    const [processing, setProcessing] = useState(false);

    /* ---------------- FETCH ---------------- */
    const fetchProduction = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/productions/${id}`);
            setProduction(res.data.data);
        } catch (err) {
            alert("Failed to load production");
            navigate("/dashboard/productions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduction();
    }, [id]);

    /* ---------------- ACTION ---------------- */
    const handleAction = async () => {
        if (!action) return;

        try {
            setProcessing(true);

            if (action === "START") {
                await api.post(`/productions/${id}/start`);
            }

            if (action === "COMPLETE") {
                await api.post(`/productions/${id}/complete`);
            }

            if (action === "CANCEL") {
                await api.post(`/productions/${id}/cancel`);
            }

            setAction(null);
            fetchProduction();
        } catch (err) {
            alert(err.response?.data?.message || "Action failed");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;
    if (!production) return null;

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold">
                        Production #{production.productionNumber}
                    </h1>
                    <p className="text-sm text-gray-500">
                        Production cycle details
                    </p>
                </div>

                <button
                    onClick={() => navigate("/dashboard/productions")}
                    className="border px-4 py-2 rounded-md"
                >
                    Back
                </button>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-white border rounded-lg p-4">
                <Meta label="Date" value={new Date(production.productionDate).toLocaleDateString()} />
                <Meta label="Status">
                    <span
                        className={`px-3 py-1 rounded-full text-xs ${STATUS_COLORS[production.status]}`}
                    >
                        {production.status}
                    </span>
                </Meta>
                <Meta label="Products">{production.products.length}</Meta>
                <Meta label="Total Cost">₹{production.totalProductionCost}</Meta>
                {production.completedAt && (
                    <Meta
                        label="Completed At"
                        value={new Date(production.completedAt).toLocaleString()}
                    />
                )}
            </div>

            {/* Products */}
            <div className="space-y-4">
                {production.products.map((p, idx) => (
                    <div key={idx} className="bg-white border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                            <h3 className="font-medium">
                                {p.productID?.name}
                            </h3>
                            <span className="text-sm text-gray-500">
                                Qty Produced: {p.quantityProduced}
                            </span>
                        </div>

                        <table className="w-full text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-3 py-2 text-left">Raw Material</th>
                                    <th className="px-3 py-2 text-left">Qty Used</th>
                                    <th className="px-3 py-2 text-left">Unit Cost</th>
                                    <th className="px-3 py-2 text-left">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {p.materialsUsed.map((m, mi) => (
                                    <tr key={mi}>
                                        <td className="px-3 py-2">
                                            {m.rawMaterialID?.name}
                                        </td>
                                        <td className="px-3 py-2">{m.quantityUsed}</td>
                                        <td className="px-3 py-2">₹{m.unitCostAtTime}</td>
                                        <td className="px-3 py-2 font-medium">
                                            ₹{m.totalCost}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="text-sm text-gray-600">
                            Product Cost: ₹{p.totalCost} · Unit Cost: ₹{p.unitCost}
                        </div>
                    </div>
                ))}
            </div>

            {/* Aggregated Raw Materials */}
            {/* Aggregated Raw Materials */}
            <div className="bg-white border rounded-lg overflow-hidden">
                <h3 className="px-4 py-3 font-medium border-b">
                    Total Raw Materials Used
                </h3>

                <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left">Raw Material</th>
                            <th className="px-4 py-3 text-left">Total Qty</th>
                            <th className="px-4 py-3 text-left">Total Cost</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {(production.rawMaterials || []).map((rm, i) => (
                            <tr key={i}>
                                <td className="px-4 py-3">
                                    {rm.rawMaterialID?.name}
                                </td>
                                <td className="px-4 py-3">
                                    {rm.totalQuantityUsed}
                                </td>
                                <td className="px-4 py-3 font-medium">
                                    ₹{rm.totalCost}
                                </td>
                            </tr>
                        ))}

                        {production.rawMaterials?.length === 0 && (
                            <tr>
                                <td colSpan="3" className="px-4 py-6 text-center text-gray-500">
                                    No aggregated raw materials found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>


            {/* Actions */}
            <div className="flex gap-3">
                {production.status === "PLANNED" && (
                    <>
                        <button
                            onClick={() => navigate(`/dashboard/productions/${id}/edit`)}
                            className="border px-5 py-2 rounded-md"
                        >
                            Edit
                        </button>

                        <button
                            onClick={() => setAction("START")}
                            className="bg-blue-600 text-white px-5 py-2 rounded-md"
                        >
                            Start
                        </button>

                        <button
                            onClick={() => setAction("CANCEL")}
                            className="bg-red-600 text-white px-5 py-2 rounded-md"
                        >
                            Cancel
                        </button>
                    </>
                )}

                {production.status === "IN_PROGRESS" && (
                    <>
                        <button
                            onClick={() => setAction("COMPLETE")}
                            className="bg-green-600 text-white px-5 py-2 rounded-md"
                        >
                            Complete Production
                        </button>

                        <button
                            onClick={() => setAction("CANCEL")}
                            className="bg-red-600 text-white px-5 py-2 rounded-md"
                        >
                            Cancel
                        </button>
                    </>
                )}
            </div>

            {/* Confirmation Modal */}
            {action && (
                <DeleteConfirmModal
                    title={`${action} Production?`}
                    message={
                        action === "COMPLETE"
                            ? "Completing production will deduct raw material stock and add finished goods stock. This action cannot be undone."
                            : `Are you sure you want to ${action.toLowerCase()} this production?`
                    }
                    loading={processing}
                    onCancel={() => setAction(null)}
                    onConfirm={handleAction}
                />
            )}
        </div>
    );
}

/* ---------- Small helper ---------- */
const Meta = ({ label, value, children }) => (
    <div>
        <p className="text-sm text-gray-500">{label}</p>
        <div className="font-medium">
            {children || value || "—"}
        </div>
    </div>
);
