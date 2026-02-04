import React, { useState } from "react";
import { Link } from "react-router-dom";

import Logo from "../assets/images/navbarlogo.PNG";
import Hamburger from "../assets/images/hamburger.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full bg-[#B68C5A] text-black">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between text-lg">
  <Link to="/" className="flex items-center">
          <img src={Logo} alt="Logo" className="h-10   object-contain " />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="hover:text-gray-300 transition">
            Home
          </Link>
          <Link to="/about" className="hover:text-white transition">
            About Us
          </Link>
          <Link to="/contact" className="hover:text-white transition">
            Contact Us
          </Link>
          <Link to="/product" className="hover:text-white transition">
            Products
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/login"
            className="px-5 py-2 rounded-lg bg-white text-black hover:bg-[#C19A6B] font-semibold hover:opacity-90 transition">
            Login
          </Link>

          <Link
            to="/register"
            className="px-5 py-2 rounded-lg bg-white text-black hover:bg-[#C19A6B] font-semibold hover:opacity-90 transition">
            Register
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <img src={Hamburger} alt="Menu" className="h-7 w-7" />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#100F57] border-t border-white/20">
          <div className="flex flex-col gap-4 px-6 py-6">
            <Link to="/" className="hover:text-gray-300">
              Home
            </Link>
            <Link to="/about" className="hover:text-gray-300">
              About
            </Link>
            <Link to="/contact" className="hover:text-gray-300">
              Contact
            </Link>
            <Link to="/product" className="hover:text-gray-300">
              Products
            </Link>

            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="mt-2 w-full text-center px-5 py-2 rounded-lg border border-white hover:bg-white hover:text-[#100F57] transition"
            >
              Login
            </Link>

            <Link
              to="/register"
              onClick={() => setMenuOpen(false)}
              className="w-full text-center px-5 py-2 rounded-lg bg-white text-[#100F57] font-semibold hover:opacity-90 transition"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}