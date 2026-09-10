import { useEffect, useState } from "react";
import { ShoppingCart, Filter } from "lucide-react";

const API = "http://127.0.0.1:8000";

export default function Orders({ regionsList }) {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async (statusFilter = "", regionFilter = "") => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append("status", statusFilter);
      if (regionFilter) params.append("region", regionFilter);
      
      const query = params.toString() ? `?${params.toString()}` : "";
      const res = await fetch(`${API}/orders${query}`);
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load orders list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(selectedStatus, selectedRegion);
  }, [selectedStatus, selectedRegion]);

  const formatCurrency = (val) =>
    `₹${Number(val ?? 0).toLocaleString("en-IN")}`;

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title-group">
          <ShoppingCart className="page-icon blue" size={24} />
          <div>
            <h2>Orders Directory & Tracking</h2>
            <p>Comprehensive transaction log with status tracking, payment methods, and total amounts</p>
          </div>
        </div>

        <div className="page-filter-controls">
          <div className="page-filter-control">
            <Filter size={16} />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="page-filter-control">
            <Filter size={16} />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              <option value="">All Regions</option>
              {regionsList.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Loading orders...</div>
      ) : error ? (
        <div className="error-banner">{error}</div>
      ) : orders.length === 0 ? (
        <div className="empty-state">No orders match the selected filters.</div>
      ) : (
        <div className="table-card">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer Name</th>
                  <th>Region</th>
                  <th>Order Date</th>
                  <th>Status</th>
                  <th>Payment Method</th>
                  <th className="text-right">Items</th>
                  <th className="text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.order_id}>
                    <td>#{o.order_id}</td>
                    <td className="font-semibold text-main">{o.customer_name}</td>
                    <td>
                      <span className="badge region-badge">{o.region}</span>
                    </td>
                    <td className="text-muted">{o.order_date}</td>
                    <td>
                      <span
                        className={`badge ${
                          o.order_status === "Completed"
                            ? "completed-badge"
                            : o.order_status === "Pending"
                            ? "pending-badge"
                            : "cancelled-badge"
                        }`}
                      >
                        {o.order_status}
                      </span>
                    </td>
                    <td>{o.payment_method}</td>
                    <td className="text-right font-medium">{o.items_count}</td>
                    <td className="text-right font-bold text-blue">
                      {formatCurrency(o.total_amount)}
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
