import React, { useState } from "react";
import api from "../../services/api.js";
import { useNavigate } from "react-router-dom";
import ForgotPasswordModal from "./ForgotPasswordModal.jsx";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1️⃣ LOGIN
      const res = await api.post("/users/login", {
        username,
        password,
      });

      console.log("LOGIN SUCCESS:", res.data);

      // 2️⃣ READ INTENT
      const actionRaw = localStorage.getItem("postLoginAction");
      const redirectPath =
        localStorage.getItem("redirectAfterLogin") || "/";

      if (actionRaw) {
        const action = JSON.parse(actionRaw);

        try {
          // 🟢 ADD TO CART
          if (action.type === "ADD_TO_CART") {
            await api.post("/carts/add", {
              productId: action.productId,
              qty: action.qty || 1,
            });

            // navigate(redirectPath);
            window.location.replace(redirectPath);

          }

          // 🟢 ADD TO WISHLIST
          else if (action.type === "ADD_TO_WISHLIST") {
            await api.post("/wishlists/wishlist", {
              productId: action.productId,
            });

            // navigate(redirectPath);
            window.location.replace(redirectPath);

          }

          // 🟢 BUY NOW (🔥 THIS WAS MISSING)
          else if (action.type === "BUY_NOW") {
            navigate(redirectPath, {
              state: {
                items: action.items,
                source: "POST_LOGIN",
              },
            });
          }
        } catch (err) {
          console.error("Post-login action failed", err);
          navigate("/");
        }

        // 3️⃣ CLEANUP
        localStorage.removeItem("postLoginAction");
        localStorage.removeItem("redirectAfterLogin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-2">
          Login to Your Account
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Welcome back! Please enter your credentials.
        </p>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#100F57] text-white py-2 rounded
                       hover:bg-blue-600 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>


        </form>

        <p className="mt-3 text-sm text-center">
          <button
            type="button"
            onClick={() => setShowForgotModal(true)}
            className="text-blue-600 hover:underline"
          >
            Forgot password?
          </button>
        </p>


        <p className="mt-4 text-sm text-gray-600 text-center">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
      {showForgotModal && (
        <ForgotPasswordModal
          onClose={() => setShowForgotModal(false)}
        />
      )}

    </div>
  );
};

export default LoginPage;
