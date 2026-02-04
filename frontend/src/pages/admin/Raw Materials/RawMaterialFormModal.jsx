import { useEffect, useState } from "react";
import api from "../../../services/api";

export default function RawMaterialFormModal({
  rawMaterial,
  uoms,
  onClose,
  onSuccess
}) {
  const [form, setForm] = useState({ name: "", uomId: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (rawMaterial) {
      setForm({
        name: rawMaterial.name,
        uomId: rawMaterial.uomId?._id
      });
    }
  }, [rawMaterial]);

  const submit = async () => {
    if (!form.name || !form.uomId) {
      alert("Name and UOM are required");
      return;
    }

    try {
      setSaving(true);
      if (rawMaterial) {
        await api.patch(`/raw-materials/${rawMaterial._id}`, form);
      } else {
        await api.post("/raw-materials", form);
      }
      onSuccess();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold">
          {rawMaterial ? "Edit Raw Material" : "Add Raw Material"}
        </h2>

        <input
          className="border px-4 py-2 rounded-lg w-full"
          placeholder="Raw material name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <select
          className="border px-4 py-2 rounded-lg w-full"
          value={form.uomId}
          onChange={e => setForm({ ...form, uomId: e.target.value })}
        >
          <option value="">Select UOM</option>
          {uoms.map(u => (
            <option key={u._id} value={u._id}>{u.name}</option>
          ))}
        </select>

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button
            disabled={saving}
            onClick={submit}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
