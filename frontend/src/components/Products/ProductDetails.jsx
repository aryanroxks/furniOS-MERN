import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../../services/api";
import "./ProductDetails.css";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();


  /* ================= STATES ================= */
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);

  const [pageLoading, setPageLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [cart, setCart] = useState(false);


  const [wishlisted, setWishlisted] = useState(false);
  const [mainMedia, setMainMedia] = useState(null);
  const [showDesc, setShowDesc] = useState(false);

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.data || res.data);
      } catch (err) {
        console.error("Failed to fetch product", err);
      } finally {
        setPageLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  /* ================= SET DEFAULT MEDIA ================= */
  useEffect(() => {
    if (!product) return;

    const images = product.images || [];
    const videos = product.videos || [];

    const mergedMedia = [
      ...images.map((img) => ({ ...img, type: "image" })),
      ...videos.map((vid) => ({ ...vid, type: "video" })),
    ];

    if (mergedMedia.length > 0) {
      setMainMedia(
        mergedMedia.find((item) => item.isPrimary) || mergedMedia[0]
      );
    }
  }, [product]);

  /* ================= CHECK WISHLIST ================= */
  useEffect(() => {
    if (!product?._id) return;

    const checkWishlist = async () => {
      try {
        const res = await api.get("/wishlists/wishlist");
        const wishlistArray = res.data.data || [];
        const products = wishlistArray[0]?.products || [];

        const exists = products.some(
          (p) => p._id === product._id
        );

        setWishlisted(exists);
      } catch {
        setWishlisted(false);
      }
    };

    checkWishlist();
  }, [product?._id]);

  /* ================= HANDLERS ================= */
  const changeMedia = (item) => {
    setMainMedia(item);
  };

  /* ============================
   SAVE INTENT & REDIRECT
   ============================ */
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
      if (wishlisted) {
        await api.delete(`/wishlists/wishlist/${product._id}`);
      } else {
        await api.post("/wishlists/wishlist", {
          productId: product._id,
        });
      }
    } catch (err) {
      setWishlisted((prev) => !prev);

      if (err.response?.status === 401) {
        redirectToLoginWithIntent({
          type: "ADD_TO_WISHLIST",
          productId: product._id,
        });
      } else {
        console.error("Wishlist error", err);
      }
    } finally {
      setWishlistLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    const items = [
      {
        productId: product._id,
        qty,
      },
    ];

    try {
      // Ping auth-protected endpoint
      await api.get("/users/current-user");

      // ✅ Logged in
      navigate("/checkout", {
        state: {
          items,
          source: "PRODUCT_PAGE",
        },
      });
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.setItem(
          "postLoginAction",
          JSON.stringify({
            type: "BUY_NOW",
            items,
          })
        );
        localStorage.setItem("redirectAfterLogin", "/checkout");
        navigate("/login");
      } else {
        console.error(err);
      }
    }
  };




  /********* HANDLE CART************/

  useEffect(() => {
    const checkCart = async () => {

      try {

        const res = await api.get("/carts")
        const cartArray = res.data.data || [];
        const products = cartArray[0]?.products || [];

        const exists = products.some(
          (p) => p._id === product._id
        );
        setCart(exists)

      } catch (error) {
        setCart(false);
      }


    }
    checkCart();
  }, [product?._id])







  /* ================= UI STATES ================= */
  if (pageLoading) return <p className="p-6">Loading...</p>;
  if (!product) return <p className="p-6">Product not found</p>;

  const images = product.images || [];
  const videos = product.videos || [];

  const media = [
    ...images.map((img) => ({ ...img, type: "image" })),
    ...videos.map((vid) => ({ ...vid, type: "video" })),
  ];




  const handleCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (cartLoading) return;

    setCartLoading(true);

    try {
      await api.post("/carts/add", {
        productId: product._id,
        qty,
      });
      setCart(true);
    } catch (err) {
      setCart(false);

      if (err.response?.status === 401) {
        redirectToLoginWithIntent({
          type: "ADD_TO_CART",
          productId: product._id,
          qty,
        });
      } else {
        console.error("Cart error", err);
      }
    } finally {
      setCartLoading(false);
    }
  };



  /* ================= RENDER ================= */
  return (
    <div className="pdp-wrapper">
      {/* LEFT SIDE */}
      <div className="pdp-images-wrapper">
        <div className="pdp-images">
          <div className="thumbnail-column">
            {media.map((item, index) =>
              item.type === "video" ? (
                <video
                  key={index}
                  src={item.url}
                  className={`thumbnail ${mainMedia?.url === item.url ? "active" : ""
                    }`}
                  muted
                  onClick={() => changeMedia(item)}
                />
              ) : (
                <img
                  key={index}
                  src={item.url}
                  alt="thumb"
                  className={`thumbnail ${mainMedia?.url === item.url ? "active" : ""
                    }`}
                  onClick={() => changeMedia(item)}
                />
              )
            )}
          </div>

          <div className="main-image">
            {mainMedia?.type === "video" ? (
              <video
                src={mainMedia.url}
                controls
                autoPlay
                muted
                className="main-media"
              />
            ) : (
              <img
                src={mainMedia?.url}
                alt={product.name}
                className="main-media"
              />
            )}
            <span className="badge">BEST SELLER</span>
          </div>
        </div>

        {product.features && (
          <div className="features-box">
            <h3 className="section-title">Features</h3>

            <ul className="features-list">
              {Object.entries(product.features).map(([key, value]) => (
                <li key={key}>
                  <strong>{key}:</strong> <span>{value}</span>
                </li>
              ))}
            </ul>
          </div>

        )}
        <div className="description-box">
          <button
            className="description-toggle"
            onClick={() => setShowDesc((prev) => !prev)}
          >
            Product Description
            <span>{showDesc ? "−" : "+"}</span>
          </button>

          {showDesc && (
            <p className="description">
              {product.description}
            </p>
          )}
        </div>

        {/* DESCRIPTION BELOW PRODUCT */}

      </div>

      {/* RIGHT SIDE */}
      <div className="pdp-details">
        <h1 className="title">{product.name}</h1>

        {/* <div className="price-row">
          <span className="price">₹{product.price}</span>
        </div> */}

        <div className="price-row">
          <span className="price">
            ₹{product.finalPrice ?? product.price}
          </span>

          {product.appliedOffer && (
            <>
              <span className="original-price">
                ₹{product.price}
              </span>

              <span className="offer-text">
                {product.appliedOffer.discountType === "PERCENTAGE"
                  ? `${product.appliedOffer.discountValue}% OFF`
                  : `₹${product.appliedOffer.discountValue} OFF`}
              </span>
            </>
          )}
        </div>

        {/* FEATURES */}




        <div className="cart-row">
          <div className="qty">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              disabled={qty === 1}
            >
              −
            </button>

            <input
              type="number"
              value={qty}
              min={1}
              readOnly
            />

            <button onClick={() => setQty(qty + 1)}>+</button>
          </div>


          <button className="add-cart" onClick={handleCart} disabled={cartLoading}>ADD TO CART</button>

          <button
            className="wishlist"
            onClick={handleWishlist}
            disabled={wishlistLoading}
          >
            <Heart
              size={18}
              className={
                wishlisted
                  ? "fill-red-500 text-red-500"
                  : "text-gray-700"
              }
            />
          </button>
        </div>

        <button className="place-order" onClick={handlePlaceOrder}>
          PLACE ORDER
        </button>


      </div>
    </div>
  );
}

