export const exportToCSV = (data, reportType, filters = {}) => {
  if (!data || data.length === 0) {
    alert("No data available to export.");
    return;
  }

  const timeHeader =
    reportType === "daily" ? "Date" : reportType === "annual" ? "Year" : "Month";

  const rows = [];
  
  // Title & Metadata headers
  rows.push([`BUSINESS PERFORMANCE INTELLIGENCE SYSTEM - ${reportType.toUpperCase()} REVENUE REPORT`]);
  rows.push([`Generated On: ${new Date().toLocaleString("en-IN")}`]);
  
  const filterDesc = [];
  if (filters.startDate) filterDesc.push(`From: ${filters.startDate}`);
  if (filters.endDate) filterDesc.push(`To: ${filters.endDate}`);
  if (filters.region) filterDesc.push(`Region: ${filters.region}`);
  if (filters.category) filterDesc.push(`Category: ${filters.category}`);
  
  if (filterDesc.length > 0) {
    rows.push([`Filters Applied: ${filterDesc.join(" | ")}`]);
  }
  rows.push([]); // Blank line separator

  // Column Headers
  rows.push([timeHeader, "Revenue (INR)"]);

  // Data rows
  data.forEach((item) => {
    const periodKey = item.day || item.month || item.year || "";
    rows.push([periodKey, item.revenue ?? 0]);
  });

  const csvContent =
    "data:text/csv;charset=utf-8," +
    rows.map((row) => row.map((val) => `"${val}"`).join(",")).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${reportType}_revenue_report.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
