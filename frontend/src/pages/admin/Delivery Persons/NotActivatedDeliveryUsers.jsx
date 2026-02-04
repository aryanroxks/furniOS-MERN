import { useEffect, useState } from "react";
import api from "../../../services/api.js";

export default function NotActivatedDeliveryUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activatingId, setActivatingId] = useState(null);

  /* ================================
     FETCH NOT ACTIVATED USERS
     (delivery_person users without
      DeliveryPerson record)
  ================================= */
  const fetchUsers = async () => {
    setLoading(true);
    try {
      /**
       * ASSUMPTION (common & correct):
       * Backend returns delivery_person users
       * without DeliveryPerson record
       *
       * Example endpoint:
       * GET /users/delivery-persons/not-activated
       *
       * If your endpoint name differs,
       * just change the URL.
       */
      const res = await api.get(
        "/users/delivery-persons/not-activated"
      );

      setUsers(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================================
     ACTIVATE DELIVERY PERSON
  ================================= */
  const activateDeliveryPerson = async (userId) => {
    if (
      !window.confirm(
        "Are you sure you want to activate this user for delivery?"
      )
    ) {
      return;
    }

    try {
      setActivatingId(userId);

      await api.post("/delivery-persons", {
        userID: userId,
      });

      // remove from list after activation
      setUsers((prev) =>
        prev.filter((user) => user._id !== userId)
      );
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to activate delivery person"
      );
    } finally {
      setActivatingId(null);
    }
  };

  return (
    <div className="p-6">
      {/* ================= HEADER ================= */}
      <h1 className="text-2xl font-semibold mb-6">
        Not Activated Delivery Users
      </h1>

      {/* ================= TABLE ================= */}
      <div className="bg-white border rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Registered On</th>
              <th className="px-4 py-3 text-center">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6"
                >
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6"
                >
                  No users pending activation
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="border-t">
                  <td className="px-4 py-3">
                    {user.fullname}
                  </td>

                  <td className="px-4 py-3">
                    {user.email}
                  </td>

                  <td className="px-4 py-3">
                    {user.phone}
                  </td>

                  <td className="px-4 py-3">
                    {new Date(
                      user.createdAt
                    ).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() =>
                        activateDeliveryPerson(user._id)
                      }
                      disabled={activatingId === user._id}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                    >
                      {activatingId === user._id
                        ? "Activating..."
                        : "Activate"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
