import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

/* ================= CONSTANTS ================= */
const statusStyles = {
    REQUESTED: "bg-yellow-100 text-yellow-800",
    REVERTED: "bg-blue-100 text-blue-800",
    APPROVED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    ORDER_CREATED: "bg-emerald-100 text-emerald-800",
};

/* ================= HELPERS ================= */
const getUnitPrice = (item) =>
    item.finalPrice ?? item.approvedPrice ?? item.requestedPrice;

const getAmountLabel = (status) => {
    if (status === "REQUESTED") return "Total Requested Amount";
    if (status === "REVERTED") return "Total Approved Amount";
    return "Final Amount";
};

const QuotationDetails = () => {
    const { quotationID } = useParams();
    const navigate = useNavigate();

    const [quotation, setQuotation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    /* ================= FETCH DETAILS ================= */
    const fetchQuotation = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/wholesale/quotations/${quotationID}`);
            setQuotation(res.data.data);
        } catch (err) {
            console.error("Failed to fetch quotation", err);
            navigate("/profile/quotations");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuotation();
    }, [quotationID]);

    /* ================= ACTIONS ================= */
    const approveQuotation = async () => {
        if (!window.confirm("Approve this quotation and continue to checkout?"))
            return;

        try {
            setActionLoading(true);

            await api.post(
                `/wholesale/quotations/${quotationID}/approve`
            );

            // ✅ GO TO WHOLESALE CHECKOUT
            navigate(`/wholesale/checkout/${quotationID}`);

        } catch (err) {
            console.error("Approval failed", err);
            alert("Failed to approve quotation");
        } finally {
            setActionLoading(false);
        }
    };

    const rejectQuotation = async () => {
        if (!window.confirm("Reject this quotation?")) return;

        try {
            setActionLoading(true);
            await api.post(`/wholesale/quotations/${quotationID}/reject`);
            fetchQuotation();
        } catch (err) {
            console.error("Rejection failed", err);
            alert("Failed to reject quotation");
        } finally {
            setActionLoading(false);
        }
    };

    /* ================= UI STATES ================= */
    if (loading) {
        return <p className="p-6">Loading quotation details...</p>;
    }

    if (!quotation) return null;

    /* ================= PERMISSIONS ================= */
    const canEdit = quotation.status === "REQUESTED";
    const canReject =
        quotation.status === "REQUESTED" || quotation.status === "REVERTED";
    const canApprove = quotation.status === "REVERTED";

    /* ================= DERIVED TOTALS ================= */
    const computedTotalAmount = quotation.items.reduce(
        (sum, item) => sum + getUnitPrice(item) * item.quantity,
        0
    );
    const canPlaceOrder = quotation.status === "APPROVED";


    /* ================= RENDER ================= */
    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            {/* HEADER */}
            <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">
                        Quotation {quotation.quotationNumber}
                    </h1>
                    <p className="text-gray-600 text-sm">
                        Created on {new Date(quotation.createdAt).toLocaleString()}
                    </p>
                </div>

                <span
                    className={`self-start px-4 py-1.5 rounded-full text-sm font-medium ${statusStyles[quotation.status]
                        }`}
                >
                    {quotation.status.replace("_", " ")}
                </span>
            </div>

            {/* NOTES */}
            {(quotation.userNote || quotation.adminNote) && (
                <div className="grid md:grid-cols-2 gap-4">
                    {quotation.userNote && (
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="font-medium mb-1">Your Note</h3>
                            <p className="text-sm text-gray-700">
                                {quotation.userNote}
                            </p>
                        </div>
                    )}

                    {quotation.adminNote && (
                        <div className="bg-blue-50 rounded-lg p-4">
                            <h3 className="font-medium mb-1">Admin Note</h3>
                            <p className="text-sm text-gray-700">
                                {quotation.adminNote}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* PRODUCTS */}
            <div className="space-y-4">
                {quotation.items.map((item) => {
                    const unitPrice = getUnitPrice(item);

                    return (
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
                                <h3 className="font-semibold">
                                    {item.product.name}
                                </h3>

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
                                    ₹{unitPrice * item.quantity}
                                </p>
                            </div>
                        </div>
                    );
                })}
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
                        <span>{getAmountLabel(quotation.status)}</span>
                        <span>₹{computedTotalAmount}</span>
                    </div>
                </div>

                <div className="flex gap-3">
                    {canEdit && (
                        <button
                            onClick={() =>
                                navigate(`/profile/quotations/${quotationID}/edit`)
                            }
                            className="px-6 py-3 rounded border border-blue-500 text-blue-600 hover:bg-blue-50"
                        >
                            Edit Quotation
                        </button>
                    )}

                    {canReject && (
                        <button
                            onClick={rejectQuotation}
                            disabled={actionLoading}
                            className="px-6 py-3 rounded border border-red-500 text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                            Reject
                        </button>
                    )}

                    {canApprove && (
                        <button
                            onClick={approveQuotation}
                            disabled={actionLoading}
                            className="px-6 py-3 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                        >
                            Approve & Place Order
                        </button>
                    )}
                    {canPlaceOrder && (
                        <button
                            onClick={() =>
                                navigate(`/wholesale/checkout/${quotationID}`)
                            }
                            className="px-6 py-3 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                        >
                            Place Order
                        </button>
                    )}

                </div>
            </div>
        </div>
    );
};

export default QuotationDetails;
