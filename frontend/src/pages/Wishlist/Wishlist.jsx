import { useEffect, useState } from "react";
import WishlistItem from "../../components/Products/WishlistItem.jsx";
import api from "../../services/api.js";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await api.get("/wishlists/wishlist");
        const wishlistArray = res.data.data || [];
        const products = wishlistArray[0]?.products || [];
        setItems(products);
      } catch (err) {
        console.error("Failed to load wishlist", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await api.delete(`/wishlists/wishlist/${productId}`);
      setItems((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      console.error("Remove failed", err);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      setAddingId(productId);

      await api.post("/carts/add", { productId });
      await api.delete(`/wishlists/wishlist/${productId}`);

      setItems((prev) => prev.filter((p) => p._id !== productId));
      navigate("/cart");
    } catch (err) {
      console.error("Add to cart failed", err);
    } finally {
      setAddingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-sm tracking-wide text-gray-400">
        Loading your wishlist…
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-24">
      <h1 className="text-4xl font-semibold text-center mb-20 tracking-tight">
        My Wishlist
      </h1>

      {/* Header */}
      <div className="hidden md:grid grid-cols-[40px_100px_1fr_120px_140px_170px] gap-4 border-b border-gray-200 pb-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
        <span></span>
        <span></span>
        <span>Product</span>
        <span>Price</span>
        {/* <span>Status</span> */}
        <span></span>
      </div>

      {/* Items */}
      <div className="divide-y divide-gray-100">
        {items.length === 0 ? (
          <div className="py-28 text-center">
            <p className="text-gray-400 text-sm tracking-wide">
              Your wishlist is currently empty.
            </p>
          </div>
        ) : (
          items.map((product) => (
            <WishlistItem
              key={product._id}
              item={product}
              onRemove={handleRemove}
              onAddToCart={handleAddToCart}
              adding={addingId === product._id}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Wishlist;
