import KPICards from "../components/KPICards";
import DateFilter from "../components/DateFilter";
import RevenueReport from "../components/RevenueReport";
import CategoryChart from "../components/CategoryChart";
import RegionChart from "../components/RegionChart";
import OrderStatusChart from "../components/OrderStatusChart";
import TopProducts from "../components/TopProducts";
import TopCustomers from "../components/TopCustomers";
import BusinessInsights from "../components/BusinessInsights";

export default function Dashboard({
  summary,
  growthData,
  revenueData,
  categoryRevenue,
  regionRevenue,
  orderStatusData,
  topProducts,
  topCustomers,
  reportType,
  setReportType,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  region,
  setRegion,
  category,
  setCategory,
  regionsList,
  categoriesList,
  onApplyFilters,
  onClearFilters,
}) {
  return (
    <div className="page-container">
      {/* FILTER BAR */}
      <DateFilter
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
        onApply={onApplyFilters}
        onClear={onClearFilters}
      />

      {/* EXECUTIVE SUMMARY KPIS */}
      <KPICards summary={summary} growthData={growthData} />

      {/* AUTOMATED BUSINESS INSIGHTS */}
      <BusinessInsights
        summary={summary}
        categoryRevenue={categoryRevenue}
        regionRevenue={regionRevenue}
        topProducts={topProducts}
        topCustomers={topCustomers}
      />

      {/* MAIN REVENUE TREND CHART */}
      <RevenueReport
        revenueData={revenueData}
        reportType={reportType}
        setReportType={setReportType}
        showTable={false}
      />

      {/* BREAKDOWN CHARTS GRID */}
      <div className="charts-grid-3">
        <CategoryChart categoryRevenue={categoryRevenue} />
        <RegionChart regionRevenue={regionRevenue} />
        <OrderStatusChart orderStatusData={orderStatusData} />
      </div>

      {/* TOP TABLES GRID */}
      <div className="tables-grid-2">
        <TopProducts topProducts={topProducts} />
        <TopCustomers topCustomers={topCustomers} />
      </div>
    </div>
  );
}
