import { useEffect, useState, useMemo } from "react";
import api from "../../services/api";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = [
  "#7C3AED",
  "#3B82F6",
  "#8B5CF6",
  "#60A5FA",
  "#34D399",
  "#F59E0B",
  "#FB7185",
  "#22C55E",
  "#10B981",
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [
          statsRes,
          salesRes,
          categoryRes,
          subCategoryRes,
        ] = await Promise.all([
          api.get("/dashboard/stats"),
          api.get("/dashboard/revenue-trend"),
          api.get("/dashboard/category-sales"),
          api.get("/dashboard/subcategory-sales"),
        ]);

        setStats(statsRes.data.data);
        setSalesData(salesRes.data.data);
        setCategoryData(categoryRes.data.data);
        setSubCategoryData(subCategoryRes.data.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const totalCategoryValue = useMemo(
    () => categoryData.reduce((sum, c) => sum + c.value, 0),
    [categoryData]
  );

  const totalSubCategoryValue = useMemo(
    () => subCategoryData.reduce((sum, c) => sum + c.value, 0),
    [subCategoryData]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border hover:shadow-sm transition">
          <p className="text-sm text-gray-500">Total customers</p>
          <p className="text-2xl font-semibold mt-1">
            {stats.totalCustomers}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border hover:shadow-sm transition">
          <p className="text-sm text-gray-500">Total revenue</p>
          <p className="text-2xl font-semibold mt-1">
            ₹{stats.totalRevenue.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border hover:shadow-sm transition">
          <p className="text-sm text-gray-500">Total orders</p>
          <p className="text-2xl font-semibold mt-1">
            {stats.totalOrders}
          </p>
        </div>
      </div>

      {/* Revenue Trend */}
      <div className="bg-white p-6 rounded-xl border">
        <h2 className="font-semibold mb-4">Revenue trend</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="revenue"
                fill="#F1C338"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Sales */}
        <div className="bg-white p-6 rounded-xl border">
          <h2 className="font-semibold mb-4">
            Sales by product category
          </h2>

          <div className="flex items-center gap-6">
            <PieChart width={220} height={220}>
              <Pie
                data={categoryData}
                dataKey="value"
                innerRadius={60}
                outerRadius={100}
              >
                {categoryData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={COLORS[i % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>

            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {categoryData.map((c, i) => (
                <div key={i} className="flex justify-between">
                  <span className="capitalize">{c.name}</span>
                  <span className="text-gray-500">
                    {((c.value / totalCategoryValue) * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sub-Category Sales */}
        {/* Sub-Category Sales (Pie Chart) */}
        <div className="bg-white p-6 rounded-xl border">
          <h2 className="font-semibold mb-4 text-gray-800">
            Sales by sub category
          </h2>

          <div className="flex items-center gap-6">
            <PieChart width={220} height={220}>
              <Pie
                data={subCategoryData}
                dataKey="value"
                innerRadius={60}
                outerRadius={100}
              >
                {subCategoryData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={COLORS[i % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>

            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {subCategoryData.map((s, i) => {
                const percent =
                  totalSubCategoryValue > 0
                    ? ((s.value / totalSubCategoryValue) * 100).toFixed(1)
                    : 0;

                return (
                  <div
                    key={i}
                    className="flex justify-between text-gray-700"
                  >
                    <span className="capitalize">{s.name}</span>
                    <span className="text-gray-500">{percent}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
