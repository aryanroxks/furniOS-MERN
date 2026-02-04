import React from 'react';
import { Link } from 'react-router-dom';
import Chair from '../assets/images/Chair.webp';
import Sofa from '../assets/images/Sofa.jpg';
import reclinar from '../assets/images/Reclinar.jpg';
// import Footer from '../layout/Footer';
import crafting from '../assets/images/crafting.jpg';
import delivered from '../assets/images/delivered.jpg';
import designers from '../assets/images/designers.jpg';
import Footer from '../layout/Footer';

const HomePage = () => {
  const products = [
    {
      id: 1,
      title: 'Handcrafted Armchair',
      description: 'Experience comfort and style with our artisanal armchair.',
      image: Chair,
    },
    {
      id: 2,
      title: 'Elegant Sofa',
      description: 'Relax in luxury with our premium handcrafted sofa.',
      image: Sofa,
    },
    {
      id: 3,
      title: 'Automatic Recliner',
      description: 'Enjoy unmatched comfort with our modern automatic recliner.',
      image: reclinar,
    },
  ];

  const steps = [
    {
      id: 1,
      title: "Designed with Passion",
      description: "Every piece begins with a vision, sketched by our creative designers.",
      image: designers,
    },
    {
      id: 2,
      title: "Crafted by Artisans",
      description: "Handmade with precision and care, blending tradition with modern techniques.",
      image: crafting,
    },
    {
      id: 3,
      title: "Delivered to Your Home",
      description: "From our workshop to your living room, bringing comfort and elegance.",
      image: delivered,
    },
  ];

  const testimonials = [
    { id: 1, name: "Aarav Patel", feedback: "The sofa is incredibly comfortable and stylish!" },
    { id: 2, name: "Meera Shah", feedback: "Beautiful craftsmanship, worth every penny." },
    { id: 3, name: "Rohan Panchal", feedback: "Delivery was smooth and the recliner is amazing." },
  ];

  return (
    <>
      {/* Hero Banner */}
      <div className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
        <div className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Text Section */}
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-extrabold text-[#5D3A1A] mb-6">
              Luxury, Redefined
            </h1>
            <p className="text-xl text-[#A0522D] mb-8">
              Timeless comfort and elegance with our handcrafted furniture collection.
            </p>
          </div>

          {/* Image Section */}
          <div className="md:w-1/2">
            <img
              src={Chair}
              alt="Luxury Furniture"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="bg-white px-6 py-16">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-[#8B0000] mb-12">
          Our Featured Products
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-auto rounded-md mb-4"
              />
              <h3 className="text-2xl font-semibold text-[#5D3A1A] mb-2">
                {product.title}
              </h3>
              <p className="text-lg text-gray-700 mb-4">{product.description}</p>
            </div>
          ))}
        </div>

      </div>

      {/* Interactive Story Section */}
      <div className="bg-white px-6 py-16">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-[#8B0000] mb-12">
          Our Journey
        </h2>

        <div className="flex flex-col space-y-16 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
            >
              <img
                src={step.image}
                alt={step.title}
                className="w-full md:w-1/2 h-[500px] object-cover rounded-lg shadow-lg"
              />
              <div className="md:w-1/2 text-center md:text-left">
                <h3 className="text-3xl font-semibold text-[#5D3A1A] mb-4">
                  {step.title}
                </h3>
                <p className="text-lg text-gray-700">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-[#FAFAF8] px-6 py-16">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-[#5D3A1A] mb-12">
          What Our Customers Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center"
            >
              <p className="text-lg text-gray-700 mb-4">"{review.feedback}"</p>
              <h3 className="text-xl font-semibold text-[#8B0000]">
                – {review.name}
              </h3>
            </div>
          ))}
        </div>
      </div>


      {/* <Footer /> */}
      <Footer/>
    </>

  );
};

export default HomePage;