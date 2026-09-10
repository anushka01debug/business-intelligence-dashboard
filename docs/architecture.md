# System Architecture & Database Design

This document details the technical architecture, component interactions, and relational database design of the **Business Performance Intelligence System**.

---

## 1. System Architecture Diagram

```
+-----------------------------------------------------------------------+
|                            REACT FRONTEND                             |
|                                                                       |
|   +-------------------+  +-------------------+  +-----------------+   |
|   |  Executive Dash   |  | Reports & Exports |  | Directory Views |   |
|   |  (KPIs & Charts)  |  |  (CSV & PDF)      |  | (Cust/Prod/Ord) |   |
|   +-------------------+  +-------------------+  +-----------------+   |
+-----------------------------------┬-----------------------------------+
                                    |
                                    | HTTP REST API (JSON)
                                    v
+-----------------------------------------------------------------------+
|                            FASTAPI BACKEND                            |
|                                                                       |
|   +-------------------+  +-------------------+  +-----------------+   |
|   | Dashboard Router  |  | Customer Router   |  | Product/Order   |   |
|   | /dashboard/*      |  | /customers        |  | Routers         |   |
|   +---------┬---------+  +---------┬---------+  +--------┬--------+   |
|             |                      |                     |            |
|             +----------------------┼---------------------+            |
|                                    v                                  |
|                          Analytics Service Helper                     |
|                   (Parameterized SQL & Growth Logic)                  |
+-----------------------------------┬-----------------------------------+
                                    |
                                    | Native Oracle Driver (oracledb)
                                    v
+-----------------------------------------------------------------------+
|                         ORACLE DATABASE 21C XE                        |
|                                                                       |
|   +-------------------+                     +---------------------+   |
|   |     CUSTOMERS     | 1                 * |       ORDERS        |   |
|   |  (Customer ID)    |<------------------->|    (Order ID)       |   |
|   +-------------------+                     +----------┬----------+   |
|                                                        | 1            |
|                                                        |              |
|   +-------------------+                     +----------v----------+   |
|   |     PRODUCTS      | 1                 * |     ORDER_ITEMS     |   |
|   |   (Product ID)    |<------------------->|   (Order Item ID)   |   |
|   +-------------------+                     +---------------------+   |
+-----------------------------------------------------------------------+
```

---

## 2. Entity Relationship Diagram (ERD) & Schema

### Relational Tables

#### 1. CUSTOMERS Table
Stores customer demographic and registration information.
- `customer_id` (NUMBER, Primary Key, Identity)
- `customer_name` (VARCHAR2(100), NOT NULL)
- `email` (VARCHAR2(150))
- `city` (VARCHAR2(50))
- `region` (VARCHAR2(50)) - *Filter Dimension (North, South, East, West)*
- `customer_type` (VARCHAR2(30)) - *New vs. Returning*
- `registration_date` (DATE)

#### 2. PRODUCTS Table
Catalog of products with pricing and cost information.
- `product_id` (NUMBER, Primary Key, Identity)
- `product_name` (VARCHAR2(100), NOT NULL)
- `category` (VARCHAR2(50)) - *Filter Dimension (Electronics, Furniture, Accessories)*
- `unit_price` (NUMBER(10,2))
- `cost_price` (NUMBER(10,2))

#### 3. ORDERS Table
Master header records for customer orders.
- `order_id` (NUMBER, Primary Key, Identity)
- `customer_id` (NUMBER, Foreign Key -> CUSTOMERS.customer_id)
- `order_date` (DATE, Indexed) - *Filter Dimension (YYYY-MM-DD)*
- `order_status` (VARCHAR2(30)) - *Completed, Pending, Cancelled*
- `payment_method` (VARCHAR2(30)) - *UPI, Card, Net Banking*

#### 4. ORDER_ITEMS Table
Line item breakdown for each order.
- `order_item_id` (NUMBER, Primary Key, Identity)
- `order_id` (NUMBER, Foreign Key -> ORDERS.order_id)
- `product_id` (NUMBER, Foreign Key -> PRODUCTS.product_id)
- `quantity` (NUMBER, NOT NULL)
- `unit_price` (NUMBER(10,2), NOT NULL)

---

## 3. Data Flow & Filter Processing Pipeline

1. **User Interaction**: User selects date bounds (`From`/`To`), `Region`, and/or `Category` on the React frontend and clicks **Apply Filter**.
2. **API Request**: Frontend constructs a query string (e.g. `?start_date=2026-01-01&end_date=2026-12-31&region=North&category=Electronics`) and issues concurrent asynchronous HTTP `GET` requests to FastAPI endpoints.
3. **Backend Filter Construction**: FastAPI routes delegate query building to `services/analytics.py`, which returns parameterized Oracle `WHERE` conditions and bind parameters (preventing SQL injection).
4. **Oracle Execution**: Oracle DB executes ANSI SQL queries with joins across `ORDERS`, `ORDER_ITEMS`, `CUSTOMERS`, and `PRODUCTS`, computing aggregate metrics (`SUM`, `COUNT DISTINCT`, `AVG`).
5. **JSON Response**: FastAPI serializes data rows into clean JSON responses.
6. **UI Rendering**: Recharts plots time-series and breakdown charts while data tables update smoothly without page reload.
