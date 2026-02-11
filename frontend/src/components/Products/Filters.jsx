import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../services/api";

const Filters = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState({});

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 🔥 MULTIPLE subcategories from URL
  const activeSubcategories = searchParams.get("subcategory")
    ? searchParams.get("subcategory").split(",")
    : [];

  /* ============================
     Fetch Categories
     ============================ */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    fetchCategories();
  }, []);

  /* ============================
     Fetch Subcategories (once per category)
     ============================ */
  useEffect(() => {
    const fetchAllSubCategories = async () => {
      for (const cat of categories) {
        if (!subCategories[cat._id]) {
          try {
            const res = await api.get(
              `/categories/${cat._id}/subcategories`
            );

            setSubCategories((prev) => ({
              ...prev,
              [cat._id]: res.data.data || [],
            }));
          } catch (err) {
            console.error("Failed to fetch subcategories", err);
          }
        }
      }
    };

    if (categories.length) fetchAllSubCategories();
  }, [categories]);

  /* ============================
     Handle Subcategory Toggle
     ============================ */
  const handleSubcategoryClick = (subId) => {
    let updatedSubcategories = [...activeSubcategories];

    if (updatedSubcategories.includes(subId)) {
      // ❌ Remove
      updatedSubcategories = updatedSubcategories.filter(
        (id) => id !== subId
      );
    } else {
      // ✅ Add
      updatedSubcategories.push(subId);
    }

    if (updatedSubcategories.length === 0) {
      navigate("/products");
    } else {
      navigate(
        `/products?subcategory=${updatedSubcategories.join(",")}`
      );
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-6">Filters by</h3>

      {/* CATEGORY LIST */}
      <div className="space-y-6">
        {categories.map((cat) => (
          <div key={cat._id}>
            <h4 className="text-sm font-semibold uppercase tracking-wide mb-4">
              {cat.name}
            </h4>

            <div className="space-y-3">
              {subCategories[cat._id]?.map((sub) => (
                <label
                  key={sub._id}
                  className="flex items-center gap-4 text-[15px] cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={activeSubcategories.includes(sub._id)}
                    onChange={() => handleSubcategoryClick(sub._id)}
                    className="w-5 h-5 accent-black cursor-pointer"
                  />

                  <span className="leading-none">
                    {sub.name}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Filters;
