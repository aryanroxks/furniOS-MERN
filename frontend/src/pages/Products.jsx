  import { useEffect, useState } from "react";
  import { useSearchParams } from "react-router-dom";
  import api from "../services/api";
  import ProductCard from "../components/Products/ProductCard";
  import Filters from "../components/Products/Filters";

  const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchParams] = useSearchParams();

    const subcategory = searchParams.get("subcategory");
    const search = searchParams.get("search");

    useEffect(() => {
      const fetchProducts = async () => {
        try {
          setLoading(true);

          const res = await api.get("/products", {
            params: {
              subcategory,
              search,
            },
          });

          setProducts(res.data.data || []);
        } catch (err) {
          console.error("Failed to fetch products", err);
          setProducts([]);
        } finally {
          setLoading(false);
        }
      };

      fetchProducts();
    }, [subcategory, search]); // 🔥 KEY CHANGE

    if (loading) {
      return <p className="p-6">Loading...</p>;
    }

    if (!products.length) {
      return <p className="p-6">No products found.</p>;
    }

    return (
      <div className="w-full px-6 py-6">
        <div className="flex gap-8 items-start max-w-[1400px]">

          {/* LEFT FILTERS */}
          <aside className="w-64 shrink-0 border-r pr-6">
            <Filters />
          </aside>

          {/* RIGHT PRODUCTS */}
          <section className="flex-1">
            <div
              className="
                grid
                gap-6
                justify-start
                place-content-start
                grid-cols-[repeat(auto-fill,minmax(260px,260px))]
              "
            >
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>

        </div>
      </div>
    );
  };

  export default Products;
