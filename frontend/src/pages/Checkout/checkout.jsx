import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../services/api.js";
import "./Checkout.css";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  /* =========================
     ADDRESS (UNCHANGED)
  ========================== */
  const [address, setAddress] = useState({
    fullName: "",
    email: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    zip: "",
  });

  /* =========================
     CHECKOUT DATA
  ========================== */
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [pricing, setPricing] = useState({
    subtotal: 0,
    cgst: 0,
    sgst: 0,
    shipping: 500,
    discount: 0,
    total: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* =========================
     FETCH USER
  ========================== */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/current-user");
        const user = res.data.data;

        setAddress({
          fullName: user.fullname || "",
          email: user.email || "",
          phone: user.phone || "",
          addressLine: user.address || "",
          city: user.street || "",
          state: user.state || "",
          zip: user.pincode || "",
        });
      } catch {
        console.log("Failed to load user!");
      }
    };
    fetchUser();
  }, []);

  /* =========================
     ENTRY MODE
  ========================== */
  const buyNowItems = location.state?.items || null;

  useEffect(() => {
    if (buyNowItems) {
      loadBuyNowCheckout(buyNowItems);
    } else {
      loadCartCheckout();
    }
  }, []);

  /* =========================
     PRICE CALCULATION (CORE FIX)
  ========================== */
  const calculatePricing = (items) => {
    const subtotal = items.reduce(
      (sum, i) =>
        sum + (Number(i.finalUnitPrice) || 0) * (Number(i.quantity) || 0),
      0
    );

    const originalTotal = items.reduce(
      (sum, i) =>
        sum + (Number(i.price) || 0) * (Number(i.quantity) || 0),
      0
    );

    const cgst = subtotal * 0.09;
    const sgst = subtotal * 0.09;
    const shipping = 500;

    setPricing({
      subtotal,
      cgst,
      sgst,
      shipping,
      discount: originalTotal - subtotal,
      total: subtotal + cgst + sgst + shipping,
    });
  };


  /* =========================
     BUY NOW FLOW (FIXED)
  ========================== */
  const loadBuyNowCheckout = async (items) => {
    try {
      const enrichedItems = [];

      for (const item of items) {
        const res = await api.get(`/products/${item.productId}`);
        const product = res.data.data;
        console.log(product)

        enrichedItems.push({
          productId: product._id,
          name: product.name,
          price: Number(product.price),
          finalUnitPrice: Number(product.finalPrice ?? product.price),
          image: product.images?.[0]?.url,

          // 🔥 FIX: normalize qty → quantity
          quantity: Number(item.quantity ?? item.qty ?? 1),
        });


      }

      setCheckoutItems(enrichedItems);
      calculatePricing(enrichedItems);
    } catch {
      setError("Failed to load product for checkout");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     CART FLOW (FIXED)
  ========================== */
  const loadCartCheckout = async () => {
    try {
      const res = await api.get("/carts");
      const cart = res.data?.data;

      if (!cart || !cart.products) {
        throw new Error("Cart is empty");
      }

      const items = cart.products.map((p) => ({
        productId: p._id,
        name: p.name,
        price: Number(p.price),                 // original
        finalUnitPrice: Number(p.finalUnitPrice), // ✅ CORRECT
        image: p.image,
        quantity: Number(p.quantity ?? 1),
      }));



      setCheckoutItems(items);
      calculatePricing(items);
    } catch (err) {
      setError("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     FORM HANDLER (UNCHANGED)
  ========================== */
  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  /* =========================
     CREATE ORDER (UNCHANGED)
  ========================== */
  const handleContinueToPayment = async () => {
    try {
      setLoading(true);

      const items = checkoutItems.map((item) => ({
        productID: item.productId,
        quantity: item.quantity,
      }));

      const res = await api.post("/orders/create", {
        items,
        deliveryAddress1: address.addressLine,
        deliveryAddress2: `${address.city}, ${address.state} - ${address.zip}`,
      });

      navigate("/payment", {
        state: {
          orderId: res.data.data._id,
          orderSummary: res.data.data,
        },
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Order creation failed");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     UI STATES
  ========================== */
  if (loading) return <p className="p-6">Loading checkout...</p>;
  if (error) return <p className="p-6">{error}</p>;

  /* =========================
     UI (⚠️ UNCHANGED)
  ========================== */
  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        {/* LEFT SIDE – DO NOT TOUCH */}
        <div className="checkout-left">
          <h2 className="checkout-title">Checkout</h2>

          <div className="form-group">
            <label>Full name *</label>
            <input name="fullName" value={address.fullName} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input name="email" value={address.email} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Phone *</label>
            <input name="phone" value={address.phone} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Address *</label>
            <input
              name="addressLine"
              value={address.addressLine}
              onChange={handleChange}
            />
          </div>

          <div className="grid-3">
            <input name="city" value={address.city} onChange={handleChange} />
            <input name="state" value={address.state} onChange={handleChange} />
            <input name="zip" value={address.zip} onChange={handleChange} />
          </div>
        </div>

        {/* RIGHT SIDE – DO NOT TOUCH */}
        <div className="checkout-right">
          <h3>Review your order</h3>

          {checkoutItems.map((item) => (
            <div className="cart-item" key={item.productId}>
              <img src={item.image} alt="" />
              <div>
                <p>{item.name}</p>
                <p>{item.quantity}x</p>
              </div>
              <span>₹{item.price}</span>
            </div>
          ))}

          <div className="price-summary">
            <div>
              <span>Subtotal</span>
              <span>₹{pricing.subtotal.toFixed(2)}</span>
            </div>

            <div>
              <span>CGST (9%)</span>
              <span>₹{pricing.cgst.toFixed(2)}</span>
            </div>

            <div>
              <span>SGST (9%)</span>
              <span>₹{pricing.sgst.toFixed(2)}</span>
            </div>

            <div>
              <span>Shipping</span>
              <span>₹{pricing.shipping}</span>
            </div>

            <div>
              <span>Discount</span>
              <span>-₹{pricing.discount.toFixed(2)}</span>
            </div>

            <div className="total">
              <span>Total</span>
              <span>₹{pricing.total.toFixed(2)}</span>
            </div>
          </div>

          <button
            className="pay-btn"
            disabled={loading}
            onClick={handleContinueToPayment}
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
