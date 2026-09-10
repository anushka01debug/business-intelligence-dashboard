import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { MapPin } from "lucide-react";

export default function RegionChart({ regionRevenue }) {
  const formatCurrency = (val) =>
    `₹${Number(val ?? 0).toLocaleString("en-IN")}`;

  return (
    <section className="chart-card">
      <div className="card-header">
        <div className="card-title-group">
          <MapPin size={20} className="card-icon emerald" />
          <h2>Revenue by Region</h2>
        </div>
      </div>

      {regionRevenue && regionRevenue.length > 0 ? (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={regionRevenue} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="region" stroke="#64748b" fontSize={12} />
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
            <Bar dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="empty-state">
          <p>No region revenue data available for the selected filters.</p>
        </div>
      )}
    </section>
  );
}
