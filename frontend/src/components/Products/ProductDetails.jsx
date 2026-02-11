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
  /* ================= FEEDBACK STATES ================= */
  const [ratingSummary, setRatingSummary] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [myFeedbackExists, setMyFeedbackExists] = useState(false);
  const [myFeedback, setMyFeedback] = useState(null);
  const [editingFeedback, setEditingFeedback] = useState(false);
  const [cartError, setCartError] = useState("");
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");

  const MAX_QTY = 5;


  const [cartQty, setCartQty] = useState(0);
  const [qtyError, setQtyError] = useState("");


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

  /* ================= FETCH FEEDBACKS ================= */
  useEffect(() => {
    if (!product?._id) return;

    const fetchFeedbacks = async () => {
      try {
        const [summaryRes, feedbackRes] = await Promise.all([
          api.get(`/feedbacks/product/${product._id}/summary`),
          api.get(`/feedbacks/product/${product._id}`),
        ]);

        setRatingSummary(summaryRes.data.data);
        setFeedbacks(feedbackRes.data.data || []);
      } catch (err) {
        console.error("Feedback fetch failed", err);
      }
    };

    fetchFeedbacks();
  }, [product?._id]);

  useEffect(() => {
    const fetchMyFeedback = async () => {
      try {
        const res = await api.get("/feedbacks/my");
        const feedback = res.data.data.find(
          (f) => f.productID?._id === product._id
        );

        if (feedback) {
          setMyFeedback(feedback);
          setMyFeedbackExists(true);
          setRating(feedback.rating);
          setDescription(feedback.description || "");
        }
      } catch {
        setMyFeedback(null);
        setMyFeedbackExists(false);
      }
    };

    if (product?._id) fetchMyFeedback();
  }, [product?._id]);


  const handleSubmitFeedback = async () => {
    if (!rating) return;

    setFeedbackLoading(true);
    setFeedbackError("");

    try {
      if (editingFeedback && myFeedback) {
        // ✏️ UPDATE
        const res = await api.patch(
          `/feedbacks/my/${myFeedback._id}`,
          { rating, description }
        );

        setMyFeedback(res.data.data);
        setEditingFeedback(false);
      } else {
        // ➕ CREATE
        const res = await api.post(`/feedbacks/${product._id}`, {
          rating,
          description,
        });

        setMyFeedback(res.data.data);
        setMyFeedbackExists(true);
      }

      // Refresh list
      const listRes = await api.get(`/feedbacks/product/${product._id}`);
      setFeedbacks(listRes.data.data || []);
    } catch (err) {
      if (err.response?.status === 409) {
        setFeedbackError("You already submitted feedback.");
      } else if (err.response?.status === 401) {
        redirectToLoginWithIntent({
          type: "ADD_FEEDBACK",
          productId: product._id,
        });
      } else {
        setFeedbackError("Failed to save feedback");
      }
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleDeleteFeedback = async () => {
    if (!myFeedback) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete your feedback?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/feedbacks/my/${myFeedback._id}`);

      setMyFeedback(null);
      setMyFeedbackExists(false);
      setEditingFeedback(false);
      setRating(0);
      setDescription("");

      const res = await api.get(`/feedbacks/product/${product._id}`);
      setFeedbacks(res.data.data || []);
    } catch (err) {
      console.error("Delete feedback failed", err);
    }
  };





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
        const res = await api.get("/carts");
        const cartArray = res.data.data || [];
        const products = cartArray[0]?.products || [];

        const existingProduct = products.find(
          (p) => p._id === product?._id
        );

        if (existingProduct) {
          setCart(true);
          setCartQty(existingProduct.qty);
        } else {
          setCart(false);
          setCartQty(0);
        }
      } catch {
        setCart(false);
        setCartQty(0);
      }
    };

    if (product?._id) checkCart();
  }, [product?._id]);




  const allowedQty = cartQty > 0 ? MAX_QTY - cartQty : MAX_QTY;


  useEffect(() => {
    if (qty > allowedQty && allowedQty > 0) {
      setQty(allowedQty);
    }

    if (allowedQty === 0) {
      setQty(1);
    }
  }, [allowedQty]);





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

    if (qty > allowedQty) {
      setQtyError(`You can only add ${allowedQty} more item(s)`);
      return;
    }

    if (cartLoading) return;
    setCartLoading(true);
    setCartError(""); // Clear previous errors

    try {
      await api.post("/carts/add", {
        productId: product._id,
        qty,
      });

      setCart(true);
      setCartQty((prev) => prev + qty);
      setQty(1);
      setQtyError("");
      setCartError(""); // Clear on success
    } catch (err) {
      if (err.response?.status === 401) {
        redirectToLoginWithIntent({
          type: "ADD_TO_CART",
          productId: product._id,
          qty,
        });
      } else {
        // Extract error message from backend
        const message =
          err?.response?.data?.message ||
          "Failed to add item to cart";
        setCartError(message);
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
          {/* LEFT: Qty */}
          <div className="qty-section">
            <div className="qty">
              <button
                onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                disabled={qty === 1}
              >
                −
              </button>

              <input type="number" value={qty} readOnly />

              <button
                onClick={() => {
                  setQty((prev) => Math.min(prev + 1, allowedQty));
                }}
                disabled={qty >= allowedQty || allowedQty === 0}
              >
                +
              </button>
            </div>

            <p className="qty-limit">
              You can select up to <strong>{allowedQty}</strong> quantity
            </p>

            {qtyError && <p className="error">{qtyError}</p>}
          </div>

          {/* RIGHT: Buttons stacked */}
          <div className="cart-actions">
            <button
              className="add-cart"
              onClick={handleCart}
              disabled={cartLoading || allowedQty === 0}
            >
              ADD TO CART
            </button>

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
        </div>

        {/* Cart error BELOW row */}
        {cartError && (
          <div className="cart-error p-3 mt-3 bg-red-50 text-red-800 rounded flex justify-between items-center">
            <span>{cartError}</span>
            <button
              onClick={() => setCartError("")}
              className="font-bold"
            >
              ×
            </button>
          </div>
        )}


        <button className="place-order" onClick={handlePlaceOrder}>
          PLACE ORDER
        </button>

        {/* ================= FEEDBACK SECTION ================= */}
        <div className="feedback-box">
          <h3 className="section-title">Ratings & Reviews</h3>

          {/* SUMMARY */}
          {ratingSummary && (
            <div className="rating-summary">
              <div className="avg-rating">
                ⭐ {ratingSummary.averageRating} / 5
              </div>
              <p>
                {ratingSummary.totalReviews} reviews ·{" "}
                {ratingSummary.verifiedReviews} verified
              </p>
            </div>
          )}

          {/* FEEDBACK LIST */}
          <div className="feedback-list">
            {feedbacks.length === 0 && (
              <p className="muted">No reviews yet</p>
            )}

            {feedbacks.slice(0, 3).map((f) => (
              <div key={f._id} className="feedback-item">
                <div className="feedback-header">
                  <strong>{f.userID?.username}</strong>
                  <span>{"⭐".repeat(f.rating)}</span>
                </div>

                {f.isVerifiedPurchase && (
                  <span className="verified">✔ Verified Purchase</span>
                )}

                {f.description && (
                  <p className="feedback-text">{f.description}</p>
                )}

                {/* ✅ ADMIN REPLY */}
                {f.adminReply && (
                  <div className="admin-reply">
                    <strong className="admin-label">Admin Response</strong>
                    <p className="admin-reply-text">
                      {f.adminReply}
                    </p>
                  </div>
                )}
              </div>

            ))}
          </div>

          {/* ADD FEEDBACK */}
          {/* ADD / EDIT FEEDBACK */}
          <div className="add-feedback">
            <h4>
              {myFeedback ? "Your Review" : "Write a Review"}
            </h4>

            <div className="stars">
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  className={n <= rating ? "star active" : "star"}
                  onClick={() => editingFeedback || !myFeedback ? setRating(n) : null}
                >
                  ★
                </span>
              ))}
            </div>

            {(editingFeedback || !myFeedback) && (
              <textarea
                placeholder="Share your experience (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={1000}
              />
            )}

            {feedbackError && <p className="error">{feedbackError}</p>}

            <div className="feedback-actions">
              {!myFeedback && (
                <button
                  onClick={handleSubmitFeedback}
                  disabled={feedbackLoading || !rating}
                >
                  Submit
                </button>
              )}

              {myFeedback && !editingFeedback && (
                <>
                  <button onClick={() => setEditingFeedback(true)}>
                    Edit
                  </button>
                  <button className="danger" onClick={handleDeleteFeedback}>
                    Delete
                  </button>
                </>
              )}

              {editingFeedback && (
                <>
                  <button
                    onClick={handleSubmitFeedback}
                    disabled={feedbackLoading || !rating}
                  >
                    Save
                  </button>
                  <button
                    className="muted"
                    onClick={() => {
                      setEditingFeedback(false);
                      setRating(myFeedback.rating);
                      setDescription(myFeedback.description || "");
                    }}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

