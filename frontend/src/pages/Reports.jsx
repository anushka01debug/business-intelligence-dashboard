import DateFilter from "../components/DateFilter";
import RevenueReport from "../components/RevenueReport";
import TopProducts from "../components/TopProducts";
import TopCustomers from "../components/TopCustomers";
import { exportToCSV } from "../utils/csvExporter";
import { generatePDFReport } from "../utils/pdfGenerator";
import { Download, FileSpreadsheet } from "lucide-react";

export default function Reports({
  summary,
  revenueData,
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
  const handleExportCSV = () => {
    exportToCSV(revenueData, reportType, {
      startDate,
      endDate,
      region,
      category,
    });
  };

  const handleExportPDF = () => {
    generatePDFReport({
      reportType,
      summary,
      revenueData,
      topProducts,
      topCustomers,
      filters: { startDate, endDate, region, category },
    });
  };

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

      {/* REPORT EXPORT CONTROLS */}
      <div className="export-banner">
        <div className="export-banner-text">
          <h2>Business Performance Reporting Hub</h2>
          <p>Export executive reports in CSV or PDF format with current active filters</p>
        </div>
        <div className="export-buttons">
          <button className="csv-export-button" onClick={handleExportCSV}>
            <FileSpreadsheet size={18} />
            Export CSV
          </button>
          <button className="pdf-export-button" onClick={handleExportPDF}>
            <Download size={18} />
            Generate PDF Report
          </button>
        </div>
      </div>

      {/* REVENUE REPORT WITH SYNCED TABLE */}
      <RevenueReport
        revenueData={revenueData}
        reportType={reportType}
        setReportType={setReportType}
        showTable={true}
      />

      {/* DETAILED DATA TABLES */}
      <div className="tables-grid-2">
        <TopProducts topProducts={topProducts} />
        <TopCustomers topCustomers={topCustomers} />
      </div>
    </div>
  );
}
