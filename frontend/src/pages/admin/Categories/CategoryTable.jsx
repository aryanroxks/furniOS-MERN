import { Eye, Pencil, Trash2 } from "lucide-react";

export default function CategoryTable({ categories, onAction }) {
    return (
        <div className="bg-white rounded-xl shadow">
            <table className="w-full">
                <thead className="border-b">
                    <tr className="text-left text-sm text-gray-500">
                        <th className="p-4">CATEGORY</th>
                        <th className="p-4">DESCRIPTION</th>
                        <th className="p-4">CREATED</th>
                        <th className="p-4">ACTIONS</th>
                    </tr>
                </thead>

                <tbody>
                    {categories.map((cat) => (
                        <tr key={cat._id}
                            className="border-b last:border-none">
                            <td className="p-4 font-medium">{cat.name}</td>

                            <td className="p-4 text-gray-600">{cat.description}</td>

                            

                            <td className="p-4 text-gray-500">{cat.createdAt}</td>

                            <td className="p-4 flex gap-3">
                                <button onClick={() => onAction("view", cat)}>
                                    <Eye size={18} />
                                </button>
                                <button onClick={() => onAction("edit", cat)}>
                                    <Pencil size={18} />
                                </button>
                                <button onClick={() => onAction("delete", cat)}>
                                    <Trash2 size={18} className="text-red-600" />
                                </button>
                            </td>
                        </tr>
                    ))}

                    {categories.length === 0 && (
                        <tr>
                            <td colSpan="5" className="text-center p-6 text-gray-500">
                                No categories found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
