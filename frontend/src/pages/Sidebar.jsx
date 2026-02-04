import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Layers,
  Users,
  ShoppingCart,
  FileText,
  Wallet,
  MessageCircle,
  Settings,
  ChevronDown,
} from "lucide-react";
import navbarLogo from "../assets/images/navbarLogo.PNG";

export default function Sidebar() {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (title) => {
    setOpenMenu(openMenu === title ? null : title);
  };

  const isActive = (path) => location.pathname === path;

  const sidebarConfig = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      title: "Product Management",
      icon: Package,
      children: [
        { label: "Products", path: "/dashboard/products" },
        { label: "Categories", path: "/dashboard/categories" },
        { label: "Sub-Categories", path: "/dashboard/subcategories" },
        { label: "Offers & Discounts", path: "/dashboard/offers" },
      ],
    },
    {
      title: "Inventory & Production",
      icon: Layers,
      children: [
        { label: "Stock", path: "/dashboard/stock" },
        { label: "Raw Materials", path: "/dashboard/raw-materials" },
        { label: "Unit Of Measurements", path: "/dashboard/unit-of-measurements" },
        { label: "Production", path: "/dashboard/productions" },
        { label: "Purchases", path: "/dashboard/purchases" },
        { label: "Purchase Returns", path: "/dashboard/purchase-returns" },
      ],
    },
    {
      title: "Users & Partners",
      icon: Users,
      children: [
        { label: "Customers", path: "/dashboard/users" },
        { label: "Vendors", path: "/dashboard/vendors" },
        { label: "Delivery Persons", path: "/dashboard/delivery-persons" },
      ],
    },
    {
      title: "Order Management",
      icon: ShoppingCart,
      children: [
        { label: "Orders", path: "/dashboard/orders" },
        { label: "Returns", path: "/dashboard/returns" },
        { label: "Cancellations", path: "/dashboard/cancellations" },
      ],
    },
    {
      title: "Quotations",
      icon: FileText,
      children: [{ label: "Quotations", path: "/dashboard/quotations" }],
    },
    {
      title: "Finance",
      icon: Wallet,
      children: [
        { label: "Payments", path: "/dashboard/payments" },
        { label: "Reports", path: "/dashboard/report" },
      ],
    },
    {
      title: "Communication",
      icon: MessageCircle,
      children: [
        { label: "Feedback & Ratings", path: "/dashboard/feedback" },
        { label: "Notifications", path: "/dashboard/notifications" },
        { label: "Inquiries", path: "/dashboard/inquiries" },
      ],
    },
    {
      title: "Settings",
      icon: Settings,
      children: [{ label: "Company Details", path: "/dashboard/company-details" }],
    },
  ];

  return (
    <aside className="w-[280px] h-screen fixed bg-[#f7f7f7] text-white p-6 overflow-y-scroll">      {/* Header */}
      <div className="flex items-center gap-3 mb-8 text-black">
        <img src={navbarLogo} className="w-10 h-10 bg-white rounded p-1" />
        <h2 className="text-[30px] text-gray-900 font-extrabold">FURNIOS</h2>
      </div>

      {/* Sidebar Menu */}
      <nav className="space-y-2">
        {sidebarConfig.map((item) => {
          const Icon = item.icon;
          const isDropdown = item.children;
          const isOpen = openMenu === item.title;

          if (!isDropdown) {
            return (
              <Link
                key={item.title}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-black ${isActive(item.path) ? "bg-white/25" : "hover:bg-white/15"
                  }`}
              >
                <Icon size={20} />
                {item.title}
              </Link>
            );
          }

          return (
            <div key={item.title}>
              <button
                onClick={() => toggleMenu(item.title)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-white/15 text-black"
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} />
                  {item.title}
                </div>
                <ChevronDown
                  size={18}
                  className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              <div
                className={`ml-8 mt-1 space-y-1 overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
              >
                {item.children.map((child) => (
                  <Link
                    key={child.path}
                    to={child.path}
                    className={`block px-3 py-2 text-sm text-black rounded ${isActive(child.path) ? "bg-white/25" : "hover:bg-white/15"
                      }`}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>

            </div>
          );
        })}
      </nav>
    </aside>
  );
}