import { useEffect, useState } from "react";
import api from "../../../services/api.js";
import VendorsTable from "./VendorsTable.jsx";
import VendorFormModal from "./VendorsFormModal.jsx";

export default function VendorsPage() {
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const res = await api.get("/vendors", {
        params: {
          search,
          isActive: status || undefined
        }
      });
      setVendors(res.data.data);
    } catch (err) {
      console.error("Fetch vendors failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [search, status]);

const downloadVendorsPDF = () => {
  const params = new URLSearchParams({
    ...(search && { search }),
    ...(status !== "" && { isActive: status }),
  });

  const url = `${import.meta.env.VITE_API_BASE_URL}/vendors/pdf?${params.toString()}`;
  window.open(url, "_blank", "noopener,noreferrer");
};



  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Vendors</h1>
          <p className="text-gray-500">Manage your vendors</p>
        </div>

        <button
          onClick={() => {
            setSelectedVendor(null);
            setOpenForm(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          + Add Vendor
        </button>

        <button
          onClick={downloadVendorsPDF}
          disabled={vendors.length === 0}
          className="border px-4 py-2 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Download PDF
        </button>

      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <input
          className="border rounded-lg px-4 py-2 w-full"
          placeholder="Search vendors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border rounded-lg px-4 py-2"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <VendorsTable
        vendors={vendors}
        loading={loading}
        onEdit={(vendor) => {
          setSelectedVendor(vendor);
          setOpenForm(true);
        }}
        onRefresh={fetchVendors}
      />

      {/* Modal */}
      {openForm && (
        <VendorFormModal
          vendor={selectedVendor}
          onClose={() => setOpenForm(false)}
          onSuccess={fetchVendors}
        />
      )}
    </div>
  );
}
