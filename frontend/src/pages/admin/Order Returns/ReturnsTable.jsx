import ReturnStatusBadge from "./ReturnStatusBadge";

export default function ReturnsTable({
  returns = [],
  loading,
  onView,
}) {
  if (loading)
    return <p className="p-4">Loading returns…</p>;

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Return ID</th>
            <th className="p-3">Order</th>
            <th className="p-3">Status</th>
            <th className="p-3">Refund</th>
            <th className="p-3">Requested</th>
            <th className="p-3"></th>
          </tr>
        </thead>

        <tbody>
          {returns.map((r) => (
            <tr key={r._id} className="border-t">
              <td className="p-3">
                {r._id.slice(-6)}
              </td>
              <td className="p-3">{r.orderID}</td>
              <td className="p-3">
                <ReturnStatusBadge status={r.status} />
              </td>
              <td className="p-3">₹{r.refundAmount}</td>
              <td className="p-3">
                {new Date(r.createdAt).toLocaleDateString()}
              </td>
              <td className="p-3 text-right">
                <button
                  onClick={() => onView(r)}
                  className="text-blue-600 hover:underline"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
