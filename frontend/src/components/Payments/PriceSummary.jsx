export default function PriceSummary({ order }) {
  if (!order || !order.products) return null;

  const itemsTotal = order.products.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalItems = order.products.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div className="border rounded-md p-4 bg-gray-50">
      <h3 className="font-semibold mb-4">Price Details</h3>

      <div className="flex justify-between text-sm mb-2">
        <span>Price ({totalItems} item{totalItems > 1 ? "s" : ""})</span>
        <span>₹{itemsTotal}</span>
      </div>

      <div className="flex justify-between text-sm mb-2">
        <span>CGST</span>
        <span>₹{order.CGST}</span>
      </div>

      <div className="flex justify-between text-sm mb-2">
        <span>SGST</span>
        <span>₹{order.SGST}</span>
      </div>

      <div className="flex justify-between text-sm mb-2">
        <span>Shipping Charges</span>
        <span>₹{order.shippingCharge}</span>
      </div>

      <hr className="my-3" />

      <div className="flex justify-between font-semibold text-blue-600">
        <span>Total Amount</span>
        <span>₹{order.total}</span>
      </div>
    </div>
  );
}
