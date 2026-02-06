import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";

const statusColor = {
  open: "bg-gray-200 text-gray-800",
  in_progress: "bg-blue-100 text-blue-700",
  resolved: "bg-green-100 text-green-700",
  closed: "bg-gray-300 text-gray-700",
};

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const res = await api.get("/inquiries/admin");
      setInquiries(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch inquiries", err);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this inquiry?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/inquiries/admin/${id}`);
      fetchInquiries();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">
        Inquiries
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left">User</th>
              <th className="border px-3 py-2">Type</th>
              <th className="border px-3 py-2 text-left">Subject</th>
              <th className="border px-3 py-2">Status</th>
              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {inquiries.map((inq) => (
              <tr key={inq._id} className="hover:bg-gray-50">
                <td className="border px-3 py-2">
                  <div className="font-medium">
                    {inq.userID?.username}
                  </div>
                  <div className="text-xs text-gray-500">
                    {inq.userID?.email}
                  </div>
                </td>

                <td className="border px-3 py-2 text-center capitalize">
                  {inq.type}
                </td>

                <td className="border px-3 py-2">
                  {inq.subject}
                </td>

                <td className="border px-3 py-2 text-center">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${statusColor[inq.status]}`}
                  >
                    {inq.status.replace("_", " ")}
                  </span>
                </td>

                <td className="border px-3 py-2 text-center space-x-2">
                  <button
                    onClick={() =>
                      navigate(`/dashboard/inquiries/${inq._id}`)
                    }
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </button>

                  <button
                    onClick={() => handleDelete(inq._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {inquiries.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-4 text-gray-500"
                >
                  No inquiries found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
