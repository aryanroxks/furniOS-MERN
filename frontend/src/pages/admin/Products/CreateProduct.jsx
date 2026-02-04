import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";
import api from "../../../services/api";

export default function CreateProduct() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    categoryId: "",
    subCategoryId: "",
    name: "",
    description: "",
    price: "",
    features: {
      material: "",
      color: "",
      height: "",
      width: "",
      length: "",
    },
  });

  const [images, setImages] = useState([]);
  const [imageNames, setImageNames] = useState([]);
  const [videos, setVideos] = useState([]);

  /* ---------------- FETCH CATEGORIES ---------------- */

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

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ---------------- SUBMIT ---------------- */

  const handleCreateProduct = async () => {
    const { name, description, price, subCategoryId, features } = form;
    const { material, color, height, width, length } = features;

    /* ---------- FRONTEND VALIDATION ---------- */

    if (!name || !description || price === "" || !subCategoryId) {
      alert("All basic fields are required");
      return;
    }

    if (!material || !color || !height || !width || !length) {
      alert("All feature fields are required");
      return;
    }

    if (!images.length) {
      alert("At least one image is required");
      return;
    }

    if (imageNames.length !== images.length) {
      alert("Each image must have a name");
      return;
    }

    try {
      setLoading(true);

      const fd = new FormData();

      fd.append("subCategoryId", subCategoryId);
      fd.append("name", name.trim());
      fd.append("description", description);
      fd.append("price", Number(price));

      // IMPORTANT: stringify objects/arrays
      fd.append("features", JSON.stringify(features));
      fd.append("imageNames", JSON.stringify(imageNames));

      images.forEach((img) => fd.append("images", img));
      videos.forEach((vid) => fd.append("videos", vid));

      await api.post("/products/create-product", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Product created successfully");
      navigate("/dashboard/products");
    } catch (err) {
      console.error(err);
      alert(
        err?.response?.data?.message ||
          "Failed to create product"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded border hover:bg-gray-100"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-2xl font-bold">Create Product</h1>
      </div>

      <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
        {/* CATEGORY */}
        <Section title="Category">
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              value={form.categoryId}
              options={categories}
              onChange={(value) => {
                setForm({
                  ...form,
                  categoryId: value,
                  subCategoryId: "",
                });
                fetchSubCategories(value);
              }}
            />

            <Select
              label="Subcategory"
              value={form.subCategoryId}
              options={subCategories}
              disabled={!form.categoryId}
              onChange={(value) =>
                setForm({ ...form, subCategoryId: value })
              }
            />
          </div>
        </Section>

        {/* BASIC INFO */}
        <Section title="Basic Information">
          <Input
            label="Product Name"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
          />

          <Textarea
            label="Description"
            value={form.description}
            onChange={(v) =>
              setForm({ ...form, description: v })
            }
          />

          <Input
            label="Price"
            type="number"
            value={form.price}
            onChange={(v) => setForm({ ...form, price: v })}
          />
        </Section>

        {/* FEATURES */}
        <Section title="Features">
          <div className="grid grid-cols-2 gap-4">
            {["material", "color", "height", "width", "length"].map(
              (key) => (
                <Input
                  key={key}
                  label={key.toUpperCase()}
                  value={form.features[key]}
                  onChange={(v) =>
                    setForm({
                      ...form,
                      features: {
                        ...form.features,
                        [key]: v,
                      },
                    })
                  }
                />
              )
            )}
          </div>
        </Section>

        {/* IMAGES */}
        <Section title="Images">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              const files = Array.from(e.target.files);
              setImages(files);
              setImageNames(new Array(files.length).fill(""));
            }}
          />

          {images.map((_, i) => (
            <input
              key={i}
              placeholder={`Image ${i + 1} name (e.g front)`}
              className="w-full border rounded px-3 py-2"
              onChange={(e) => {
                const names = [...imageNames];
                names[i] = e.target.value;
                setImageNames(names);
              }}
            />
          ))}
        </Section>

        {/* VIDEOS */}
        <Section title="Videos (Optional)">
          <input
            type="file"
            multiple
            accept="video/*"
            onChange={(e) =>
              setVideos(Array.from(e.target.files))
            }
          />
        </Section>

        {/* SUBMIT */}
        <div className="flex justify-end">
          <button
            type="button"
            disabled={loading}
            onClick={handleCreateProduct}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded disabled:opacity-60"
          >
            <Upload size={16} />
            Create Product
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- SMALL COMPONENTS ---------------- */

function Section({ title, children }) {
  return (
    <div>
      <h3 className="font-semibold mb-3">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="text-sm text-gray-500">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded px-3 py-2"
      />
    </div>
  );
}

function Textarea({ label, value, onChange }) {
  return (
    <div>
      <label className="text-sm text-gray-500">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded px-3 py-2 min-h-[100px]"
      />
    </div>
  );
}

function Select({ label, value, options, onChange, disabled }) {
  return (
    <div>
      <label className="text-sm text-gray-500">{label}</label>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded px-3 py-2 disabled:bg-gray-100"
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt._id} value={opt._id}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );
}
