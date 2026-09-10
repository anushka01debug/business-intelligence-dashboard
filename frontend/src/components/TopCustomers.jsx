import { Users } from "lucide-react";

export default function TopCustomers({ topCustomers }) {
  const formatCurrency = (val) =>
    `₹${Number(val ?? 0).toLocaleString("en-IN")}`;

  return (
    <section className="table-card">
      <div className="card-header">
        <div className="card-title-group">
          <Users size={20} className="card-icon purple" />
          <h2>Top Revenue-Generating Customers</h2>
        </div>
      </div>

      {topCustomers && topCustomers.length > 0 ? (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Region</th>
                <th className="text-right">Orders</th>
                <th className="text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topCustomers.map((c, idx) => (
                <tr key={idx}>
                  <td className="font-semibold text-main">{c.customer_name}</td>
                  <td>
                    <span className="badge region-badge">{c.region}</span>
                  </td>
                  <td className="text-right font-medium">{c.number_of_orders}</td>
                  <td className="text-right font-bold text-blue">
                    {formatCurrency(c.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <p>No customer revenue data available for the selected filters.</p>
        </div>
      )}
    </section>
  );
}
