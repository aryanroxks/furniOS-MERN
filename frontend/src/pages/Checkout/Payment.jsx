import { useState } from "react";
import PaymentMethod from "../../components/Payments/PaymentMethod.jsx";
import PaymentAction from "../../components/Payments/PaymentAction.jsx";
import PriceSummary from "../../components/Payments/PriceSummary.jsx";
import { useNavigate, useLocation } from "react-router-dom";

export default function PaymentPage() {
  const [method, setMethod] = useState("COD");

  const { state } = useLocation();
  const navigate = useNavigate();


  const orderSummary = state?.orderSummary;
  const orderId = state?.orderId;

  // safety check (refresh / direct access)
  if (!orderSummary || !orderId) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow grid grid-cols-12 gap-6 p-6">

        {/* Left - Payment Methods */}
        <div className="col-span-12 md:col-span-4">
          <PaymentMethod method={method} setMethod={setMethod} />
        </div>

        {/* Middle - Action */}
        <div className="col-span-12 md:col-span-4 flex items-center justify-center">
          <PaymentAction method={method} orderId={orderId} />
        </div>

        {/* Right - Price Summary */}
        <div className="col-span-12 md:col-span-4">
          <PriceSummary order={orderSummary} />
        </div>

      </div>
    </div>
  );
}
