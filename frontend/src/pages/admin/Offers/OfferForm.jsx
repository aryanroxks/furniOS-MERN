import { useEffect, useState } from "react";
import api from "../../../services/api";

export default function OfferForm({
  mode = "create",
  initialData = null,
  onSubmit,
  loading = false,
}) {
  /* ---------- FORM STATE ---------- */
  const [form, setForm] = useState({
    title: "",
    description: "",
    discountType: "PERCENTAGE",
    discountValue: "",
    appliesTo: "ALL",
    products: [],
    subCategories: [],
    startDate: "",
    endDate: "",
    priority: 1,
  });

  const [productsList, setProductsList] = useState([]);
  const [subCategoriesList, setSubCategoriesList] = useState([]);

  const [errors, setErrors] = useState({});

  /* ---------- PREFILL (EDIT MODE) ---------- */
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        title: initialData.title || "",
        description: initialData.description || "",
        discountType: initialData.discountType,
        discountValue: initialData.discountValue,
        appliesTo: initialData.appliesTo,
        products: initialData.products?.map((p) => p._id) || [],
        subCategories: initialData.subCategories?.map((s) => s._id) || [],
        startDate: initialData.startDate?.slice(0, 16),
        endDate: initialData.endDate?.slice(0, 16),
        priority: initialData.priority ?? 1,
      });
    }
  }, [mode, initialData]);

  /* ---------- FETCH DROPDOWNS ---------- */
  useEffect(() => {
    fetchProducts();
    fetchSubCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products", { params: { limit: 1000 } });
      setProductsList(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch products");
    }
  };

  const fetchSubCategories = async () => {
    try {
      const res = await api.get("/categories/subcategories/all", { params: { limit: 1000 } });
      setSubCategoriesList(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch subcategories");
    }
  };

  /* ---------- HANDLERS ---------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ---------- APPLIES-TO CLEANUP ---------- */
  useEffect(() => {
    if (form.appliesTo === "ALL") {
      setForm((prev) => ({ ...prev, products: [], subCategories: [] }));
    }

    if (form.appliesTo === "PRODUCT") {
      setForm((prev) => ({ ...prev, subCategories: [] }));
    }

    if (form.appliesTo === "SUBCATEGORY") {
      setForm((prev) => ({ ...prev, products: [] }));
    }
  }, [form.appliesTo]);

  /* ---------- VALIDATION ---------- */
  const validate = () => {
    const errs = {};

    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.discountValue || form.discountValue <= 0)
      errs.discountValue = "Discount must be greater than 0";

    if (!form.startDate || !form.endDate)
      errs.date = "Start and end dates are required";

    if (
      form.startDate &&
      form.endDate &&
      new Date(form.startDate) >= new Date(form.endDate)
    ) {
      errs.date = "Start date must be before end date";
    }

    if (form.appliesTo === "PRODUCT" && form.products.length === 0) {
      errs.products = "Select at least one product";
    }

    if (
      form.appliesTo === "SUBCATEGORY" &&
      form.subCategories.length === 0
    ) {
      errs.subCategories = "Select at least one subcategory";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* ---------- SUBMIT ---------- */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...form,
      discountValue: Number(form.discountValue),
      priority: Number(form.priority),
    };

    onSubmit(payload);
  };

  /* ---------- UI ---------- */
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded shadow"
    >
      {/* TITLE */}
      <div>
        <label className="block font-medium mb-1">Title *</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
      </div>

      {/* DESCRIPTION */}
      <div>
        <label className="block font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          rows={3}
        />
      </div>

      {/* DISCOUNT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">Discount Type *</label>
          <select
            name="discountType"
            value={form.discountType}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="PERCENTAGE">Percentage</option>
            <option value="FLAT">Flat</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Discount Value *</label>
          <input
            type="number"
            name="discountValue"
            value={form.discountValue}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
          {errors.discountValue && (
            <p className="text-red-500 text-sm">{errors.discountValue}</p>
          )}
        </div>
      </div>

      {/* APPLIES TO */}
      <div>
        <label className="block font-medium mb-1">Applies To *</label>
        <select
          name="appliesTo"
          value={form.appliesTo}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="ALL">All Products</option>
          <option value="PRODUCT">Specific Products</option>
          <option value="SUBCATEGORY">Specific SubCategories</option>
        </select>
      </div>

      {/* PRODUCT SELECT */}
      {form.appliesTo === "PRODUCT" && (
        <div>
          <label className="block font-medium mb-1">Products *</label>
          <select
            multiple
            value={form.products}
            onChange={(e) =>
              handleMultiSelect(
                "products",
                Array.from(e.target.selectedOptions, (o) => o.value)
              )
            }
            className="w-full border rounded px-3 py-2 h-40"
          >
            {productsList.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
          {errors.products && (
            <p className="text-red-500 text-sm">{errors.products}</p>
          )}
        </div>
      )}

      {/* SUBCATEGORY SELECT */}
      {form.appliesTo === "SUBCATEGORY" && (
        <div>
          <label className="block font-medium mb-1">SubCategories *</label>
          <select
            multiple
            value={form.subCategories}
            onChange={(e) =>
              handleMultiSelect(
                "subCategories",
                Array.from(e.target.selectedOptions, (o) => o.value)
              )
            }
            className="w-full border rounded px-3 py-2 h-40"
          >
            {subCategoriesList.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
          {errors.subCategories && (
            <p className="text-red-500 text-sm">{errors.subCategories}</p>
          )}
        </div>
      )}

      {/* DATES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">Start Date *</label>
          <input
            type="datetime-local"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">End Date *</label>
          <input
            type="datetime-local"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}

      {/* PRIORITY */}
      <div>
        <label className="block font-medium mb-1">Priority</label>
        <input
          type="number"
          name="priority"
          value={form.priority}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* SUBMIT */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {mode === "edit" ? "Update Offer" : "Create Offer"}
        </button>
      </div>
    </form>
  );
}
