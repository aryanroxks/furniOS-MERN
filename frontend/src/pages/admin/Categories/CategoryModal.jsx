import api from "../../../services/api.js";
import { useState } from "react";

export default function CategoryModal({ modal, close, refresh }) {
  const { type, data } = modal;

  const [name, setName] = useState(data?.name || "");
  const [description, setDescription] = useState(data?.description || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);

      if (type === "add") {
        await api.post("/categories/create-category", {
          name,
          description,
        });
      }

      if (type === "edit") {
        await api.patch(
          `/categories/update-category/${data._id}`,
          {
            name,
            description,
          }
        );
      }

      refresh();
      close();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);

      await api.delete(
        `/categories/delete-category/${data._id}`
      );

      refresh();
      close();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold capitalize">
          {type} Category
        </h2>

        {type === "view" && (
          <div className="space-y-2 text-sm">
            <p><b>Name:</b> {data.name}</p>
            <p><b>Description:</b> {data.description || "-"}</p>
          </div>
        )}

        {(type === "add" || type === "edit") && (
          <>
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Category Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              className="w-full border rounded px-3 py-2"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </>
        )}

        {type === "delete" && (
          <p>
            Are you sure you want to delete <b>{data.name}</b>?
          </p>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <button onClick={close} className="border px-4 py-2 rounded">
            Cancel
          </button>

          {type === "delete" ? (
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              Delete
            </button>
          ) : type !== "view" ? (
            <button
              onClick={handleSave}
              className="bg-indigo-600 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              Save
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
