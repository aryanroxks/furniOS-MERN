import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Trash2, RefreshCcw } from "lucide-react";
import api from "../../../services/api.js";

export default function EditProduct() {
    const { productId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [product, setProduct] = useState(null);
    const [subCategories, setSubCategories] = useState([]);

    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        subCategoryID: "",
        features: {
            material: "",
            color: "",
            height: "",
            width: "",
            length: "",
        },
    });

    /* ---------- MEDIA STATE ---------- */
    const [newImages, setNewImages] = useState([]);
    const [imageNames, setImageNames] = useState([]);
    const [newVideos, setNewVideos] = useState([]);

    /* ---------------- FETCH PRODUCT ---------------- */

    const fetchProduct = async () => {
        const res = await api.get(`/products/${productId}`);
        const data = res.data.data;

        setProduct(data);
        setForm({
            name: data.name,
            description: data.description,
            price: data.price,
            subCategoryID: data.subCategoryID?._id || "",
            features: {
                material: data.features?.material || "",
                color: data.features?.color || "",
                height: data.features?.height || "",
                width: data.features?.width || "",
                length: data.features?.length || "",
            },
        });

        setLoading(false);
    };

    const fetchSubCategories = async (categoryId) => {
        if (!categoryId) return;
        const res = await api.get(`/categories/${categoryId}/subcategories`);
        setSubCategories(res.data.data);
    };

    useEffect(() => {
        fetchProduct();
    }, [productId]);

    useEffect(() => {
        if (product?.subCategoryID?.categoryID) {
            fetchSubCategories(product.subCategoryID.categoryID);
        }
    }, [product]);

    /* ---------------- UPDATE PRODUCT ---------------- */

    const handleUpdateProduct = async () => {
        const { material, color, height, width, length } = form.features;

        if (!material || !color || !height || !width || !length) {
            alert("All feature fields are required");
            return;
        }

        try {
            setSaving(true);

            const payload = {
                name: form.name,
                price: Number(form.price),
                description: form.description,
                features: form.features,
            };

            if (form.subCategoryID) {
                payload.subCategoryId = form.subCategoryID;
            }

            await api.patch(
                `/products/update-product/${productId}`,
                payload
            );

            alert("Product updated successfully");
        } finally {
            setSaving(false);
        }
    };

    /* ---------------- ADD MEDIA ---------------- */

    const handleAddMedia = async () => {
          console.log("ADD MEDIA CLICKED");

if (!newImages.length && !newVideos.length) {
  alert("Please select at least one image or video");
  return;
}
        if (newImages.length && newImages.length !== imageNames.length) {
            alert("Each image must have a name");
            return;
        }

        const fd = new FormData();

        newImages.forEach(img => fd.append("images", img));
        newVideos.forEach(vid => fd.append("videos", vid));

        fd.append("imageNames", JSON.stringify(imageNames)); // ✅ FIX

        await api.post(
            `/products/${productId}/add-media`,
            fd,
            { headers: { "Content-Type": "multipart/form-data" } }
        );

        setNewImages([]);
        setNewVideos([]);
        setImageNames([]);
        fetchProduct();
    };


    /* ---------------- REMOVE MEDIA ---------------- */

    const handleRemoveMedia = async (publicId) => {
        await api.delete(
            `/products/${productId}/remove-media`,
            { data: { publicId } }
        );
        fetchProduct();
    };

    /* ---------------- REPLACE MEDIA ---------------- */

    const handleReplaceMedia = async (publicId, file) => {
        const fd = new FormData();
        fd.append("media", file);
        fd.append("publicId", publicId);

        await api.put(
            `/products/${productId}/replace-media`,
            fd,
            { headers: { "Content-Type": "multipart/form-data" } }
        );

        fetchProduct();
    };

    if (loading) {
        return (
            <div className="p-10 text-center text-gray-500">
                Loading product...
            </div>
        );
    }

    /* ---------------- UI ---------------- */

    return (
        <div className="p-6 bg-gray-50 min-h-screen space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-lg border hover:bg-gray-100"
                >
                    <ArrowLeft size={18} />
                </button>
                <h1 className="text-2xl font-bold">Edit Product</h1>
            </div>

            <div className="bg-white rounded-xl border shadow-sm p-6 space-y-6">
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

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Price"
                            type="number"
                            value={form.price}
                            onChange={(v) => setForm({ ...form, price: v })}
                        />

                        <div>
                            <label className="text-sm text-gray-500">Subcategory</label>
                            <select
                                className="w-full border rounded-lg px-3 py-2"
                                value={form.subCategoryID}
                                onChange={(e) =>
                                    setForm({ ...form, subCategoryID: e.target.value })
                                }
                            >
                                <option value="">Select Subcategory</option>
                                {subCategories.map((sub) => (
                                    <option key={sub._id} value={sub._id}>
                                        {sub.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
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
                                            features: { ...form.features, [key]: v },
                                        })
                                    }
                                />
                            )
                        )}
                    </div>
                </Section>

                {/* MEDIA */}
                <Section title="Media">
                    <MediaGrid
                        title="Images"
                        items={product.images}
                        type="image"
                        onRemove={handleRemoveMedia}
                        onReplace={handleReplaceMedia}
                    />

                    <MediaGrid
                        title="Videos"
                        items={product.videos}
                        type="video"
                        onRemove={handleRemoveMedia}
                        onReplace={handleReplaceMedia}
                    />

                    {/* ADD MEDIA */}
                    <div className="space-y-3">
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) =>
                                setNewImages(Array.from(e.target.files))
                            }
                        />

                        {newImages.map((_, i) => (
                            <input
                                key={i}
                                placeholder="Image name (e.g front)"
                                className="border px-2 py-1 w-full"
                                onChange={(e) => {
                                    const names = [...imageNames];
                                    names[i] = e.target.value;
                                    setImageNames(names);
                                }}
                            />
                        ))}

                        <input
                            type="file"
                            multiple
                            accept="video/*"
                            onChange={(e) =>
                                setNewVideos(Array.from(e.target.files))
                            }
                        />

                        <button
                            type="button"
                            onClick={handleAddMedia}
                            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded"
                        >
                            <Upload size={16} />
                            Add Media
                        </button>
                    </div>
                </Section>

                {/* SAVE */}
                <div className="flex justify-end">
                    <button
                        disabled={saving}
                        onClick={handleUpdateProduct}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ---------------- HELPERS ---------------- */

