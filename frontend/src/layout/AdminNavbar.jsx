import { Bell, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import navbarLogo from "../assets/images/navbarLogo.PNG";

export default function AdminNavbar({ title = "Dashboard" }) {
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  /* =============================
     FETCH UNREAD NOTIFICATIONS
     ============================= */
  const fetchUnreadCount = async () => {
    try {
      const res = await api.get("/notifications/unread-count");
      setUnreadCount(res.data?.data?.count || 0);
    } catch (err) {
      console.error("Failed to fetch unread count", err);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  /* =============================
     LOGOUT
     ============================= */
  const handleLogout = async () => {
    try {
      // optional backend logout
      await api.post("/users/logout");
    } catch (err) {
      console.warn("Logout API failed, clearing tokens anyway");
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/login");
    }
  };

  return (
    <header className="sticky top-0 z-40 h-16 w-full border-b bg-white">
      <div className="flex h-full items-center justify-between px-6">

        {/* ================= LEFT ================= */}
        <div className="flex items-center gap-3">
          <img
            src={navbarLogo}
            alt="FurniOS"
            className="h-7 w-7 object-contain"
          />
          <span className="text-lg font-semibold tracking-tight text-gray-900">
            FurniOS Admin
          </span>
        </div>

        {/* ================= CENTER ================= */}
        <div className="flex-1 text-center">
          <h1 className="text-sm font-medium text-gray-700">
            {title}
          </h1>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="relative flex items-center gap-4">

          {/* Notifications */}
          <button
            onClick={() => navigate("/dashboard/notifications")}
            className="relative rounded-md p-2 text-gray-600 hover:bg-gray-100"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Profile */}
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-gray-100"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
              A
            </div>
            <ChevronDown size={16} className="text-gray-600" />
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 top-12 w-48 rounded-md border bg-white shadow-sm">
              <div className="border-b px-4 py-2">
                <p className="text-sm font-medium text-gray-800">
                  Admin User
                </p>
                <p className="text-xs text-gray-500">
                  admin@furnios.com
                </p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => navigate("/dashboard/profile")}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                >
                  Profile
                </button>

  

                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </header>
  );
}
