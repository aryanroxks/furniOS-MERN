import { useNavigate } from "react-router-dom";
const WishlistItem = ({ item, onRemove, onAddToCart, adding }) => {
const navigate = useNavigate();

  return (
    <div className="grid grid-cols-[40px_100px_1fr_120px_140px_170px] items-center gap-4 py-8 transition hover:bg-gray-50/60">
      
      {/* Remove */}
      <button
        onClick={() => onRemove(item._id)}
        className="text-2xl text-gray-300 hover:text-black transition"
        aria-label="Remove from wishlist"
      >
        ×
      </button>

      {/* Image */}
      <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden" onClick={() => navigate(`/products/${item._id}`)}>
        <img
          src={item.primaryImage?.url}
          alt={item.name}
          className="h-full object-contain transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Name */}
      <p className="text-sm font-medium text-gray-800 leading-snug max-w-md">
        {item.name}
      </p>

      {/* Price */}
      <p className="text-sm font-medium text-gray-700">
        ₹{item.price.toLocaleString()}
      </p>

      {/* Stock */}
      {/* <span className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-full w-fit">
        In Stock
      </span> */}

      {/* Action */}
      <button
        onClick={() => onAddToCart(item._id)}
        disabled={adding}
        className={`
          px-6 py-2.5 text-xs font-semibold uppercase tracking-widest border rounded-md transition
          ${adding
            ? "opacity-50 cursor-not-allowed"
            : "border-black hover:bg-black hover:text-white"}
        `}
      >
        {adding ? "Adding…" : "Add to Cart"}
      </button>
    </div>
  );
};

export default WishlistItem;
