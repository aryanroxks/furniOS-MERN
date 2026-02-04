import { useEffect, useState } from "react";
import api from "../../../services/api";
import RawMaterialsTable from "./RawMaterialsTable";
import RawMaterialFormModal from "./RawMaterialFormModal";
import RawMaterialViewModal from "./RawMaterialViewModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

export default function RawMaterialsPage() {
  const [rawMaterials, setRawMaterials] = useState([]);
  const [uoms, setUoms] = useState([]);

  const [search, setSearch] = useState("");
  const [uomFilter, setUomFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");

  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [viewId, setViewId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [selected, setSelected] = useState(null);

  // 🔹 Fetch UOMs (MANDATORY)
  const fetchUoms = async () => {
    const res = await api.get("/uoms");
    setUoms(res.data.data);
  };

  // 🔹 Fetch Raw Materials
  const fetchRawMaterials = async () => {
    try {
      setLoading(true);
      const res = await api.get("/raw-materials", {
        params: {
          search,
          uomId: uomFilter || undefined,
          inStock: stockFilter || undefined
        }
      });
      setRawMaterials(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUoms();
    fetchRawMaterials();
  }, []);

  useEffect(() => {
    fetchRawMaterials();
  }, [search, uomFilter, stockFilter]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Raw Materials</h1>
          <p className="text-gray-500">Manage raw material master data</p>
        </div>

        <button
          onClick={() => {
            setSelected(null);
            setFormOpen(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          + Add Raw Material
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <input
          className="border px-4 py-2 rounded-lg w-full"
          placeholder="Search raw material..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border px-4 py-2 rounded-lg"
          value={uomFilter}
          onChange={(e) => setUomFilter(e.target.value)}
        >
          <option value="">All UOMs</option>
          {uoms.map(u => (
            <option key={u._id} value={u._id}>{u.name}</option>
          ))}
        </select>

        <select
          className="border px-4 py-2 rounded-lg"
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="true">In Stock</option>
          <option value="false">Out of Stock</option>
        </select>
      </div>

      {/* Table */}
      <RawMaterialsTable
        data={rawMaterials}
        loading={loading}
        onEdit={(rm) => {
          setSelected(rm);
          setFormOpen(true);
        }}
        onView={(id) => setViewId(id)}
        onDelete={(id) => setDeleteId(id)}
      />

      {/* Modals */}
      {formOpen && (
        <RawMaterialFormModal
          rawMaterial={selected}
          uoms={uoms}
          onClose={() => setFormOpen(false)}
          onSuccess={fetchRawMaterials}
        />
      )}

      {viewId && (
        <RawMaterialViewModal
          id={viewId}
          onClose={() => setViewId(null)}
        />
      )}

      {deleteId && (
        <DeleteConfirmModal
          onCancel={() => setDeleteId(null)}
          onConfirm={async () => {
            await api.delete(`/raw-materials/${deleteId}`);
            setDeleteId(null);
            fetchRawMaterials();
          }}
        />
      )}
    </div>
  );
}
