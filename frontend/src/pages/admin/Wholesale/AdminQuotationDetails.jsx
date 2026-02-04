import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../services/api.js";
import RevertQuotationModal from "./RevertQuotationModal.jsx";
import DeleteConfirmModal from "../../../components/common/DeleteConfirmModal.jsx";

const statusStyles = {
    REQUESTED: "bg-yellow-100 text-yellow-800",
    REVERTED: "bg-blue-100 text-blue-800",
    APPROVED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    ORDER_CREATED: "bg-emerald-100 text-emerald-800",
};

const AdminQuotationDetails = () => {
    const { quotationID } = useParams();
    const navigate = useNavigate();

    const [quotation, setQuotation] = useState(null);
    const [loading, setLoading] = useState(true);

    const [showRevertModal, setShowRevertModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);

    /* ================= FETCH DETAILS ================= */
    const fetchQuotation = async () => {
        try {
            setLoading(true);
            const res = await api.get(
                `/wholesale/admin/quotations/${quotationID}`
            );
            setQuotation(res.data.data);
        } catch (err) {
            console.error("Failed to fetch quotation", err);
            navigate("/dashboard/quotations");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuotation();
    }, [quotationID]);

    /* ================= REJECT ================= */
    const rejectQuotation = async () => {
        try {
            await api.post(
                `/wholesale/admin/quotations/${quotationID}/reject`
            );
            setShowRejectModal(false);
            fetchQuotation();
        } catch (err) {
            console.error("Reject failed", err);
            alert("Failed to reject quotation");
        }
    };

    /* ================= UI STATES ================= */
    if (loading) {
        return <p className="p-6">Loading quotation...</p>;
    }

    if (!quotation) return null;

    const canAct = quotation.status === "REQUESTED";

    /* ================= RENDER ================= */
    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* HEADER */}
            <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row justify-between gap-4">
                <div>
                    <button
                        onClick={() => navigate("/dashboard/quotations")}
                        className="text-sm text-blue-600 hover:underline mb-2"
                    >
                        ← Back to list
                    </button>

                    <h1 className="text-2xl font-semibold">
                        Quotation {quotation.quotationNumber}
                    </h1>

                    <p className="text-sm text-gray-600">
                        Created on{" "}
                        {new Date(quotation.createdAt).toLocaleString()}
                    </p>
                </div>

                <span
                    className={`self-start px-4 py-1.5 rounded-full text-sm font-medium ${statusStyles[quotation.status]
                        }`}
                >
                    {quotation.status.replace("_", " ")}
                </span>
            </div>

            {/* CUSTOMER INFO */}
            <div className="bg-white rounded-xl shadow p-6 grid md:grid-cols-3 gap-6">
                <div>
                    <p className="text-xs text-gray-500">Customer</p>
                    <p className="font-medium">
                        {quotation.user?.fullname}
                    </p>
                    <p className="text-sm text-gray-600">
                        {quotation.user?.email}
                    </p>
                </div>

                <div>
                    <p className="text-xs text-gray-500">GST Number</p>
                    <p className="font-medium">
                        {quotation.user?.gstNumber || "—"}
                    </p>
                </div>

                <div>
                    <p className="text-xs text-gray-500">Total Quantity</p>
                    <p className="font-medium">
                        {quotation.totalQuantity}
                    </p>
                </div>
            </div>

            {/* NOTES */}
            {(quotation.userNote || quotation.adminNote) && (
                <div className="grid md:grid-cols-2 gap-4">
                    {quotation.userNote && (
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm font-medium mb-1">
                                User Note
                            </p>
                            <p className="text-sm text-gray-700">
                                {quotation.userNote}
                            </p>
                        </div>
                    )}

                    {quotation.adminNote && (
                        <div className="bg-blue-50 rounded-lg p-4">
                            <p className="text-sm font-medium mb-1">
                                Admin Note
                            </p>
                            <p className="text-sm text-gray-700">
                                {quotation.adminNote}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* PRODUCTS */}
            <div className="space-y-4">
                {quotation.items.map((item) => (
                    <div
                        key={item.quotationItemID}
                        className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row gap-4"
                    >
                        <img
                            src={item.product.primaryImage?.url}
                            alt={item.product.name}
                            className="w-24 h-24 rounded object-cover"
                        />

                        <div className="flex-1">
                            <p className="font-semibold">
                                {item.product.name}
                            </p>

                            <p className="text-sm text-gray-600">
                                Quantity: {item.quantity}
                            </p>

                            <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <span className="text-gray-500">
                                        Requested Price
                                    </span>
                                    <p className="font-medium">
                                        ₹{item.requestedPrice}
                                    </p>
                                </div>

                                <div>
                                    <span className="text-gray-500">
                                        Approved Price
                                    </span>
                                    <p className="font-medium">
                                        {item.approvedPrice
                                            ? `₹${item.approvedPrice}`
                                            : "—"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                            <p className="text-sm text-gray-500">
                                Line Total
                            </p>
                            <p className="text-lg font-semibold">
                                ₹
                                {(item.approvedPrice ||
                                    item.requestedPrice) *
                                    item.quantity}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* SUMMARY + ACTIONS */}
            <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex justify-between gap-10">
                        <span>Total Quantity</span>
                        <span className="font-medium">
                            {quotation.totalQuantity}
                        </span>
                    </div>

                    <div className="flex justify-between gap-10 text-lg font-semibold">
                        <span>Total Requested Amount</span>
                        <span>₹{quotation.totalAmount}</span>
                    </div>
                </div>

                {canAct && (
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowRejectModal(true)}
                            className="px-6 py-3 rounded border border-red-500 text-red-600 hover:bg-red-50"
                        >
                            Reject
                        </button>

                        <button
                            onClick={() => {
                                console.log("Revert clicked");
                                setShowRevertModal(true);
                            }}
                            className="px-6 py-3 rounded bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Revert to Wholesaler
                        </button>
                    </div>
                )}
            </div>

            {/* MODALS */}
            {showRevertModal && (
                <RevertQuotationModal
                    quotation={quotation}
                    onClose={() => setShowRevertModal(false)}
                    onSuccess={fetchQuotation}
                />
            )}

            {showRejectModal && (
                <DeleteConfirmModal
                    title="Reject Wholesale Quotation"
                    description={`Are you sure you want to reject quotation ${quotation.quotationNumber}?`}
                    onCancel={() => setShowRejectModal(false)}
                    onConfirm={rejectQuotation}
                />
            )}
        </div>
    );
};

export default AdminQuotationDetails;
