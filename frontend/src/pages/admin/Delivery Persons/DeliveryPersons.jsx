import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api.js";
import RegisterDeliveryPersonModal from "./RegisterDeliveryPersonModal.jsx";
import EditDeliveryPersonModal from "./EditDeliveryPersonModal.jsx";

export default function DeliveryPersons() {
  const navigate = useNavigate();

  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    status: "",
    isActive: "",
  });

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [editUser, setEditUser] = useState(null);

  /* ================================
     FETCH DELIVERY PERSONS
  ================================= */
  const fetchDeliveryPersons = async () => {
    setLoading(true);
    try {
      const res = await api.get("/delivery-persons", {
        params: {
          page,
          limit,
          ...(filters.status && { status: filters.status }),
          ...(filters.isActive !== "" && { isActive: filters.isActive }),
        },
      });

      setDeliveryPersons(res.data.data.deliveryPersons);
      setTotal(res.data.data.total);
    } catch (err) {
      console.error("Failed to fetch delivery persons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveryPersons();
  }, [page, filters]);

  /* ================================
     SEARCH (FRONTEND)
  ================================= */
  const filteredDeliveryPersons = useMemo(() => {
    if (!search) return deliveryPersons;

    return deliveryPersons.filter((dp) => {
      const name = dp.userID?.fullname?.toLowerCase() || "";
      const phone = dp.userID?.phone || "";

      return (
        name.includes(search.toLowerCase()) ||
        phone.includes(search)
      );
    });
  }, [deliveryPersons, search]);

  const totalPages = Math.ceil(total / limit);

  /* ================================
     TOGGLE ACTIVE / INACTIVE
  ================================= */
  const toggleActiveStatus = async (id, currentValue, status) => {
    if (
      status === "ON_DELIVERY" &&
      !window.confirm(
        "This delivery person is currently on delivery. Are you sure?"
      )
    ) {
      return;
    }

    try {
      await api.patch(`/delivery-persons/${id}`, {
        isActive: !currentValue,
      });

      setDeliveryPersons((prev) =>
        prev.map((dp) =>
          dp._id === id
            ? { ...dp, isActive: !currentValue }
            : dp
        )
      );
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to update status"
      );
    }
  };

  /* ================================
     REMOVE FROM DELIVERY ROLE
  ================================= */
  const removeDeliveryPerson = async (dp) => {
    if (dp.status === "ON_DELIVERY") {
      alert("Cannot remove while delivery is in progress");
      return;
    }

    if (
      !window.confirm(
        "This will remove the user from delivery role. Continue?"
      )
    ) {
      return;
    }

    try {
      await api.delete(`/delivery-persons/${dp._id}`);

      setDeliveryPersons((prev) =>
        prev.filter((item) => item._id !== dp._id)
      );
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to remove delivery person"
      );
    }
  };

  return (
    <div className="p-6">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">
          Delivery Persons
        </h1>

        <div className="flex gap-3">
          <button
            onClick={() =>
              navigate("/dashboard/delivery-persons/not-activated")
            }
            className="border px-4 py-2 rounded"
          > 
            Pending Activations
          </button>

          <button
            onClick={() => setShowRegisterModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Register Delivery Person
          </button>
        </div>
      </div>

      {/* ================= FILTERS ================= */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-64"
        />

        <select
          className="border px-3 py-2 rounded"
          value={filters.status}
          onChange={(e) =>
            setFilters({ ...filters, status: e.target.value })
          }
        >
          <option value="">All Status</option>
          <option value="AVAILABLE">Available</option>
          <option value="ON_DELIVERY">On Delivery</option>
          <option value="OFFLINE">Offline</option>
        </select>

        <select
          className="border px-3 py-2 rounded"
          value={filters.isActive}
          onChange={(e) =>
            setFilters({ ...filters, isActive: e.target.value })
          }
        >
          <option value="">All</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        <button
          onClick={() => {
            setFilters({ status: "", isActive: "" });
            setSearch("");
            setPage(1);
          }}
          className="border px-3 py-2 rounded"
        >
          Clear
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white border rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-center">
                Active
              </th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : filteredDeliveryPersons.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6">
                  No delivery persons found
                </td>
              </tr>
            ) : (
              filteredDeliveryPersons.map((dp) => (
                <tr key={dp._id} className="border-t">
                  <td className="px-4 py-3">
                    {dp.userID?.fullname}
                  </td>

                  <td className="px-4 py-3">
                    {dp.userID?.phone}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        dp.status === "AVAILABLE"
                          ? "bg-green-100 text-green-700"
                          : dp.status === "ON_DELIVERY"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {dp.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={dp.isActive}
                      onChange={() =>
                        toggleActiveStatus(
                          dp._id,
                          dp.isActive,
                          dp.status
                        )
                      }
                      className="h-4 w-4"
                    />
                  </td>

                  <td className="px-4 py-3 space-x-3">
                    <button
                      onClick={() =>
                        setEditUser(dp.userID)
                      }
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        removeDeliveryPerson(dp)
                      }
                      className="text-red-600 hover:underline text-sm"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
      {totalPages > 1 && (
        <div className="flex justify-end gap-2 mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="border px-3 py-1 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="px-3 py-1">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="border px-3 py-1 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* ================= MODALS ================= */}
      {showRegisterModal && (
        <RegisterDeliveryPersonModal
          onClose={() => setShowRegisterModal(false)}
          onSuccess={fetchDeliveryPersons}
        />
      )}

      {editUser && (
        <EditDeliveryPersonModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onSuccess={fetchDeliveryPersons}
        />
      )}
    </div>
  );
}
