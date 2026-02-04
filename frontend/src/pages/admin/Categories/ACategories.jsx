import { useEffect, useState } from "react";
import CategoryTable from "./CategoryTable.jsx";
import CategoryModal from "./CategoryModal.jsx";
import api from "../../../services/api.js";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [modal, setModal] = useState({
    type: null,
    data: null,
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get("/categories");
      setCategories(res.data.data); // ApiResponse structure
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Categories</h1>
          <p className="text-gray-500">Manage product categories</p>
        </div>

        <button
          onClick={() => setModal({ type: "add", data: null })}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          + Add New Category
        </button>
      </div>

      <input
        type="text"
        placeholder="Search categories..."
        className="w-full border rounded-lg px-4 py-2"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <CategoryTable
          categories={filteredCategories}
          onAction={(type, data) => setModal({ type, data })}
        />
      )}

      {modal.type && (
        <CategoryModal
          modal={modal}
          close={() => setModal({ type: null, data: null })}
          refresh={fetchCategories}
        />
      )}
    </div>
  );
}
