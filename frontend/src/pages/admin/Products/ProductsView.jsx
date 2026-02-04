import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  IndianRupee,
  Layers,
  ImageIcon,
  Video,
} from "lucide-react";
import api from "../../../services/api.js";

export default function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH PRODUCT ---------------- */
  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${productId}`);
      const data = res.data.data;

      setProduct(data);

      const primaryImage =
        data.images?.find((img) => img.isPrimary)?.url ||
        data.images?.[0]?.url ||
        "";

      setActiveImage(primaryImage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-10 text-center text-gray-500">
        Product not found
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/dashboard/products")}
          className="p-2 rounded-lg border hover:bg-gray-100"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {product.name}
          </h1>
          <p className="text-sm text-gray-500">
            Product Details (View Only)
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT — MEDIA */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="border rounded-xl overflow-hidden bg-gray-50 aspect-[4/3]">
            {activeImage ? (
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <ImageIcon size={40} />
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div className="flex gap-3 overflow-x-auto">
              {product.images.map((img) => (
                <button
                  key={img._id}
                  onClick={() => setActiveImage(img.url)}
                  className={`border rounded-lg overflow-hidden w-20 h-20 flex-shrink-0 ${
                    activeImage === img.url
                      ? "ring-2 ring-indigo-500"
                      : ""
                  }`}
                >
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-contain bg-gray-50"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — DETAILS */}
        <div className="space-y-6">
          {/* Price / Stock / Category */}
          <div className="flex flex-wrap gap-6">
            <InfoBox
              icon={<IndianRupee />}
              label="Price"
              value={`₹ ${product.price.toLocaleString()}`}
            />
            <InfoBox
              icon={<Package />}
              label="Stock"
              value={`${product.stock} units`}
            />
            <InfoBox
              icon={<Layers />}
              label="Subcategory"
              value={product.subCategoryID?.name || "—"}
            />
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">
              Description
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {product.description || "No description provided."}
            </p>
          </div>

          {/* Features */}
          {product.features &&
            Object.keys(product.features).length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Product Features
                </h3>
                <div className="space-y-2">
                  {Object.entries(product.features).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between text-sm bg-gray-50 px-4 py-2 rounded-lg border"
                      >
                        <span className="text-gray-500 capitalize">
                          {key.replace(/_/g, " ")}
                        </span>
                        <span className="font-medium text-gray-900">
                          {value}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

          {/* Videos */}
          {product.videos?.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Video size={18} />
                Product Videos
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.videos.map((vid) => (
                  <div
                    key={vid._id}
                    className="aspect-video border rounded-xl overflow-hidden bg-black"
                  >
                    <video
                      src={vid.url}
                      controls
                      className="w-full h-full object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- INFO BOX ---------------- */

function InfoBox({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl border">
      <div className="text-indigo-600">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
