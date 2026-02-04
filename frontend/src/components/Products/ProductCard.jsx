import "./ProductCard.css";
import { Heart } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api.js";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const [cart, setCart] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url;

  /* CHECK WISHLIST */
  useEffect(() => {
    const checkWishlist = async () => {
      try {
        const res = await api.get("/wishlists/wishlist");
        const products = res.data.data?.[0]?.products || [];
        setWishlisted(products.some((p) => p._id === product._id));
      } catch {
        setWishlisted(false);
      }
    };
    checkWishlist();
  }, [product._id]);

  /* CHECK CART */
  useEffect(() => {
    const checkCart = async () => {
      try {
        const res = await api.get("/carts");
        const products = res.data.data?.[0]?.products || [];
        setCart(products.some((p) => p._id === product._id));
      } catch {
        setCart(false);
      }
    };
    checkCart();
  }, [product._id]);

  const redirectToLoginWithIntent = (action) => {
    localStorage.setItem("postLoginAction", JSON.stringify(action));
    localStorage.setItem("redirectAfterLogin", location.pathname);
    navigate("/login");
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlistLoading) return;

    setWishlistLoading(true);
    setWishlisted((prev) => !prev);

    try {
      wishlisted
        ? await api.delete(`/wishlists/wishlist/${product._id}`)
        : await api.post("/wishlists/wishlist", {
          productId: product._id,
        });
    } catch (err) {
      setWishlisted((prev) => !prev);
      if (err.response?.status === 401) {
        redirectToLoginWithIntent({
          type: "ADD_TO_WISHLIST",
          productId: product._id,
        });
      }
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartLoading || cart) return;

    setCartLoading(true);
    setCart(true);

    try {
      await api.post("/carts/add", {
        productId: product._id,
      });
    } catch (err) {
      setCart(false);
      if (err.response?.status === 401) {
        redirectToLoginWithIntent({
          type: "ADD_TO_CART",
          productId: product._id,
          qty: 1,
        });
      }
    } finally {
      setCartLoading(false);
    }
  };

  return (
    <div className="product-card">
      {/* IMAGE */}
      <div
        className="product-image"
        onClick={() => navigate(`/products/${product._id}`)}
      >
        <img src={primaryImage} alt={product.name} />

        <button
          className="wishlist-btn"
          onClick={handleWishlist}
          disabled={wishlistLoading}
        >
          <Heart
            size={18}
            className={wishlisted ? "heart-active" : "heart"}
          />
        </button>
      </div>

      {/* BODY */}
      <div className="product-body">
        <p className="product-title">{product.name}</p>
        {/* <p className="price">₹{product.price}</p> */}
        <p className="price">
          ₹{product.finalPrice ?? product.price}

          {product.appliedOffer && (
            <span className="original-price">
              ₹{product.price}
            </span>
          )}
        </p>

        {product.appliedOffer && (
          <span className="offer-badge">
            {product.appliedOffer.discountType === "PERCENTAGE"
              ? `${product.appliedOffer.discountValue}% OFF`
              : `₹${product.appliedOffer.discountValue} OFF`}
          </span>
        )}


        <button
          className={`add-cart-btn ${cart ? "added" : ""}`}
          onClick={handleCart}
          disabled={cartLoading || cart}
        >
          {cart ? "Added to cart" : cartLoading ? "Adding..." : "Add to cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
