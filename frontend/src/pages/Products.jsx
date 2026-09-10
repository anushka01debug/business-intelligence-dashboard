import { useEffect, useState } from "react";
import { Package, Filter } from "lucide-react";

const API = "http://127.0.0.1:8000";

export default function Products({ categoriesList }) {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async (catFilter = "") => {
    setLoading(true);
    setError(null);
    try {
      let url = `${API}/products`;
      if (catFilter) {
        url += `?category=${encodeURIComponent(catFilter)}`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load product catalog.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(selectedCategory);
  }, [selectedCategory]);

  const formatCurrency = (val) =>
    `₹${Number(val ?? 0).toLocaleString("en-IN")}`;

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title-group">
          <Package className="page-icon amber" size={24} />
          <div>
            <h2>Product Catalog & Performance</h2>
            <p>Product pricing, cost breakdown, total units sold, and cumulative revenue</p>
          </div>
        </div>

        <div className="page-filter-control">
          <Filter size={16} />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categoriesList.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Loading products...</div>
      ) : error ? (
        <div className="error-banner">{error}</div>
      ) : products.length === 0 ? (
        <div className="empty-state">No products found for the selected category.</div>
      ) : (
        <div className="table-card">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th className="text-right">Unit Price</th>
                  <th className="text-right">Cost Price</th>
                  <th className="text-right">Units Sold</th>
                  <th className="text-right">Total Revenue</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.product_id}>
                    <td>#{p.product_id}</td>
                    <td className="font-semibold text-main">{p.product_name}</td>
                    <td>
                      <span className="badge category-badge">{p.category}</span>
                    </td>
                    <td className="text-right font-medium">{formatCurrency(p.unit_price)}</td>
                    <td className="text-right text-muted">{formatCurrency(p.cost_price)}</td>
                    <td className="text-right font-medium">{p.units_sold}</td>
                    <td className="text-right font-bold text-blue">
                      {formatCurrency(p.total_revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
