import { useEffect, useState } from "react";
import api from "../../services/api";
import "./Cart.css";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalCartValue, setTotalCartValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isWholesaleUser, setWholesaler] = useState(false);
  const [gstNumber, setGstNumber] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  /* ================= FETCH / REFRESH CART ================= */
  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await api.get("/carts");
      const data = res.data.data;

      setCartItems(data.products || []);
      setTotalCartValue(data.totalCartValue || 0);
    } catch (err) {
      console.error("Failed to fetch cart", err);
      setCartItems([]);
      setTotalCartValue(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  /* ================= INCREASE ================= */
  const increaseQty = async (productId) => {
    try {
      const res = await api.post("/carts/add", { productId });
      console.log(res.data.message);
      await fetchCart(); // 🔐 always refetch
      setError(""); // clear any previous error on success


    } catch (err) {
      console.error("Increase qty failed", err);

      const message =
        err?.res?.data?.message ||
        "You can add a maximum of 5 quantities of this product!";
      setError(message);
    }
  };

  /* ================= DECREASE ================= */
  const decreaseQty = async (productId) => {
    try {
      await api.patch("/carts/decrease", { productId });
      await fetchCart(); // 🔐 always refetch
    } catch (err) {
      console.error("Decrease qty failed", err);
    }
  };

  /* ================= REMOVE ================= */
  const removeItem = async (productId) => {
    try {
      await api.delete("/carts/remove", {
        data: { productId },
      });
      await fetchCart(); // 🔐 always refetch
    } catch (err) {
      console.error("Remove item failed", err);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await api.get("/users/current-user");
        const gst = res.data.data?.gstNumber;
        setGstNumber(gst || "");
        setWholesaler(Boolean(gst));
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };
    checkUser();
  }, []);

  const handleAddToQuotation = () => {
    navigate("/quotations/create")
  }


  /* ================= UI STATES ================= */
  if (loading) {
    return (
      <h1 className="p-6 text-center text-3xl font-bold">
        Loading cart...
      </h1>
    );
  }

  if (!cartItems.length) {
    return (
      <h1 className="p-6 text-center text-3xl font-bold">
        Your cart is empty.
      </h1>
    );
  }


  /* ================= RENDER ================= */
  return (
    <div className="cart-wrapper grid-cols-1 lg:grid-cols-3">
      {/* LEFT */}
      <div className="cart-left lg:col-span-2">
        {error && (
          <div className="cart-error p-3 mb-4 bg-red-50 text-red-800 rounded flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => setError("")}
              aria-label="Dismiss error"
              className="ml-4 font-bold"
            >
              ×
            </button>
          </div>
        )}
        <h2 className="cart-title">Shopping cart</h2>

        <div className="cart-header">
          <span>Product</span>
          <span>Price</span>
          <span>Quantity</span>
          <span>Subtotal</span>
        </div>

        {cartItems.map((item) => (
          <div key={item._id} className="cart-row">
            <div className="product-cell">
              <button
                className="remove-btn"
                onClick={() => removeItem(item._id)}
              >
                ×
              </button>

              <img src={item.image} alt={item.name} />

              <div className="product-text">
                <span>{item.name}</span>
              </div>
            </div>

            {/* PRICE */}
            <span>
              ₹{item.finalUnitPrice}
              {item.finalUnitPrice !== item.price && (
                <span className="original-price"> ₹{item.price}</span>
              )}
            </span>

            {/* QUANTITY */}
            <div className="qty-control">
              <button onClick={() => decreaseQty(item._id)}>−</button>
              <span>{item.quantity}</span>
              <button onClick={() => increaseQty(item._id)}>+</button>
            </div>

            {/* SUBTOTAL */}
            <span>
              ₹{(item.finalUnitPrice || 0) * (item.quantity || 0)}
            </span>
          </div>
        ))}
      </div>

      {/* RIGHT */}
      <div className="cart-right">
        <h2 className="cart-title">Cart totals</h2>

        <div className="summary">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{totalCartValue}</span>
          </div>

          <div className="summary-row total">
            <span>Total</span>
            <span>₹{totalCartValue}</span>
          </div>

          <button
            className="checkout-btn"
            onClick={() => navigate("/checkout")}
          >
            Proceed to checkout
          </button>

          {isWholesaleUser && (
            <button
              className="quotation-btn"
              onClick={handleAddToQuotation}
            >
              Add to Quotation
            </button>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartPage;
