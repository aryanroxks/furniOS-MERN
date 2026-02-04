import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-10 px-8 flex flex-col md:flex-row justify-between font-sans">
      {/* About Section */}
      <div className="flex-1 max-w-[30%] mb-8 md:mb-0">
        <h3 className="text-xl font-semibold mb-4">About SkiChairz</h3>
        <p className="text-sm leading-relaxed">
          SkiChairz is proudly based in Ahmedabad, delivering premium furniture to homes and businesses. 
          Our commitment to quality craftsmanship and customer satisfaction drives everything we do—from design to doorstep.
          Whether you're furnishing a cozy apartment or a spacious office, SkiChairz ensures seamless experience with reliable
          delivery and personalized service.
        </p>
      </div>

      {/* Explore Section */}
      <div className="flex-1 max-w-[20%] mb-8 md:mb-0">
        <h3 className="text-xl font-semibold mb-4">Explore</h3>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-gray-400 bg-transparent border-none cursor-pointer"
            >
              Home
            </button>
          </li>
          <li><a href="/products" className="hover:text-gray-400">Products</a></li>
          <li><a href="/contact" className="hover:text-gray-400">Contact</a></li>
          <li><a href="/about" className="hover:text-gray-400">About</a></li>
          <li><a href="/Login" className="hover:text-gray-400">Login</a></li>
          <li><a href="/register" className="hover:text-gray-400">Register</a></li>
        </ul>
      </div>

      {/* Contact Section */}
      <div className="flex-1 max-w-[40%]">
        <p className="text-sm mb-4">
          <strong className="text-xl font-semibold  ">Office:</strong><br />
          Shed No.7 , Shyam Industrial Estate GIDC Industrial Area, Odhav , Ahmedabad, Gujarat -382415.
        </p>
        <p className="text-sm mb-2">
          <strong className="text-xl font-semibold">Contact No. :</strong> 9327058504
        </p>
        <p className="text-sm">
          <strong className="text-xl font-semibold">Email:</strong> skichariz@gmail.com
        </p>
      </div> </footer>
  );
};

export default Footer;