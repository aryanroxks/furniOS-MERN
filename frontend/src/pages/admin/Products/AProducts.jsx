import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Package,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import api from "../../../services/api.js";

/* ------------------ STATUS UTILS ------------------ */

const STATUS = {
  "In Stock": {
    color: "text-green-600 bg-green-50",
    icon: <CheckCircle2 className="w-4 h-4 mr-1" />,
  },
  "Low Stock": {
    color: "text-orange-600 bg-orange-50",
    icon: <AlertCircle className="w-4 h-4 mr-1" />,
  },
  "Out of Stock": {
    color: "text-red-600 bg-red-50",
    icon: <XCircle className="w-4 h-4 mr-1" />,
  },
};

const getStatusFromStock = (stock) => {
  if (stock === 0) return "Out of Stock";
  if (stock <= 5) return "Low Stock";
  return "In Stock";
};

/* ------------------ ROW ------------------ */

const ProductRow = React.memo(({ product, onDelete }) => {
  const { color, icon } = STATUS[product.status];

  return (
    <tr className="group hover:bg-gray-50 transition">
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-12 h-12 rounded-lg object-cover border"
          />
          <div>
            <p className="font-semibold text-gray-900">{product.name}</p>
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
        <span className="px-3 py-1 text-xs rounded-full bg-gray-100 border">
          {product.category}
        </span>
      </td>

      <td className="px-6 py-4">₹ {product.price.toLocaleString()}</td>

      <td className="px-6 py-4">{product.stock} units</td>

      <td className="px-6 py-4">
        <div
          className={`flex items-center w-fit px-3 py-1 rounded-full text-xs border ${color}`}
        >
          {icon}
          {product.status}
        </div>
      </td>

      <td className="px-6 py-4 text-right">
        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100">
          <Link
            to={`/dashboard/products/${product.id}`}
            className="p-2 rounded-lg hover:bg-indigo-50 text-gray-500 hover:text-indigo-600"
          >
            <Eye size={16} />
          </Link>

          <Link
            to={`/dashboard/products/${product.id}/edit`}
            className="p-2 rounded-lg hover:bg-indigo-50 text-gray-500 hover:text-indigo-600"
          >
            <Edit size={16} />
          </Link>

          <button
            onClick={() => onDelete(product.id)}
            className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600"
          >
            <Trash2 size={16} />
          </button>

        </div>
      </td>
    </tr>
  );
});

/* ------------------ MAIN ------------------ */

export default function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(false);

  /* ------------------ API CALLS ------------------ */

  const fetchCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data.data);
  };

  const fetchSubCategories = async (categoryId) => {
    if (!categoryId) {
      setSubCategories([]);
      return;
    }

    const res = await api.get(`/categories/${categoryId}/subcategories`);
    setSubCategories(res.data.data);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await api.get("/products", {
        params: selectedSubCategory
          ? { subcategory: selectedSubCategory }
          : {},
      });

      const mapped = res.data.data.map((p) => ({
        id: p._id,
        name: p.name,
        price: p.price,
        stock: p.stock,
        category: p.subCategoryID?.name || "—",
        image:
          p.images?.find((img) => img.isPrimary)?.url ||
          p.images?.[0]?.url ||
          "/placeholder.png",
        status: getStatusFromStock(p.stock),
      }));

      setProducts(mapped);
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ EFFECTS ------------------ */

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchSubCategories(selectedCategory);
    setSelectedSubCategory("");
  }, [selectedCategory]);

  useEffect(() => {
    fetchProducts();
  }, [selectedSubCategory]);


  const handleDeleteProduct = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/products/delete-product/${productId}`);

      // Optimistic UI update (fast + clean)
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (error) {
      console.error(error);
      alert("Failed to delete product");
    }
  };


  /* ------------------ FILTERS ------------------ */

  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const stats = useMemo(
    () => ({
      total: products.length,

      // ✅ count ANY product that has stock >= 1
      inStock: products.filter((p) => p.stock >= 1).length,

      // optional but still accurate
      lowOutOfStock: products.filter((p) => p.stock === 0).length,
    }),
    [products]
  );


  /* ------------------ UI ------------------ */

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-500">Manage your inventory</p>
        </div>

        <button
          onClick={() => navigate("/dashboard/products/create")}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl"
        >
          <Plus size={18} />
          Add New Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Products", value: stats.total, icon: <Package /> },
          { label: "In Stock", value: stats.inStock, icon: <CheckCircle2 /> },
          {
            label: "Low / Out",
            value: stats.lowOutOfStock,
            icon: <AlertCircle />,
          },
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex gap-4 items-center">
              {s.icon}
              <div>
                <p className="text-sm text-gray-500">{s.label}</p>
                <h3 className="text-2xl font-bold">{s.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-3 text-gray-400" size={16} />
          <input
            className="w-full pl-9 pr-4 py-2 border rounded-lg"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="border rounded-lg px-4 py-2"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          className="border rounded-lg px-4 py-2"
          value={selectedSubCategory}
          onChange={(e) => setSelectedSubCategory(e.target.value)}
          disabled={!subCategories.length}
        >
          <option value="">All Subcategories</option>
          {subCategories.map((sub) => (
            <option key={sub._id} value={sub._id}>
              {sub.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {["Product", "Category", "Price", "Stock", "Status", "Actions"].map(
                (h) => (
                  <th key={h} className="px-6 py-4 text-left text-xs uppercase">
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <ProductRow
                key={p.id}
                product={p}
                onDelete={handleDeleteProduct}
              />
            ))}
          </tbody>
        </table>

        {!loading && filteredProducts.length === 0 && (
          <div className="p-10 text-center text-gray-500">
            No products found
          </div>
        )}
      </div>
    </div>
  );
}
