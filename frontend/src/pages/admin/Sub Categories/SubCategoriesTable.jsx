import { Eye, Pencil, Trash2 } from "lucide-react";

export default function SubCategoriesTable({
  subCategories,
  loading,
  onAction,
}) {
  return (
    <div className="bg-white rounded-xl shadow">
      <table className="w-full">
        <thead className="border-b">
          <tr className="text-left text-sm text-gray-500">
            <th className="p-4">SUB CATEGORY</th>
            <th className="p-4">DESCRIPTION</th>
            <th className="p-4">ACTIONS</th>
          </tr>
        </thead>

        <tbody>
          {loading && (
            <tr>
              <td colSpan="3" className="p-6 text-center">
                Loading...
              </td>
            </tr>
          )}

          {!loading &&
            subCategories.map((sc) => (
              <tr key={sc._id} className="border-b last:border-none">
                <td className="p-4 font-medium">{sc.name}</td>
                <td className="p-4 text-gray-600">
                  {sc.description || "-"}
                </td>
                <td className="p-4 flex gap-3">
                  <button onClick={() => onAction("view", sc)}>
                    <Eye size={18} />
                  </button>
                  <button onClick={() => onAction("edit", sc)}>
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => onAction("delete", sc)}>
                    <Trash2 size={18} className="text-red-600" />
                  </button>
                </td>
              </tr>
            ))}

          {!loading && subCategories.length === 0 && (
            <tr key="no-data">
              <td colSpan="3" className="p-6 text-center text-gray-500">
                No sub categories found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
