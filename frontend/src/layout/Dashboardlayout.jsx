import Sidebar from "../pages/Sidebar.jsx";
import AdminNavbar from "./AdminNavbar.jsx";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* ===== Sidebar ===== */}
      <aside className="fixed left-0 top-0 h-screen w-[280px]">
        <Sidebar />
      </aside>

      {/* ===== Right Section ===== */}
      <div className="ml-[280px] flex flex-1 flex-col">

        {/* Navbar */}
        <AdminNavbar />

        {/* Page Content */}

        


        <main className="flex-1 p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
