import { useEffect, useState } from "react";
import WishlistItem from "../../components/Products/WishlistItem.jsx";
import api from "../../services/api.js";
import { useNavigate } from "react-router-dom";
const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const navigate=useNavigate()

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

  /* ================= REMOVE ================= */
  const handleRemove = async (productId) => {
    try {
      await api.delete(`/wishlists/wishlist/${productId}`);
      setItems((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      console.error("Remove failed", err);
    }
  };

  /* ================= ADD TO CART ================= */
  const handleAddToCart = async (productId) => {
    try {
      setAddingId(productId);

      await api.post("/carts/add", {
        productId,
      });

      // ✅ remove from wishlist after adding
      await api.delete(`/wishlists/wishlist/${productId}`);
      

      setItems((prev) => prev.filter((p) => p._id !== productId));
      navigate("/cart")
    } catch (err) {
      console.error("Add to cart failed", err);
    } finally {
      setAddingId(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-40 text-gray-500">
        Loading wishlist...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-semibold text-center mb-16">
        My Wishlist
      </h1>

      <div className="hidden md:grid grid-cols-[40px_90px_1fr_120px_140px_160px] gap-4 border-b pb-4 text-xs text-gray-500 uppercase tracking-wide">
        <span></span>
        <span></span>
        <span>Product Name</span>
        <span>Unit Price</span>
        <span>Stock Status</span>
        <span></span>
      </div>

      <div>
        {items.length === 0 ? (
          <p className="text-center text-gray-500 py-20">
            Your wishlist is empty.
          </p>
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
