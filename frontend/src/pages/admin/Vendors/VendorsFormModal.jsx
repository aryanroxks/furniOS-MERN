import { useEffect, useState } from "react";
import api from "../../../services/api.js";

export default function VendorFormModal({ vendor, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      name: vendor?.name || "",
      email: vendor?.email || "",
      phone: vendor?.phone || "",
      address: vendor?.address || ""
    });
  }, [vendor]);

  const submit = async () => {
    if (!form.name.trim()) {
      alert("Vendor name is required");
      return;
    }

    try {
      setSaving(true);

      if (vendor) {
        await api.patch(`/vendors/${vendor._id}`, form);
      } else {
        await api.post("/vendors", form);
      }

      await onSuccess();
      onClose();
    } catch (err) {
      console.error("Vendor save failed", err);
      alert(err.response?.data?.message || "Failed to save vendor");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold">
          {vendor ? "Edit Vendor" : "Add Vendor"}
        </h2>

        {["name", "email", "phone", "address"].map((field) => (
          <input
            key={field}
            placeholder={field}
            className="border rounded-lg px-4 py-2 w-full"
            value={form[field]}
            onChange={(e) =>
              setForm({ ...form, [field]: e.target.value })
            }
          />
        ))}

        <div className="flex justify-end gap-2 pt-4">
          <button onClick={onClose} className="px-4 py-2">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={saving}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
