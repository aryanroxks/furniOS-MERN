import { useState } from "react";
import ActionConfirmModal from "../../../components/common/ActionConfirmModal";
import api from "../../../services/api";

const RevertQuotationModal = ({
  quotation,
  onClose,
  onSuccess,
}) => {
  const [items, setItems] = useState(
    quotation.items.map((item) => ({
      quotationItemID: item.quotationItemID,
      productName: item.product.name,
      quantity: item.quantity,
      requestedPrice: item.requestedPrice,
      approvedPrice: item.approvedPrice || "",
    }))
  );

  const [adminNote, setAdminNote] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= UPDATE PRICE ================= */
  const updatePrice = (index, value) => {
    const updated = [...items];
    updated[index].approvedPrice = value;
    setItems(updated);
  };

  /* ================= SUBMIT ================= */
  const submitRevert = async () => {
    for (const item of items) {
      if (!item.approvedPrice || item.approvedPrice <= 0) {
        alert("Please enter approved price for all products");
        return;
      }
    }

    try {
      setLoading(true);

      await api.put(
        `/wholesale/admin/quotations/${quotation._id}/revert`,
        {
          items: items.map((i) => ({
            quotationItemID: i.quotationItemID,
            approvedPrice: Number(i.approvedPrice),
          })),
          adminNote,
        }
      );

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Revert failed", err);
      alert("Failed to revert quotation");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RENDER ================= */
  return (
  <ActionConfirmModal
  open={true}                        // ⭐ REQUIRED
  title="Revert Wholesale Quotation"
  onCancel={onClose}
  onConfirm={submitRevert}
  confirmText="Send to Wholesaler"
>

      <div className="space-y-4">
        {/* PRODUCT LIST */}
        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
          {items.map((item, index) => (
            <div
              key={item.quotationItemID}
              className="border rounded-lg p-3 flex flex-col md:flex-row md:items-center gap-3"
            >
              <div className="flex-1">
                <p className="font-medium">
                  {item.productName}
                </p>
                <p className="text-sm text-gray-500">
                  Qty: {item.quantity}
                </p>
              </div>

              <div className="text-sm text-gray-600">
                Requested: ₹{item.requestedPrice}
              </div>

              <input
                type="number"
                min={1}
                value={item.approvedPrice}
                onChange={(e) =>
                  updatePrice(index, e.target.value)
                }
                placeholder="Approved price"
                className="w-32 border rounded px-2 py-1 text-center"
              />
            </div>
          ))}
        </div>

        {/* ADMIN NOTE */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Note for Wholesaler (optional)
          </label>
          <textarea
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            className="w-full border rounded p-2 min-h-[80px]"
            placeholder="Explain pricing, conditions, or remarks"
          />
        </div>
      </div>
    </ActionConfirmModal>
  );
};

export default RevertQuotationModal;
