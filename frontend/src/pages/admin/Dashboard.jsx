import {
  BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

const stats = [
  { label: "Total customers", value: "567,899", change: "+2.5%", positive: true },
  { label: "Total revenue", value: "$3,465 M", change: "+0.5%", positive: true },
  { label: "Total orders", value: "1,136 M", change: "-0.2%", positive: false },
  { label: "Total returns", value: "1,789", change: "+0.12%", positive: true }
];

const salesData = [
  { day: "1 Jul", revenue: 38, margin: 27 },
  { day: "2 Jul", revenue: 45, margin: 30 },
  { day: "3 Jul", revenue: 56, margin: 21 },
  { day: "4 Jul", revenue: 43, margin: 32 },
  { day: "5 Jul", revenue: 52, margin: 48 },
  { day: "6 Jul", revenue: 58, margin: 53 },
  { day: "7 Jul", revenue: 37, margin: 14 },
  { day: "8 Jul", revenue: 42, margin: 33 },
  { day: "9 Jul", revenue: 31, margin: 24 },
  { day: "10 Jul", revenue: 47, margin: 44 },
  { day: "11 Jul", revenue: 45, margin: 32 },
  { day: "12 Jul", revenue: 54, margin: 57 }
];

const categoryData = [
  { name: "Living room", value: 25 },
  { name: "Kids", value: 17 },
  { name: "Office", value: 13 },
  { name: "Bedroom", value: 12 },
  { name: "Kitchen", value: 9 },
  { name: "Bathroom", value: 8 },
  { name: "Dining room", value: 6 },
  { name: "Decor", value: 5 },
  { name: "Lighting", value: 3 },
  { name: "Outdoor", value: 2 }
];

const COLORS = [
  "#7C3AED", "#3B82F6", "#8B5CF6", "#60A5FA", "#34D399",
  "#F472B6", "#FB7185", "#F59E0B", "#22C55E", "#10B981"
];

export default function Dashboard() {
  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="text-xl font-semibold mt-1">{s.value}</p>
            <p className={`text-sm mt-1 ${s.positive ? "text-green-600" : "text-red-500"}`}>
              {s.change}
            </p>
          </div>
        ))}
        <div className="border-dashed border-2 rounded-xl flex items-center justify-center text-gray-400">
          + Add data
        </div>
      </div>

      {/* Product sales */}
      <div className="bg-white p-6 rounded-xl border">
        <h2 className="font-semibold mb-4">Product sales</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData} barGap={6}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="margin" fill="#3B82F6" radius={[4,4,0,0]} />
              <Bar dataKey="revenue" fill="#F59E0B" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-white p-6 rounded-xl border">
          <h2 className="font-semibold mb-4">Sales by product category</h2>
          <div className="flex items-center gap-6">
            <PieChart width={220} height={220}>
              <Pie
                data={categoryData}
                dataKey="value"
                innerRadius={60}
                outerRadius={100}
              >
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>

            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {categoryData.map((c, i) => (
                <div key={i} className="flex justify-between">
                  <span>{c.name}</span>
                  <span className="text-gray-500">{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border">
          <h2 className="font-semibold mb-4">Sales by countries</h2>
          <ul className="space-y-2 text-sm">
            {["Poland","Austria","Spain","Romania","France","Italy","Germany","Ukraine"].map((c,i)=>(
              <li key={i} className="flex justify-between">
                <span>{c}</span>
                <span className="text-gray-500">{[19,15,13,12,11,11,10,9][i]}%</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
