import { NavLink, Outlet } from "react-router-dom";
import { useEffect , useState} from "react";
import api from "../services/api";
export default function Profile() {

  const [isWholesaleUser, setIsWholesaleUser] = useState(false);
  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await api.get("/users/current-user");
        setIsWholesaleUser(Boolean(res.data.data?.gstNumber));
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };
    checkUser();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-6">
      <h1 className="text-2xl font-semibold mb-6">My Profile</h1>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64">
          <div className="sticky top-6 bg-white border rounded-lg p-4">
            <nav className="space-y-2">
              <NavLink
                to="/profile"
                end
                className={({ isActive }) =>
                  `block px-4 py-2 rounded ${isActive
                    ? "bg-orange-100 text-orange-600"
                    : "hover:bg-gray-100"
                  }`
                }
              >
                Account Info
              </NavLink>

              <NavLink
                to="/profile/addresses"
                className={({ isActive }) =>
                  `block px-4 py-2 rounded ${isActive
                    ? "bg-orange-100 text-orange-600"
                    : "hover:bg-gray-100"
                  }`
                }
              >
                Manage Addresses
              </NavLink>

              <NavLink
                to="/profile/myorders"
                className={({ isActive }) =>
                  `block px-4 py-2 rounded ${isActive
                    ? "bg-orange-100 text-orange-600"
                    : "hover:bg-gray-100"
                  }`
                }
              >
                My Orders
              </NavLink>
              <NavLink
                to="/profile/returns"
                className={({ isActive }) =>
                  `block px-4 py-2 rounded ${isActive
                    ? "bg-orange-100 text-orange-600"
                    : "hover:bg-gray-100"
                  }`
                }
              >
                My Returns
              </NavLink>
              {isWholesaleUser && (
                <NavLink
                  to="/profile/quotations"
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded ${isActive
                      ? "bg-orange-100 text-orange-600"
                      : "hover:bg-gray-100"
                    }`
                  }
                >
                  My Quotations
                </NavLink>
              )}

            </nav>
          </div>
        </div>

        {/* Right content */}
        <div className="flex-1 bg-white border rounded-lg p-6 min-h-[400px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
