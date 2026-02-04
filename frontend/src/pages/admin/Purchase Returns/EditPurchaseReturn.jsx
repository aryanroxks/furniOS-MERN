import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../services/api";
import PurchaseReturnForm from "./PurchaseReturnForm";

export default function EditPurchaseReturn() {
    const { returnID } = useParams();
    const navigate = useNavigate();

    const [initialData, setInitialData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const prRes = await api.get(`/purchase-returns/${returnID}`);
            const pr = prRes.data.data;

            if (pr.status !== "CREATED") {
                navigate("/dashboard/purchase-returns");
                return;
            }

            // 🔥 fetch purchase
            const purchaseRes = await api.get(`/purchases/${pr.purchaseID}`);
            const purchase = purchaseRes.data.data;

            setInitialData({
                purchaseID: pr.purchaseID,
                reason: pr.reason,
                items: pr.items.map((i) => {
                    const purchaseItem = purchase.items.find(
                        (p) =>
                            p.itemType === i.itemType &&
                            p.itemId === i.itemID._id
                    );

                    return {
                        itemType: i.itemType,
                        itemID: i.itemID._id,
                        purchasedQty: purchaseItem.quantity, // ✅ real purchased qty
                        maxQty: purchaseItem.quantity,        // UI hint only
                        quantity: i.quantity,
                        unitPrice: i.unitPrice,
                        reason: i.reason || "",
                    };
                }),
            });

            setLoading(false);
        };

        fetchData();
    }, [returnID]);


    const handleUpdate = async (payload) => {
        try {
            await api.patch(`/purchase-returns/${returnID}`, payload);
            navigate("/dashboard/purchase-returns");
        } catch (err) {
            alert(err.response?.data?.message || "Update failed");
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-semibold">Edit Purchase Return</h1>

            <PurchaseReturnForm
                mode="edit"
                initialData={initialData}
                onSubmit={handleUpdate}
            />
        </div>
    );
}
