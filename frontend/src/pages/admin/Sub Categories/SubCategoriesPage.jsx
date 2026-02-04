import { useEffect, useState } from "react";
import api from "../../../services/api.js";
import SubCategoriesTable from "./SubCategoriesTable.jsx";
import SubCategoryModal from "./SubCategoryModal.jsx";

export default function SubCategoriesPage() {
  /* -------------------- STATE -------------------- */
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [allSubCategories, setAllSubCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // CATEGORY = show category-wise
  // ALL_SUB = show all sub categories
  const [mode, setMode] = useState("CATEGORY");

  const [modal, setModal] = useState({
    type: null, // add | view | edit | delete
    data: null,
  });

  /* ------------------ FETCH CATEGORIES ------------------ */
  const fetchCategories = async () => {
    const res = await api.get("/categories");
    const data = res.data.data || [];
    setCategories(data);

    if (data.length > 0) {
      setSelectedCategory(data[0]._id);
      setMode("CATEGORY");
    }
  };

  /* ---------------- FETCH SUB CATEGORIES (BY CATEGORY) ---------------- */
  const fetchSubCategories = async (categoryId) => {
    if (!categoryId) return;

    try {
      setLoading(true);
      const res = await api.get(
        `/categories/${categoryId}/subcategories`
      );
      setSubCategories(res.data.data || []);
    } catch {
      setSubCategories([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- FETCH ALL SUB CATEGORIES ---------------- */
  const fetchAllSubCategories = async () => {
    const res = await api.get("/categories/subcategories/all");
    setAllSubCategories(res.data.data || []);
  };

  /* -------------------- EFFECTS -------------------- */
  useEffect(() => {
    fetchCategories();
    fetchAllSubCategories();
  }, []);

  useEffect(() => {
    if (mode === "CATEGORY") {
      fetchSubCategories(selectedCategory);
    }
  }, [selectedCategory, mode]);

  /* -------------------- DATA SOURCE -------------------- */
  const tableSource =
    mode === "ALL_SUB" ? allSubCategories : subCategories;

  const filteredSubCategories = tableSource.filter((sc) =>
    sc.name.toLowerCase().includes(search.toLowerCase())
  );

  /* -------------------- UI -------------------- */
  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Sub Categories</h1>
          <p className="text-gray-500">
            Manage sub categories by category
          </p>
        </div>

        <button
          onClick={() => setModal({ type: "add", data: null })}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
          disabled={mode === "ALL_SUB"}
        >
          + Add Sub Category
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="flex gap-4">
        {/* CATEGORY DROPDOWN */}
        <select
          className="border rounded-lg px-4 py-2"
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setMode("CATEGORY");
          }}
          disabled={mode === "ALL_SUB"}
        >
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* MODE DROPDOWN */}
        <select
          className="border rounded-lg px-4 py-2"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <option value="CATEGORY">Category Wise</option>
          <option value="ALL_SUB">All Sub Categories</option>
        </select>

        {/* SEARCH */}
        <input
          className="flex-1 border rounded-lg px-4 py-2"
          placeholder="Search sub categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <SubCategoriesTable
        subCategories={filteredSubCategories}
        loading={loading}
        onAction={(type, data) =>
          setModal({ type, data })
        }
      />

      {/* MODAL */}
      {modal.type && (
        <SubCategoryModal
          modal={modal}
          close={() =>
            setModal({ type: null, data: null })
          }
          categories={categories}
          selectedCategory={selectedCategory}
          refresh={() => {
            if (mode === "CATEGORY") {
              fetchSubCategories(selectedCategory);
            } else {
              fetchAllSubCategories();
            }
          }}
        />
      )}
    </div>
  );
}
