import { useEffect, useState } from "react";
import api from "../../services/api";   
import { toast } from "react-hot-toast";
import DeleteConfirmModal from "../../components/common/DeleteConfirmModal";

export default function AdminUOM() {
  const [uoms, setUoms] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const [editingUOM, setEditingUOM] = useState(null);
  const [editName, setEditName] = useState("");

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ---------------- FETCH ----------------
  const fetchUOMs = async () => {
    try {
      const res = await api.get("/uoms");
      setUoms(res.data.data);
    } catch (err) {
      toast.error("Failed to load UOMs");
    }
  };

  useEffect(() => {
    fetchUOMs();
  }, []);

  // ---------------- CREATE ----------------
  const handleCreate = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      return toast.error("UOM name is required");
    }

    try {
      setLoading(true);
      await api.post("/uoms", {
        name: name.trim(),
      });

      toast.success("UOM created");
      setName("");
      fetchUOMs();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create UOM");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- UPDATE ----------------
  const handleUpdate = async () => {
    if (!editName.trim()) {
      return toast.error("UOM name is required");
    }

    try {
      await api.patch(`/uoms/${editingUOM._id}`, {
        name: editName.trim(),
      });

      toast.success("UOM updated");
      setEditingUOM(null);
      fetchUOMs();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  // ---------------- DELETE ----------------
  const handleDelete = async () => {
    try {
      setDeleting(true);
      await api.delete(`/uoms/${deleteId}`);
      toast.success("UOM deleted");
      setDeleteId(null);
      fetchUOMs();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">
        Units of Measurement (UOM)
      </h1>

      {/* CREATE */}
      <div className="flex items-center justify-between mb-6">
        <form onSubmit={handleCreate} className="flex gap-3">
          <input
            type="text"
            placeholder="Enter UOM (e.g. KG)"
            value={name}
            onChange={(e) => setName(e.target.value.toUpperCase())}
            className="border px-3 py-2 rounded-md w-60 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            + Add UOM
          </button>
        </form>
      </div>

      {/* LIST */}
      <div className="bg-white border rounded-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                UOM
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {uoms.map((uom) => (
              <tr key={uom._id} className="border-t">
                <td className="px-4 py-3">{uom.name}</td>
                <td className="px-4 py-3 text-right space-x-3">
                  <button
                    onClick={() => {
                      setEditingUOM(uom);
                      setEditName(uom.name);
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => setDeleteId(uom._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {uoms.length === 0 && (
              <tr>
                <td
                  colSpan="2"
                  className="px-4 py-6 text-center text-gray-500"
                >
                  No UOMs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
      {editingUOM && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <h2 className="text-lg font-semibold mb-4">Edit UOM</h2>

            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value.toUpperCase())}
              className="border px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mb-5"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditingUOM(null)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteId && (
        <DeleteConfirmModal
          title="Delete UOM?"
          message="This UOM may be used by raw materials. This action cannot be undone."
          loading={deleting}
          onCancel={() => setDeleteId(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
