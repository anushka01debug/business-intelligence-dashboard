import { useEffect, useRef, useState } from "react";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import Customers from "./pages/Customers";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import "./App.css";

const API = "http://127.0.0.1:8000";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [reportType, setReportType] = useState("monthly");

  // Filters state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [region, setRegion] = useState("");
  const [category, setCategory] = useState("");

  // Dropdown lists
  const [regionsList, setRegionsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);

  // Data state
  const [summary, setSummary] = useState(null);
  const [growthData, setGrowthData] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [categoryRevenue, setCategoryRevenue] = useState([]);
  const [regionRevenue, setRegionRevenue] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Guards against race conditions
  const requestIdRef = useRef(0);

  // Fetch filter options (Regions & Categories)
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [regRes, catRes] = await Promise.all([
          fetch(`${API}/dashboard/regions`),
          fetch(`${API}/dashboard/categories`),
        ]);
        if (regRes.ok) setRegionsList(await regRes.json());
        if (catRes.ok) setCategoriesList(await catRes.json());
      } catch (err) {
        console.error("Error fetching filter options:", err);
      }
    };
    fetchOptions();
  }, []);

  const fetchDashboard = async (
    type = reportType,
    from = startDate,
    to = endDate,
    reg = region,
    cat = category
  ) => {
    const requestId = ++requestIdRef.current;

    const params = new URLSearchParams();
    if (from) params.append("start_date", from);
    if (to) params.append("end_date", to);
    if (reg) params.append("region", reg);
    if (cat) params.append("category", cat);

    const query = params.toString() ? `?${params.toString()}` : "";

    let revenueEndpoint = "/dashboard/monthly-revenue";
    if (type === "daily") {
      revenueEndpoint = "/dashboard/daily-revenue";
    } else if (type === "annual") {
      revenueEndpoint = "/dashboard/annual-revenue";
    }

    setLoading(true);
    setError(null);

    try {
      const [
        summaryRes,
        growthRes,
        revenueRes,
        categoryRes,
        regionRes,
        statusRes,
        productsRes,
        customersRes,
      ] = await Promise.all([
        fetch(`${API}/dashboard/summary${query}`),
        fetch(`${API}/dashboard/revenue-growth${query}`),
        fetch(`${API}${revenueEndpoint}${query}`),
        fetch(`${API}/dashboard/category-revenue${query}`),
        fetch(`${API}/dashboard/region-revenue${query}`),
        fetch(`${API}/dashboard/order-status${query}`),
        fetch(`${API}/dashboard/top-products${query}`),
        fetch(`${API}/dashboard/top-customers${query}`),
      ]);

      if (
        !summaryRes.ok ||
        !growthRes.ok ||
        !revenueRes.ok ||
        !categoryRes.ok ||
        !regionRes.ok ||
        !statusRes.ok ||
        !productsRes.ok ||
        !customersRes.ok
      ) {
        throw new Error("Failed to fetch business intelligence data");
      }

      const summaryData = await summaryRes.json();
      const growthDataRes = await growthRes.json();
      const revenueDataRes = await revenueRes.json();
      const categoryDataRes = await categoryRes.json();
      const regionDataRes = await regionRes.json();
      const statusDataRes = await statusRes.json();
      const productsDataRes = await productsRes.json();
      const customersDataRes = await customersRes.json();

      if (requestId !== requestIdRef.current) return;

      setSummary(summaryData);
      setGrowthData(growthDataRes);
      setRevenueData(revenueDataRes);
      setCategoryRevenue(categoryDataRes);
      setRegionRevenue(regionDataRes);
      setOrderStatusData(statusDataRes);
      setTopProducts(productsDataRes);
      setTopCustomers(customersDataRes);
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      console.error("Dashboard error:", err);
      setError("Couldn't load business intelligence data. Please check backend connection.");
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchDashboard(reportType, startDate, endDate, region, category);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportType]);

  const handleApplyFilters = () => {
    fetchDashboard(reportType, startDate, endDate, region, category);
  };

  const handleClearFilters = () => {
    setStartDate("");
    setEndDate("");
    setRegion("");
    setCategory("");
    fetchDashboard(reportType, "", "", "", "");
  };

  const handleReportChange = (type) => {
    setReportType(type);
  };

  return (
    <div className="dashboard-app">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="main-content">
        {error && <div className="error-banner">{error}</div>}

        {loading && !summary && (
          <div className="loading-state">Initializing Business Intelligence System...</div>
        )}

        {activeTab === "dashboard" && (
          <Dashboard
            summary={summary}
            growthData={growthData}
            revenueData={revenueData}
            categoryRevenue={categoryRevenue}
            regionRevenue={regionRevenue}
            orderStatusData={orderStatusData}
            topProducts={topProducts}
            topCustomers={topCustomers}
            reportType={reportType}
            setReportType={handleReportChange}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            region={region}
            setRegion={setRegion}
            category={category}
            setCategory={setCategory}
            regionsList={regionsList}
            categoriesList={categoriesList}
            onApplyFilters={handleApplyFilters}
            onClearFilters={handleClearFilters}
          />
        )}

        {activeTab === "reports" && (
          <Reports
            summary={summary}
            revenueData={revenueData}
            topProducts={topProducts}
            topCustomers={topCustomers}
            reportType={reportType}
            setReportType={handleReportChange}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            region={region}
            setRegion={setRegion}
            category={category}
            setCategory={setCategory}
            regionsList={regionsList}
            categoriesList={categoriesList}
            onApplyFilters={handleApplyFilters}
            onClearFilters={handleClearFilters}
          />
        )}

        {activeTab === "customers" && <Customers regionsList={regionsList} />}

        {activeTab === "products" && <Products categoriesList={categoriesList} />}

        {activeTab === "orders" && <Orders regionsList={regionsList} />}
      </main>
    </div>
  );
}

export default App;