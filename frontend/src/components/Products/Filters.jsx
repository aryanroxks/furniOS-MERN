import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../services/api";

const Filters = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState({});

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeSubcategory = searchParams.get("subcategory");

  /* ============================
     Fetch Categories
     ============================ */
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await api.get("/categories");
      setCategories(res.data.data || []);
    };

    fetchCategories();
  }, []);

  /* ============================
     Fetch Subcategories (once)
     ============================ */
  useEffect(() => {
    const fetchAllSubCategories = async () => {
      for (const cat of categories) {
        if (!subCategories[cat._id]) {
          const res = await api.get(
            `/categories/${cat._id}/subcategories`
          );

          setSubCategories((prev) => ({
            ...prev,
            [cat._id]: res.data.data || [],
          }));
        }
      }
    };

    if (categories.length) fetchAllSubCategories();
  }, [categories]);

const handleSubcategoryClick = (subId) => {
  if (activeSubcategory === subId) {
    // UNCHECK → remove filter
    navigate("/products");
  } else {
    // CHECK → apply filter
    navigate(`/products?subcategory=${subId}`);
  }
};


  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-6">Filters by</h3>

      {/* CATEGORY */}
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
                    checked={activeSubcategory === sub._id}
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
