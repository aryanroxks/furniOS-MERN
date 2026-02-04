import React from "react";
import { useNavigate } from "react-router-dom";
const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="text-center max-w-md w-full">
        
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center">
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Thank you for your purchase
        </h1>

        {/* Text */}
        <p className="text-gray-500 text-sm mb-1">
          We've received your order will ship in 5-7 business days.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          Your order number is <span className="font-medium">#B6CT3</span>
        </p>

        {/* Button */}
        <button className="border border-gray-900 px-6 py-2 rounded-md text-sm font-medium hover:bg-gray-900 hover:text-white transition cursor-pointer" onClick={()=>navigate("/")}>
          Back to Home
        </button>

      </div>
    </div>
  );
};

export default OrderSuccess;
