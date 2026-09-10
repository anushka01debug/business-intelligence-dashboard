import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Package } from "lucide-react";

export default function CategoryChart({ categoryRevenue }) {
  const formatCurrency = (val) =>
    `₹${Number(val ?? 0).toLocaleString("en-IN")}`;

  return (
    <section className="chart-card">
      <div className="card-header">
        <div className="card-title-group">
          <Package size={20} className="card-icon indigo" />
          <h2>Revenue by Category</h2>
        </div>
      </div>

      {categoryRevenue && categoryRevenue.length > 0 ? (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={categoryRevenue} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="category" stroke="#64748b" fontSize={12} />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value) => [formatCurrency(value), "Revenue"]}
              contentStyle={{
                backgroundColor: "#ffffff",
                borderColor: "#cbd5e1",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="revenue" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="empty-state">
          <p>No category revenue data available for the selected filters.</p>
        </div>
      )}
    </section>
  );
}
