const WishlistItem = ({ item, onRemove, onAddToCart, adding }) => {
  return (
    <div className="grid grid-cols-[40px_90px_1fr_120px_140px_160px] items-center gap-4 border-b py-6">
      
      {/* Remove */}
      <button
        onClick={() => onRemove(item._id)}
        className="text-xl text-gray-400 hover:text-black"
      >
        ×
      </button>

      {/* Image */}
      <div className="w-20 h-20 bg-gray-100 flex items-center justify-center">
        <img
          src={item.primaryImage?.url}
          alt={item.name}
          className="max-h-full object-contain"
        />
      </div>

      {/* Name */}
      <p className="text-sm font-medium text-gray-800">
        {item.name}
      </p>

      {/* Price */}
      <p className="text-sm text-gray-600">
        ₹{item.price.toLocaleString()}
      </p>

      {/* Stock */}
      <p className="text-sm text-green-600">
        In Stock
      </p>

      {/* Action */}
      <button
        onClick={() => onAddToCart(item._id)}
        disabled={adding}
        className={`
          border border-black px-5 py-2 text-xs uppercase tracking-wide transition
          ${adding
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-black hover:text-white"}
        `}
      >
        {adding ? "Adding..." : "Add to Cart"}
      </button>
    </div>
  );
};

export default WishlistItem;
