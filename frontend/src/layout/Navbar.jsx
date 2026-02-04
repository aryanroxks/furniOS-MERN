import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { ShoppingCart, Heart } from "lucide-react";
import { User } from 'lucide-react';
import Logo from "../assets/images/navbarlogo.PNG";
import Hamburger from "../assets/images/hamburger.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState({});
  const [loadingCategory, setLoadingCategory] = useState(null);
  const [search, setSearch] = useState("");

  // 🔐 AUTH STATE (NEW)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const navigate = useNavigate();

  /* ============================
     CHECK AUTH (COOKIE BASED)
     ============================ */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get("/users/current-user");
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, []);

  /* ============================
     Fetch categories
     ============================ */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data.data || []);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };

    fetchCategories();
  }, []);


  useEffect(() => {
  if (!search.trim()) return;

  const delay = setTimeout(() => {
    navigate({
      pathname: "/products",
      search: `?search=${encodeURIComponent(search.trim())}`,
    });
  }, 500); // debounce time (ms)

  return () => clearTimeout(delay);
}, [search, navigate]);


  const fetchSubCategories = async (categoryId) => {
    if (subCategories[categoryId]) return;

    try {
      setLoadingCategory(categoryId);
      const res = await api.get(`/categories/${categoryId}/subcategories`);

      setSubCategories((prev) => ({
        ...prev,
        [categoryId]: res.data.data || [],
      }));
    } catch (err) {
      console.error("Failed to load subcategories", err);
    } finally {
      setLoadingCategory(null);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const value = search.trim();
    if (!value) return;

    navigate({
      pathname: "/products",
      search: `?search=${encodeURIComponent(value)}`,
    });

    setSearch("");
  };


  /* ============================
     LOGOUT
     ============================ */
  const handleLogout = async () => {
    await api.post("/users/logout");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <header className="w-full bg-[#B68C5A] text-black">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between text-lg">

        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={Logo} alt="Logo" className="h-10 object-contain" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="hover:text-gray-300 transition">Home</Link>
          <Link to="/about" className="hover:text-white transition">About Us</Link>
          <Link to="/contact" className="hover:text-white transition">Contact Us</Link>

          {/* Products Dropdown */}
          <div className="relative group">
            <Link to="/products" className="hover:text-white transition inline-block">
              Products
            </Link>

            <div className="absolute left-0 top-full hidden group-hover:block z-50">
              <div className="pt-3">
                <div className="bg-white text-black rounded-lg shadow-lg w-72 p-4">
                  {categories.map((cat) => (
                    <div
                      key={cat._id}
                      className="mb-4 last:mb-0 border-b last:border-b-0 pb-3"
                      onMouseEnter={() => fetchSubCategories(cat._id)}
                    >
                      <p className="font-semibold text-[#100F57]">
                        {cat.name}
                      </p>

                      {loadingCategory === cat._id && (
                        <p className="text-xs text-gray-400 mt-2">Loading...</p>
                      )}

                      {subCategories[cat._id]?.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {subCategories[cat._id].map((sub) => (
                            <li key={sub._id}>
                              <Link
                                to={`/products?subcategory=${sub._id}`}
                                className="text-sm text-gray-600 hover:text-[#100F57]"
                              >
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center gap-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="px-4 py-2 rounded-lg outline-none text-sm bg-white text-black w-48"
          />


          <Link to="/wishlist" className="p-2 bg-white rounded-lg">
            <Heart size={20} />
          </Link>

          <Link to="/cart" className="p-2 bg-white rounded-lg">
            <ShoppingCart size={20} />
          </Link>

          {!authLoading && (
            !isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2 bg-white rounded-lg font-semibold"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="px-5 py-2 bg-white rounded-lg font-semibold"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/profile"
                  className="p-2 bg-white rounded-lg"
                  title="Profile"
                >
                  <User />
                </Link>

                <button
                  onClick={handleLogout}
                  className="px-5 py-2 bg-white rounded-lg font-semibold"
                >
                  Logout
                </button>
              </>
            )
          )}



        </div>

        {/* Mobile Hamburger */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <img src={Hamburger} alt="Menu" className="h-7 w-7" />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#B68C5A] border-t border-black/20">
          <div className="flex flex-col gap-4 px-6 py-6 text-lg">
            <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
            <Link to="/products" onClick={() => setMenuOpen(false)}>Products</Link>
            <Link to="/wishlist" onClick={() => setMenuOpen(false)}>Wishlist</Link>
            <Link to="/cart" onClick={() => setMenuOpen(false)}>Cart</Link>

            {!authLoading && (
              !isLoggedIn ? (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)}
                    className="mt-2 w-full text-center px-5 py-2 bg-white rounded-lg font-semibold">
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)}
                    className="w-full text-center px-5 py-2 bg-white rounded-lg font-semibold">
                    Register
                  </Link>
                </>
              ) : (
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="w-full text-center px-5 py-2 bg-white rounded-lg font-semibold"
                >
                  Logout
                </button>
              )
            )}
          </div>
        </div>
      )}
    </header>
  );
}
