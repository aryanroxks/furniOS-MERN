export default function RawMaterialsTable({
  data,
  loading,
  onEdit,
  onView,
  onDelete
}) {
  if (loading) return <p>Loading...</p>;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 text-sm">
          <tr>
            <th className="p-4 text-left">Name</th>
            <th>UOM</th>
            <th>Quantity</th>
            <th>Status</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map(rm => (
            <tr key={rm._id} className="border-t">
              <td className="p-4 font-medium">{rm.name}</td>
              <td>{rm.uomId?.name}</td>
              <td>{rm.quantity}</td>
              <td>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  rm.quantity > 0
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}>
                  {rm.quantity > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </td>
              <td className="p-4 text-right space-x-3">
                <button onClick={() => onView(rm._id)} className="text-gray-600">View</button>
                <button onClick={() => onEdit(rm)} className="text-indigo-600">Edit</button>
                <button onClick={() => onDelete(rm._id)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
