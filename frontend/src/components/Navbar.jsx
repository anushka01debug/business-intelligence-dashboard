import { BarChart3, FileText, Users, Package, ShoppingCart } from "lucide-react";

export default function Navbar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "customers", label: "Customers", icon: Users },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingCart },
  ];

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <div className="brand-logo">
          <BarChart3 className="logo-icon" />
        </div>
        <div>
          <h2>Business Performance Intelligence System</h2>
          <p className="brand-subtitle">Executive Reporting & Analytics</p>
        </div>
      </div>

      <nav className="navbar-menu">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
}