function Section({ title, children }) {
    return (
        <div>
            <h3 className="font-semibold mb-4">{title}</h3>
            <div className="space-y-4">{children}</div>
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
                className="w-full border rounded-lg px-3 py-2"
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
                className="w-full border rounded-lg px-3 py-2 min-h-[100px]"
            />
        </div>
    );
}

function MediaGrid({ title, items = [], type, onRemove, onReplace }) {
    return (
        <div>
            <h4 className="font-medium mb-2">{title}</h4>
            <div className="grid grid-cols-3 gap-4">
                {items.map((m) => (
                    <div key={m.publicID} className="border p-2 rounded">
                        {type === "image" ? (
                            <img src={m.url} className="h-32 w-full object-contain" />
                        ) : (
                            <video src={m.url} controls className="h-32 w-full" />
                        )}

                        <div className="flex gap-2 mt-2">
                            <label className="text-sm text-blue-600 cursor-pointer">
                                <RefreshCcw size={14} /> Replace
                                <input
                                    hidden
                                    type="file"
                                    accept={type + "/*"}
                                    onChange={(e) =>
                                        onReplace(m.publicID, e.target.files[0])
                                    }
                                />
                            </label>

                            <button
                                onClick={() => onRemove(m.publicID)}
                                className="text-sm text-red-600 flex items-center gap-1"
                            >
                                <Trash2 size={14} /> Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
