import { useState } from "react";
import api from "../../services/api.js";
import { useNavigate } from "react-router-dom";

export default function PaymentAction({ method, orderId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      setError("");

      // 1️⃣ COD FLOW
      if (method === "COD") {
        await api.post("/payments/payment", {
          orderId,
          method,
        });

        navigate("/order-success");
        return;
      }

      // 2️⃣ ONLINE FLOW
      if (method === "ONLINE") {
        // create payment + razorpay order
        const res = await api.post("/payments/payment", {
          orderId,
          method,
        });

        console.log("Backend response:", res.data); // ✅ Debug log

        const {
          razorpayOrderId,
          amount,
          paymentId,
        } = res.data.data;

        console.log("Extracted data:", { razorpayOrderId, amount, paymentId }); // ✅ Debug log

        // open Razorpay checkout
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: amount * 100,
          currency: "INR",
          order_id: razorpayOrderId,
          name: "FurniOS",
          description: "Order Payment",

          handler: async function (response) {
            console.log("✅ Razorpay handler called"); // ✅ Debug log
            console.log("Razorpay response:", response); // ✅ Debug log

            try {
              console.log("Sending verification request..."); // ✅ Debug log

              const verifyRes = await api.post("/payments/verify", {
                paymentId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              console.log("Verification response:", verifyRes.data); // ✅ Debug log
              navigate("/order-success");
            } catch (err) {
              console.error("❌ Verification error:", err); // ✅ Debug log
              console.error("Error response:", err.response?.data); // ✅ Debug log
              setError(err.response?.data?.message || "Payment verification failed");
            }
          },

          prefill: {
            name: "",
            email: "",
            contact: "",
          },

          theme: {
            color: "#facc15",
          },

          modal: {
            ondismiss: function () {
              console.log("❌ Payment modal closed"); // ✅ Debug log
              setLoading(false);
              setError("Payment cancelled");
            }
          }
        };

        console.log("Opening Razorpay with options:", options); // ✅ Debug log

        const razorpay = new window.Razorpay(options);
        razorpay.open();

        // Don't set loading false here - let it happen in handler or modal dismiss
      }
    } catch (err) {
      console.error("❌ Error in handlePlaceOrder:", err); // ✅ Debug log
      setError(
        err?.response?.data?.message || "Payment failed"
      );
      setLoading(false);
    }
  };

  return (
    <div className="w-full text-center">
      {error && (
        <p className="text-red-500 text-sm mb-4">
          {error}
        </p>
      )}

      <p className="text-sm text-gray-600 mb-4">
        Pay using {method}
      </p>

      <button
        onClick={handlePlaceOrder}
        disabled={loading}
        className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-3 rounded shadow disabled:opacity-50"
      >
        {loading ? "Processing..." : "Place Order"}
      </button>
    </div>
  );
}