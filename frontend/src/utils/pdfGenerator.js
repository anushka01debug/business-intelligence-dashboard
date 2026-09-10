import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePDFReport = ({
  reportType,
  summary,
  revenueData,
  topProducts,
  topCustomers,
  filters,
}) => {
  const doc = new jsPDF();
  const primaryColor = [37, 99, 235]; // #2563eb

  // Title Banner
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 25, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("BUSINESS PERFORMANCE INTELLIGENCE SYSTEM", 14, 16);

  // Report Subtitle & Date
  doc.setTextColor(51, 65, 85);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(
    `Executive Report (${reportType.toUpperCase()} REVENUE)`,
    14,
    34
  );

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated on: ${new Date().toLocaleString("en-IN")}`, 14, 40);

  // Active Filters Box
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 45, 182, 18, 2, 2, "FD");

  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  const filterTexts = [
    `Date Range: ${filters.startDate || "All"} to ${filters.endDate || "All"}`,
    `Region: ${filters.region || "All Regions"}`,
    `Category: ${filters.category || "All Categories"}`,
  ];
  doc.text(filterTexts.join("   |   "), 18, 56);

  // Key Performance Indicators Section
  let currentY = 72;
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text("Key Performance Indicators (KPIs)", 14, currentY);
  currentY += 6;

  const formatCurr = (val) =>
    `Rs ${Number(val ?? 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

  const kpiRows = [
    [
      "Total Revenue",
      formatCurr(summary?.total_revenue),
      "Total Orders",
      summary?.total_orders ?? 0,
    ],
    [
      "Total Customers",
      summary?.total_customers ?? 0,
      "Avg Order Value",
      formatCurr(summary?.average_order_value),
    ],
  ];

  autoTable(doc, {
    startY: currentY,
    head: [],
    body: kpiRows,
    theme: "plain",
    styles: { fontSize: 9, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: "bold", textColor: [71, 85, 105], cellWidth: 35 },
      1: { fontStyle: "bold", textColor: [37, 99, 235], cellWidth: 55 },
      2: { fontStyle: "bold", textColor: [71, 85, 105], cellWidth: 35 },
      3: { fontStyle: "bold", textColor: [37, 99, 235], cellWidth: 55 },
    },
  });

  currentY = doc.lastAutoTable.finalY + 10;

  // Revenue Breakdown Table
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  const timeHeader =
    reportType === "daily" ? "Date" : reportType === "annual" ? "Year" : "Month";
  doc.text(`Revenue Breakdown (${timeHeader})`, 14, currentY);
  currentY += 4;

  const revTableBody = (revenueData || []).map((item) => [
    item.day || item.month || item.year || "-",
    formatCurr(item.revenue),
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [[timeHeader, "Revenue"]],
    body: revTableBody,
    theme: "striped",
    headStyles: { fillColor: primaryColor },
    styles: { fontSize: 9 },
  });

  currentY = doc.lastAutoTable.finalY + 10;

  // Top Products Table
  if (topProducts && topProducts.length > 0) {
    if (currentY > 230) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text("Top Revenue Generating Products", 14, currentY);
    currentY += 4;

    const productRows = topProducts.map((p) => [
      p.product_name,
      p.category,
      p.units_sold,
      formatCurr(p.revenue),
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [["Product Name", "Category", "Units Sold", "Revenue"]],
      body: productRows,
      theme: "striped",
      headStyles: { fillColor: [15, 23, 42] },
      styles: { fontSize: 9 },
    });

    currentY = doc.lastAutoTable.finalY + 10;
  }

  // Top Customers Table
  if (topCustomers && topCustomers.length > 0) {
    if (currentY > 230) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text("Top Revenue Generating Customers", 14, currentY);
    currentY += 4;

    const customerRows = topCustomers.map((c) => [
      c.customer_name,
      c.region,
      c.number_of_orders,
      formatCurr(c.revenue),
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [["Customer Name", "Region", "Orders", "Revenue"]],
      body: customerRows,
      theme: "striped",
      headStyles: { fillColor: [15, 23, 42] },
      styles: { fontSize: 9 },
    });
  }

  doc.save(`${reportType}_performance_report.pdf`);
};
