const STYLES = {
  REQUESTED: "bg-blue-50 text-blue-700",
  APPROVED: "bg-indigo-50 text-indigo-700",
  REJECTED: "bg-red-50 text-red-700",
  PICKED_UP: "bg-amber-50 text-amber-700",
  RECEIVED: "bg-purple-50 text-purple-700",
  REFUNDED: "bg-green-50 text-green-700",
};

export default function ReturnStatusBadge({ status }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${STYLES[status]}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}
