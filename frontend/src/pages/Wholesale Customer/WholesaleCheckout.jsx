import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const WholesaleCheckout = () => {
  const { quotationID } = useParams();
  const navigate = useNavigate();

  /* =========================
     ADDRESS
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
     QUOTATION DATA
  ========================== */
  const [quotation, setQuotation] = useState(null);
  const [items, setItems] = useState([]);

  /* =========================
     PRICING
  ========================== */
  const [pricing, setPricing] = useState({
    subtotal: 0,
    cgst: 0,
    sgst: 0,
    shipping: 0,
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
          city: user.city || "",
          state: user.state || "",
          zip: user.pincode || "",
        });
      } catch {
        console.log("Failed to load user");
      }
    };
    fetchUser();
  }, []);

  /* =========================
     FETCH QUOTATION
  ========================== */
  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        setLoading(true);

        const res = await api.get(
          `/wholesale/quotations/${quotationID}`
        );

        const q = res.data.data;

        if (q.status !== "APPROVED") {
          throw new Error(
            "Quotation is not approved for checkout"
          );
        }

        setQuotation(q);

        const normalizedItems = q.items.map((item) => {
          const unitPrice =
            item.finalPrice ??
            item.approvedPrice ??
            item.requestedPrice;

          return {
            productID: item.productID,
            name: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
            finalUnitPrice: unitPrice,
            image: item.product.primaryImage?.url,
          };
        });

        setItems(normalizedItems);
        calculatePricing(normalizedItems);
      } catch (err) {
        console.error(err);
        setError(err?.response?.data?.message || err?.message || "Failed to load wholesale quotation"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuotation();
  }, [quotationID]);

  /* =========================
     PRICING CALCULATION
  ========================== */
  const calculatePricing = (items) => {
    const subtotal = items.reduce(
      (sum, i) => sum + i.finalUnitPrice * i.quantity,
      0
    );

    const cgst = subtotal * 0.09;
    const sgst = subtotal * 0.09;
    const shipping = 0;

    setPricing({
      subtotal,
      cgst,
      sgst,
      shipping,
      total: subtotal + cgst + sgst,
    });
  };

  /* =========================
     FORM HANDLER
  ========================== */
  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  /* =========================
     PLACE WHOLESALE ORDER
  ========================== */
  const handlePlaceOrder = async () => {
    try {
      setLoading(true);

      const res = await api.post(
        "/orders/wholesale/create",
        {
          quotationID,
          deliveryAddress1: address.addressLine,
          deliveryAddress2: `${address.city}, ${address.state} - ${address.zip}`,
        }
      );

      navigate("/payment", {
        state: {
          orderId: res.data.data._id,
          orderSummary: res.data.data,
        },
      });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "Wholesale order failed"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     UI STATES
  ========================== */
  if (loading) return <p className="p-6">Loading checkout...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  /* =========================
     UI
  ========================== */
  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* LEFT SIDE */}
        <div className="checkout-left">
          <h2 className="checkout-title">
            Wholesale Checkout
          </h2>

          <div className="form-group">
            <label>Full name *</label>
            <input
              name="fullName"
              value={address.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              name="email"
              value={address.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Phone *</label>
            <input
              name="phone"
              value={address.phone}
              onChange={handleChange}
            />
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
            <input
              name="city"
              value={address.city}
              onChange={handleChange}
            />
            <input
              name="state"
              value={address.state}
              onChange={handleChange}
            />
            <input
              name="zip"
              value={address.zip}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="checkout-right">
          <h3>Order Summary</h3>

          {items.map((item) => (
            <div
              className="cart-item"
              key={item.productID}
            >
              <img src={item.image} alt="" />
              <div>
                <p>{item.name}</p>
                <p>{item.quantity} × ₹{item.finalUnitPrice}</p>
              </div>
              <span>
                ₹{item.finalUnitPrice * item.quantity}
              </span>
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
              <span>₹0</span>
            </div>

            <div className="total">
              <span>Total</span>
              <span>₹{pricing.total.toFixed(2)}</span>
            </div>
          </div>

          <button
            className="pay-btn"
            disabled={loading}
            onClick={handlePlaceOrder}
          >
            {loading ? "Processing..." : "Proceed to Payment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WholesaleCheckout;
