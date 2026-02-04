export default function PaymentMethods({ method, setMethod }) {
  return (
    <div className="border rounded-md">
      <h2 className="px-4 py-3 font-semibold border-b">
        Payment Options
      </h2>

      {/* ONLINE */}
      <div
        onClick={() => setMethod("ONLINE")}
        className={`px-4 py-3 cursor-pointer border-b ${
          method === "ONLINE"
            ? "bg-blue-50 border-l-4 border-blue-500 font-semibold"
            : ""
        }`}
      >
        UPI / Card / NetBanking
      </div>

      {/* COD */}
      <div
        onClick={() => setMethod("COD")}
        className={`px-4 py-3 cursor-pointer ${
          method === "COD"
            ? "bg-blue-50 border-l-4 border-blue-500 font-semibold"
            : ""
        }`}
      >
        Cash on Delivery
      </div>
    </div>
  );
}
