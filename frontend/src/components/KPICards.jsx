import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Package, CreditCard, Activity } from "lucide-react";

export default function KPICards({ summary, growthData }) {
  const formatCurrency = (val) =>
    `₹${Number(val ?? 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

  const growthPct = growthData?.growth_percentage;
  const hasGrowth = growthPct !== null && growthPct !== undefined;

  return (
    <section className="kpi-grid">

      {/* Total Revenue */}
      <div className="kpi-card">
        <div className="kpi-header">
          <span className="kpi-title">Total Revenue</span>
          <div className="kpi-icon-badge blue">
            <DollarSign size={20} />
          </div>
        </div>
        <h2 className="kpi-value">{formatCurrency(summary?.total_revenue)}</h2>
        <span className="kpi-subtitle">Completed orders revenue</span>
      </div>

      {/* Revenue Growth */}
      <div className="kpi-card">
        <div className="kpi-header">
          <span className="kpi-title">Revenue Growth</span>
          <div className={`kpi-icon-badge ${hasGrowth && growthPct >= 0 ? "green" : hasGrowth ? "red" : "gray"}`}>
            <Activity size={20} />
          </div>
        </div>
        <div className="kpi-growth-row">
          <h2 className="kpi-value">
            {hasGrowth ? `${growthPct >= 0 ? "+" : ""}${growthPct}%` : "N/A"}
          </h2>
          {hasGrowth && (
            <span className={`growth-badge ${growthPct >= 0 ? "positive" : "negative"}`}>
              {growthPct >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {Math.abs(growthPct)}%
            </span>
          )}
        </div>
        <span className="kpi-subtitle">vs. previous period</span>
      </div>

      {/* Total Orders */}
      <div className="kpi-card">
        <div className="kpi-header">
          <span className="kpi-title">Total Orders</span>
          <div className="kpi-icon-badge purple">
            <ShoppingBag size={20} />
          </div>
        </div>
        <h2 className="kpi-value">{summary?.total_orders ?? 0}</h2>
        <span className="kpi-subtitle">Completed transactions</span>
      </div>

      {/* Total Customers */}
      <div className="kpi-card">
        <div className="kpi-header">
          <span className="kpi-title">Total Customers</span>
          <div className="kpi-icon-badge emerald">
            <Users size={20} />
          </div>
        </div>
        <h2 className="kpi-value">{summary?.total_customers ?? 0}</h2>
        <span className="kpi-subtitle">Active buyers</span>
      </div>

      {/* Total Products */}
      <div className="kpi-card">
        <div className="kpi-header">
          <span className="kpi-title">Total Products</span>
          <div className="kpi-icon-badge amber">
            <Package size={20} />
          </div>
        </div>
        <h2 className="kpi-value">{summary?.total_products ?? 0}</h2>
        <span className="kpi-subtitle">Active catalog items</span>
      </div>

      {/* Average Order Value */}
      <div className="kpi-card">
        <div className="kpi-header">
          <span className="kpi-title">Average Order Value</span>
          <div className="kpi-icon-badge indigo">
            <CreditCard size={20} />
          </div>
        </div>
        <h2 className="kpi-value">{formatCurrency(summary?.average_order_value)}</h2>
        <span className="kpi-subtitle">Per order revenue</span>
      </div>

    </section>
  );
}
