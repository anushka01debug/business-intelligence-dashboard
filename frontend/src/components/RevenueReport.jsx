import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Table as TableIcon } from "lucide-react";

export default function RevenueReport({
  revenueData,
  reportType,
  setReportType,
  showTable = true,
}) {
  const xAxisKey =
    reportType === "daily"
      ? "day"
      : reportType === "annual"
      ? "year"
      : "month";

  const formatCurrency = (val) =>
    `₹${Number(val ?? 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

  const tableHeader =
    reportType === "daily"
      ? "Date"
      : reportType === "annual"
      ? "Year"
      : "Month";

  return (
    <section className="chart-card">
      <div className="report-header">
        <div>
          <div className="card-title-group">
            <TrendingUp size={20} className="card-icon blue" />
            <h2>
              {reportType === "daily"
                ? "Daily Revenue Report"
                : reportType === "annual"
                ? "Annual Revenue Report"
                : "Monthly Revenue Report"}
            </h2>
          </div>
          <p>Revenue performance trends over selected timeline</p>
        </div>

        <div className="report-buttons">
          <button
            className={reportType === "daily" ? "active" : ""}
            onClick={() => setReportType("daily")}
          >
            Daily
          </button>
          <button
            className={reportType === "monthly" ? "active" : ""}
            onClick={() => setReportType("monthly")}
          >
            Monthly
          </button>
          <button
            className={reportType === "annual" ? "active" : ""}
            onClick={() => setReportType("annual")}
          >
            Annual
          </button>
        </div>
      </div>

      {revenueData && revenueData.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={revenueData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey={xAxisKey} stroke="#64748b" fontSize={12} />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value) => [formatCurrency(value), "Revenue"]}
                labelFormatter={(label) => `${tableHeader}: ${label}`}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderColor: "#cbd5e1",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 4, fill: "#2563eb" }}
                activeDot={{ r: 6, fill: "#1d4ed8" }}
              />
            </LineChart>
          </ResponsiveContainer>

          {showTable && (
            <div className="synced-table-container">
              <div className="table-subtitle">
                <TableIcon size={16} />
                <h3>{tableHeader} Breakdown Data</h3>
              </div>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{tableHeader}</th>
                      <th className="text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {revenueData.map((item, idx) => (
                      <tr key={idx}>
                        <td className="font-medium">
                          {item.day || item.month || item.year}
                        </td>
                        <td className="text-right font-bold text-blue">
                          {formatCurrency(item.revenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="empty-state">
          <p>No revenue data available for the selected filters.</p>
        </div>
      )}
    </section>
  );
}
