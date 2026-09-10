import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { CheckCircle2 } from "lucide-react";

export default function OrderStatusChart({ orderStatusData }) {
  const COLORS = {
    Completed: "#10b981", // Emerald
    Pending: "#f59e0b",   // Amber
    Cancelled: "#ef4444", // Rose
  };

  const formattedData = (orderStatusData || []).map((item) => ({
    name: item.status,
    value: item.count,
  }));

  const totalOrdersCount = formattedData.reduce((acc, curr) => acc + curr.value, 0);

  // Filter non-zero items for the pie slices to avoid overlapping callout lines
  const pieData = formattedData.filter((d) => d.value > 0);

  return (
    <section className="chart-card">
      <div className="card-header">
        <div className="card-title-group">
          <CheckCircle2 size={20} className="card-icon green" />
          <h2>Order Status Breakdown</h2>
        </div>
      </div>

      {totalOrdersCount > 0 ? (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="45%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.name] || "#64748b"}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [value, "Orders"]}
              contentStyle={{
                backgroundColor: "#ffffff",
                borderColor: "#cbd5e1",
                borderRadius: "8px",
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => {
                const item = formattedData.find((d) => d.name === value);
                return `${value} (${item ? item.value : 0})`;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="empty-state">
          <p>No order status data available for the selected filters.</p>
        </div>
      )}
    </section>
  );
}
