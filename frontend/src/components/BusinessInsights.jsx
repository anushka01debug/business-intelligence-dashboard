import { Lightbulb, CheckCircle, Target, TrendingUp } from "lucide-react";

export default function BusinessInsights({
  summary,
  categoryRevenue,
  regionRevenue,
  topProducts,
  topCustomers,
}) {
  const formatCurrency = (val) =>
    `₹${Number(val ?? 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

  const insights = [];

  // Top Category
  if (categoryRevenue && categoryRevenue.length > 0) {
    const topCat = categoryRevenue[0];
    insights.push({
      icon: Target,
      text: `${topCat.category} generated the highest revenue at ${formatCurrency(topCat.revenue)}.`,
    });
  }

  // Top Region
  if (regionRevenue && regionRevenue.length > 0) {
    const topReg = regionRevenue[0];
    insights.push({
      icon: TrendingUp,
      text: `${topReg.region} region contributed the highest revenue of ${formatCurrency(topReg.revenue)}.`,
    });
  }

  // Top Product
  if (topProducts && topProducts.length > 0) {
    const topProd = topProducts[0];
    insights.push({
      icon: CheckCircle,
      text: `${topProd.product_name} is the highest revenue-generating product (${formatCurrency(topProd.revenue)} sold across ${topProd.units_sold} units).`,
    });
  }

  // Average Order Value
  if (summary && summary.average_order_value > 0) {
    insights.push({
      icon: Lightbulb,
      text: `Average order value across filtered orders stands at ${formatCurrency(summary.average_order_value)}.`,
    });
  }

  // Top Customer
  if (topCustomers && topCustomers.length > 0) {
    const topCust = topCustomers[0];
    insights.push({
      icon: Target,
      text: `${topCust.customer_name} (${topCust.region}) is the top customer contributing ${formatCurrency(topCust.revenue)}.`,
    });
  }

  if (insights.length === 0) {
    return null;
  }

  return (
    <section className="insights-card">
      <div className="insights-header">
        <Lightbulb size={22} className="insights-icon" />
        <div>
          <h2>Business Insights</h2>
          <p>Automated intelligence generated from real-time database queries</p>
        </div>
      </div>

      <div className="insights-list">
        {insights.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="insight-item">
              <Icon size={18} className="insight-item-icon" />
              <span>{item.text}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
