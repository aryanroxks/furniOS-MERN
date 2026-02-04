import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api.js";

const Register = () => {
  const navigate = useNavigate();

  // Basic details
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Contact & personal
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("male");

  // Address
  const [address, setAddress] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");

  // Business
  const [isBusiness, setIsBusiness] = useState(false);
  const [gstNumber, setGstNumber] = useState("");

  // UI
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // -------- validations --------
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }

    if (isBusiness) {
      const gstRegex =
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!gstRegex.test(gstNumber)) {
        setError("Invalid GST number format");
        return;
      }
    }

    // -------- payload (schema-aligned) --------
    const payload = {
      username,
      email,
      fullname: fullName,
      password,
      phone,
      gender,
      address,
      street,
      city,
      state: stateName,
      pincode,
      ...(isBusiness && { gstNumber })
    };

    try {
      setLoading(true);

      const endpoint = isBusiness
        ? "/users/register/wholesale-customer"
        : "/users/register/retail-customer";

      await api.post(endpoint, payload);

      window.location.href = "/login";
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-100 pt-24">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-center">
          Create Your Account
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Fill in your details to register
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded"
          />

          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded"
          />

          <input
            type="text"
            placeholder="Mobile Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded"
          />

          {/* Gender */}
          <div className="flex gap-4">
            {["male", "female", "other"].map((g) => (
              <label key={g} className="flex items-center gap-1">
                <input
                  type="radio"
                  value={g}
                  checked={gender === g}
                  onChange={(e) => setGender(e.target.value)}
                />
                {g}
              </label>
            ))}
          </div>

          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded"
          />

          <input
            type="text"
            placeholder="Street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded"
          />

          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded"
          />

          <input
            type="text"
            placeholder="State"
            value={stateName}
            onChange={(e) => setStateName(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded"
          />

          <input
            type="text"
            placeholder="Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded"
          />

          {/* Business checkbox */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isBusiness}
              onChange={(e) => setIsBusiness(e.target.checked)}
            />
            <span>Sign up as a business</span>
          </label>

          {/* GST (only if business) */}
          {isBusiness && (
            <input
              type="text"
              placeholder="GST Number"
              value={gstNumber}
              onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
              required
              className="w-full px-4 py-2 border rounded"
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#100F57] text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
  