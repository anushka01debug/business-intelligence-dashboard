import { useEffect, useState } from "react";
import { Users, Filter } from "lucide-react";

const API = "http://127.0.0.1:8000";

export default function Customers({ regionsList }) {
  const [customers, setCustomers] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCustomers = async (regionFilter = "") => {
    setLoading(true);
    setError(null);
    try {
      let url = `${API}/customers`;
      if (regionFilter) {
        url += `?region=${encodeURIComponent(regionFilter)}`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch customers");
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load customer list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(selectedRegion);
  }, [selectedRegion]);

  const formatCurrency = (val) =>
    `₹${Number(val ?? 0).toLocaleString("en-IN")}`;

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title-group">
          <Users className="page-icon purple" size={24} />
          <div>
            <h2>Customer Analytics Directory</h2>
            <p>Comprehensive list of customer accounts, regions, and historical purchase totals</p>
          </div>
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

      {loading ? (
        <div className="loading-state">Loading customers...</div>
      ) : error ? (
        <div className="error-banner">{error}</div>
      ) : customers.length === 0 ? (
        <div className="empty-state">No customers found for the selected region.</div>
      ) : (
        <div className="table-card">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer Name</th>
                  <th>Email</th>
                  <th>City</th>
                  <th>Region</th>
                  <th>Customer Type</th>
                  <th>Registered</th>
                  <th className="text-right">Orders</th>
                  <th className="text-right">Total Spent</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.customer_id}>
                    <td>#{c.customer_id}</td>
                    <td className="font-semibold text-main">{c.customer_name}</td>
                    <td className="text-muted">{c.email}</td>
                    <td>{c.city}</td>
                    <td>
                      <span className="badge region-badge">{c.region}</span>
                    </td>
                    <td>
                      <span className={`badge ${c.customer_type === "Returning" ? "returning-badge" : "new-badge"}`}>
                        {c.customer_type}
                      </span>
                    </td>
                    <td className="text-muted">{c.registration_date}</td>
                    <td className="text-right font-medium">{c.total_orders}</td>
                    <td className="text-right font-bold text-blue">
                      {formatCurrency(c.total_spent)}
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
