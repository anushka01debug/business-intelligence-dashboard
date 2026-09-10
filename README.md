# Business Performance Intelligence System

A full-stack enterprise business intelligence and reporting platform built with **React**, **FastAPI**, and **Oracle Database 21c XE**.

The system provides real-time sales performance tracking, dimensional analytics (category, region, order status), multi-criteria filtering, automated business insights, interactive directory views, and executive report export capabilities (CSV and PDF).

---

## 📌 Problem Statement

Modern enterprise sales and marketing teams require real-time visibility into key performance indicators (KPIs), region and product trends, order fulfillment health, and period-over-period growth. Traditional reporting workflows relying on static spreadsheets suffer from data lag, manual calculation errors, and lack of interactive filtering.

The **Business Performance Intelligence System** solves this by providing a unified REST-driven analytics engine backed by an Oracle Database 21c relational schema and an intuitive executive dashboard interface.

---

## ✨ Key Features

- **Executive KPI Dashboard**: Total Revenue, Revenue Growth (% vs. previous period), Total Orders, Total Customers, Total Products, and Average Order Value (AOV).
- **Time-Series Revenue Reporting**: Interactive revenue trend charts with toggles for **Daily**, **Monthly**, and **Annual** aggregations, accompanied by synced tabular data breakdowns.
- **Combined Multi-Criteria Filtering**: Filter all dashboard analytics simultaneously by **From Date**, **To Date**, **Customer Region**, and **Product Category**.
- **Dimensional Performance Breakdown**: Visual distributions for **Revenue by Category**, **Revenue by Region**, and **Order Status Distribution** (Completed, Pending, Cancelled).
- **Executive Ranking Tables**: Instant access to top revenue-generating products and top revenue-generating customers supporting limit parameters (`?limit=5`).
- **Automated Business Insights**: SQL-calculated natural language observations highlighting top-performing categories, regions, products, and customer contributions.
- **Multi-Format Report Export**: 
  - **CSV Export**: Downloads active report views (`daily_revenue_report.csv`, `monthly_revenue_report.csv`, `annual_revenue_report.csv`) with applied filter metadata.
  - **Executive PDF Report**: Client-side PDF generation formatted with header banners, active filter states, KPI summary blocks, and formatted data tables using `jsPDF` and `jspdf-autotable`.
- **Interactive Directory Workbench**:
  - **Customers Directory**: Account details, regions, customer types, order counts, and cumulative spend.
  - **Products Catalog**: Pricing, unit costs, units sold, and total sales revenue.
  - **Orders Tracking**: Transaction log with status badges, payment methods, item counts, and order totals.

---

## 🛠 Technology Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Data Visualization**: Recharts
- **Iconography**: Lucide React
- **PDF Generation**: jsPDF & jsPDF-AutoTable
- **Styling**: Modern CSS3 (Enterprise Slate Theme)

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **ASGI Server**: Uvicorn
- **Database Driver**: `oracledb` (Thin/Thick mode)
- **Environment Management**: `python-dotenv`

### Database
- **Engine**: Oracle Database 21c XE
- **Schema Tooling**: SQL*Plus / Oracle SQL Developer
- **Features**: ANSI SQL joins, Oracle `TRUNC()`, `TO_DATE()`, `TO_CHAR()`, `NVL()`, `NULLIF()`, Identity Columns, B-tree Indexes

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       React Frontend                        │
│          (Dashboard, Reports, Customers, Products, Orders)   │
└──────────────────────────────┬──────────────────────────────┘
                               │ REST API (HTTP / JSON)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      FastAPI Backend                        │
│          (Main, Analytics Services, APIRouters)             │
└──────────────────────────────┬──────────────────────────────┘
                               │ Oracle Driver (oracledb)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Oracle Database 21c XE                    │
