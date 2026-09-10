import { Award } from "lucide-react";

export default function TopProducts({ topProducts }) {
  const formatCurrency = (val) =>
    `₹${Number(val ?? 0).toLocaleString("en-IN")}`;

  return (
    <section className="table-card">
      <div className="card-header">
        <div className="card-title-group">
          <Award size={20} className="card-icon amber" />
          <h2>Top Revenue-Generating Products</h2>
        </div>
      </div>

      {topProducts && topProducts.length > 0 ? (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th className="text-right">Units Sold</th>
                <th className="text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((p, idx) => (
                <tr key={idx}>
                  <td className="font-semibold text-main">{p.product_name}</td>
                  <td>
                    <span className="badge category-badge">{p.category}</span>
                  </td>
                  <td className="text-right font-medium">{p.units_sold}</td>
                  <td className="text-right font-bold text-blue">
                    {formatCurrency(p.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <p>No product performance data available for the selected filters.</p>
        </div>
      )}
    </section>
  );
}