│          (CUSTOMERS, PRODUCTS, ORDERS, ORDER_ITEMS)         │
└─────────────────────────────────────────────────────────────┘
```

For complete architecture diagrams and data entity relationship details, see [docs/architecture.md](docs/architecture.md).

---

## 🗄 Database Schema & Relationships

The system operates on an Oracle 21c relational database schema:

- **CUSTOMERS**: `customer_id` (PK), `customer_name`, `email`, `city`, `region`, `customer_type`, `registration_date`
- **PRODUCTS**: `product_id` (PK), `product_name`, `category`, `unit_price`, `cost_price`
- **ORDERS**: `order_id` (PK), `customer_id` (FK), `order_date`, `order_status`, `payment_method`
- **ORDER_ITEMS**: `order_item_id` (PK), `order_id` (FK), `product_id` (FK), `quantity`, `unit_price`

---

## 🔌 Main API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | API status check |
| `GET` | `/dashboard/summary` | Aggregate KPIs (Revenue, Orders, Customers, Products, AOV) |
| `GET` | `/dashboard/revenue-growth` | Revenue growth percentage vs. previous period |
| `GET` | `/dashboard/monthly-revenue` | Monthly revenue time-series data |
| `GET` | `/dashboard/daily-revenue` | Daily revenue time-series data |
| `GET` | `/dashboard/annual-revenue` | Annual revenue time-series data |
| `GET` | `/dashboard/category-revenue` | Revenue grouped by product category |
| `GET` | `/dashboard/region-revenue` | Revenue grouped by customer region |
| `GET` | `/dashboard/order-status` | Order counts grouped by status (Completed, Pending, Cancelled) |
| `GET` | `/dashboard/top-products` | Ranked products by total revenue (`?limit=5`) |
| `GET` | `/dashboard/top-customers` | Ranked customers by total revenue (`?limit=5`) |
| `GET` | `/dashboard/regions` | Dynamic list of available regions for dropdown filters |
| `GET` | `/dashboard/categories` | Dynamic list of available categories for dropdown filters |
| `GET` | `/customers` | Full customer list with order counts & total spent |
| `GET` | `/products` | Product catalog with units sold & total revenue |
| `GET` | `/orders` | Recent order tracking list with customer name & totals |

*All `/dashboard/*` endpoints accept combined query parameters: `start_date`, `end_date`, `region`, and `category`.*

---

## 🚀 Installation & Setup Instructions

### Prerequisites
- **Python 3.11+** installed
- **Node.js 18+** & **npm** installed
- **Oracle Database 21c XE** installed and running

### 1. Database Setup
Execute `database/schema.sql` and `database/seed.sql` using SQL*Plus or Oracle SQL Developer:
```sql
@database/schema.sql
@database/seed.sql
```

### 2. Backend Setup
Navigate to the `backend` directory and activate virtual environment:
```powershell
cd backend
venv\Scripts\activate
pip install -r requirements.txt  # (fastapi uvicorn oracledb python-dotenv)
```

Create a `.env` file in the `backend` directory (do **NOT** commit `.env` to git):
```env
DB_USER=your_oracle_user
DB_PASSWORD=your_oracle_password
DB_HOST=localhost
DB_PORT=1521
DB_SERVICE=xe
```

Start the FastAPI application server:
```powershell
uvicorn main:app --reload
```
Backend API will be accessible at: `http://127.0.0.1:8000`  
Interactive Swagger API docs: `http://127.0.0.1:8000/docs`

### 3. Frontend Setup
Navigate to the `frontend` directory:
```powershell
cd frontend
npm install
npm run dev
```
Frontend dashboard will be accessible at: `http://localhost:5173`

---

## 🖼 Application Screenshots

> *Add application screenshots below when publishing to portfolio/GitHub:*

| Executive Dashboard | Reporting & Exports |
| :---: | :---: |
| ![Dashboard Overview](docs/screenshots/dashboard.png) | ![Reports Hub](docs/screenshots/reports.png) |

| Customers Directory | Products Catalog |
| :---: | :---: |
| ![Customers View](docs/screenshots/customers.png) | ![Products View](docs/screenshots/products.png) |

---

## 🔮 Future Enhancements

- [ ] Role-Based Access Control (RBAC) for Admin, Manager, and Analyst roles.
- [ ] Predictive Revenue Forecasting using time-series machine learning models.
- [ ] Automated scheduled PDF report emails via SMTP/Celery workers.
- [ ] Multi-currency conversion support for global region reporting.

---

## 👨‍💻 Project Information

- **Project Name**: Business Performance Intelligence System
- **Purpose**: Academic & Professional Portfolio Project
- **Domain**: Web Development, REST APIs, Database Analytics, Business Intelligence
