from fastapi import APIRouter, Query
from typing import Optional, List, Dict, Any
import sys
import os

# Add parent directory to sys.path to allow relative imports when running via uvicorn
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import get_connection
from services.analytics import build_filter_clause, calculate_period_dates

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary")
def get_dashboard_summary(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    region: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
):
    connection = get_connection()
    cursor = connection.cursor()

    where_clause, params = build_filter_clause(
        start_date=start_date,
        end_date=end_date,
        region=region,
        category=category,
        completed_only=True
    )

    query = f"""
        SELECT
            NVL(SUM(oi.quantity * oi.unit_price), 0) AS total_revenue,
            COUNT(DISTINCT o.order_id) AS total_orders,
            COUNT(DISTINCT o.customer_id) AS total_customers,
            COUNT(DISTINCT oi.product_id) AS total_products,
            NVL(
                SUM(oi.quantity * oi.unit_price) /
                NULLIF(COUNT(DISTINCT o.order_id), 0),
                0
            ) AS average_order_value
        FROM orders o
        JOIN order_items oi ON o.order_id = oi.order_id
        JOIN customers c ON o.customer_id = c.customer_id
        JOIN products p ON oi.product_id = p.product_id
        WHERE {where_clause}
    """

    cursor.execute(query, params)
    row = cursor.fetchone()

    result = {
        "total_revenue": round(float(row[0]), 2),
        "total_orders": int(row[1]),
        "total_customers": int(row[2]),
        "total_products": int(row[3]),
        "average_order_value": round(float(row[4]), 2)
    }

    cursor.close()
    connection.close()
    return result


@router.get("/monthly-revenue")
def get_monthly_revenue(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    region: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
):
    connection = get_connection()
    cursor = connection.cursor()

    where_clause, params = build_filter_clause(
        start_date=start_date,
        end_date=end_date,
        region=region,
        category=category,
        completed_only=True
    )

    query = f"""
        SELECT
            TO_CHAR(o.order_date, 'YYYY-MM') AS month,
            SUM(oi.quantity * oi.unit_price) AS revenue
        FROM orders o
        JOIN order_items oi ON o.order_id = oi.order_id
        JOIN customers c ON o.customer_id = c.customer_id
        JOIN products p ON oi.product_id = p.product_id
        WHERE {where_clause}
        GROUP BY TO_CHAR(o.order_date, 'YYYY-MM')
        ORDER BY month
    """

    cursor.execute(query, params)
    rows = cursor.fetchall()

    result = [
        {"month": row[0], "revenue": float(row[1])}
        for row in rows
    ]

    cursor.close()
    connection.close()
    return result


@router.get("/daily-revenue")
def get_daily_revenue(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    region: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
):
    connection = get_connection()
    cursor = connection.cursor()

    where_clause, params = build_filter_clause(
        start_date=start_date,
        end_date=end_date,
        region=region,
        category=category,
        completed_only=True
    )

    query = f"""
        SELECT
            TO_CHAR(o.order_date, 'YYYY-MM-DD') AS day,
            SUM(oi.quantity * oi.unit_price) AS revenue
        FROM orders o
        JOIN order_items oi ON o.order_id = oi.order_id
        JOIN customers c ON o.customer_id = c.customer_id
        JOIN products p ON oi.product_id = p.product_id
        WHERE {where_clause}
        GROUP BY TO_CHAR(o.order_date, 'YYYY-MM-DD')
        ORDER BY day
    """

    cursor.execute(query, params)
    rows = cursor.fetchall()

    result = [
        {"day": row[0], "revenue": float(row[1])}
        for row in rows
    ]

    cursor.close()
    connection.close()
    return result


@router.get("/annual-revenue")
def get_annual_revenue(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    region: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
):
    connection = get_connection()
    cursor = connection.cursor()

    where_clause, params = build_filter_clause(
        start_date=start_date,
        end_date=end_date,
        region=region,
        category=category,
        completed_only=True
    )

    query = f"""
        SELECT
            TO_CHAR(o.order_date, 'YYYY') AS year,
            SUM(oi.quantity * oi.unit_price) AS revenue
        FROM orders o
        JOIN order_items oi ON o.order_id = oi.order_id
        JOIN customers c ON o.customer_id = c.customer_id
        JOIN products p ON oi.product_id = p.product_id
        WHERE {where_clause}
        GROUP BY TO_CHAR(o.order_date, 'YYYY')
        ORDER BY year
    """

    cursor.execute(query, params)
    rows = cursor.fetchall()

    result = [
        {"year": row[0], "revenue": float(row[1])}
        for row in rows
    ]

    cursor.close()
    connection.close()
    return result


@router.get("/category-revenue")
def get_category_revenue(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    region: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
):
    connection = get_connection()
    cursor = connection.cursor()

    where_clause, params = build_filter_clause(
        start_date=start_date,
        end_date=end_date,
        region=region,
        category=category,
        completed_only=True
    )

    query = f"""
        SELECT
            p.category,
            SUM(oi.quantity * oi.unit_price) AS revenue
        FROM orders o
        JOIN order_items oi ON o.order_id = oi.order_id
        JOIN customers c ON o.customer_id = c.customer_id
        JOIN products p ON oi.product_id = p.product_id
        WHERE {where_clause}
        GROUP BY p.category
        ORDER BY revenue DESC
    """

    cursor.execute(query, params)
    rows = cursor.fetchall()

    result = [
        {"category": row[0], "revenue": float(row[1])}
        for row in rows
    ]

    cursor.close()
    connection.close()
    return result


@router.get("/region-revenue")
def get_region_revenue(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    region: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
):
    connection = get_connection()
    cursor = connection.cursor()

    where_clause, params = build_filter_clause(
        start_date=start_date,
        end_date=end_date,
        region=region,
        category=category,
        completed_only=True
    )

    query = f"""
        SELECT
            c.region,
            SUM(oi.quantity * oi.unit_price) AS revenue
        FROM orders o
        JOIN order_items oi ON o.order_id = oi.order_id
        JOIN customers c ON o.customer_id = c.customer_id
        JOIN products p ON oi.product_id = p.product_id
        WHERE {where_clause}
        GROUP BY c.region
        ORDER BY revenue DESC
    """

    cursor.execute(query, params)
    rows = cursor.fetchall()

    result = [
        {"region": row[0], "revenue": float(row[1])}
        for row in rows
    ]

    cursor.close()
    connection.close()
    return result


@router.get("/order-status")
def get_order_status(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    region: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
):
    connection = get_connection()
    cursor = connection.cursor()

    where_clause, params = build_filter_clause(
        start_date=start_date,
        end_date=end_date,
        region=region,
        category=category,
        completed_only=False
    )

    query = f"""
        SELECT
            o.order_status,
            COUNT(DISTINCT o.order_id) AS count
        FROM orders o
        JOIN customers c ON o.customer_id = c.customer_id
        LEFT JOIN order_items oi ON o.order_id = oi.order_id
        LEFT JOIN products p ON oi.product_id = p.product_id
        WHERE {where_clause}
        GROUP BY o.order_status
    """

    cursor.execute(query, params)
    rows = cursor.fetchall()
    
    status_counts = {"Completed": 0, "Pending": 0, "Cancelled": 0}
    for row in rows:
        status_name = row[0]
        if status_name in status_counts:
            status_counts[status_name] = int(row[1])
        else:
            status_counts[status_name] = int(row[1])

    result = [
        {"status": k, "count": v}
        for k, v in status_counts.items()
    ]

    cursor.close()
    connection.close()
    return result


@router.get("/top-products")
def get_top_products(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    region: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    limit: int = Query(5, ge=1, le=50)
):
    connection = get_connection()
    cursor = connection.cursor()

    where_clause, params = build_filter_clause(
        start_date=start_date,
        end_date=end_date,
        region=region,
        category=category,
        completed_only=True
    )
    params["limit_val"] = limit

    query = f"""
        SELECT * FROM (
            SELECT
                p.product_name,
                p.category,
                SUM(oi.quantity) AS units_sold,
                SUM(oi.quantity * oi.unit_price) AS revenue
            FROM orders o
            JOIN order_items oi ON o.order_id = oi.order_id
            JOIN customers c ON o.customer_id = c.customer_id
            JOIN products p ON oi.product_id = p.product_id
            WHERE {where_clause}
            GROUP BY p.product_name, p.category
            ORDER BY revenue DESC
        ) WHERE ROWNUM <= :limit_val
    """

    cursor.execute(query, params)
    rows = cursor.fetchall()

    result = [
        {
            "product_name": row[0],
            "category": row[1],
            "units_sold": int(row[2]),
            "revenue": float(row[3])
        }
        for row in rows
    ]

    cursor.close()
    connection.close()
    return result


@router.get("/top-customers")
def get_top_customers(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    region: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    limit: int = Query(5, ge=1, le=50)
):
    connection = get_connection()
    cursor = connection.cursor()

    where_clause, params = build_filter_clause(
        start_date=start_date,
        end_date=end_date,
        region=region,
        category=category,
        completed_only=True
    )
    params["limit_val"] = limit

    query = f"""
        SELECT * FROM (
            SELECT
                c.customer_name,
                c.region,
                COUNT(DISTINCT o.order_id) AS number_of_orders,
                SUM(oi.quantity * oi.unit_price) AS revenue
            FROM orders o
            JOIN order_items oi ON o.order_id = oi.order_id
            JOIN customers c ON o.customer_id = c.customer_id
            JOIN products p ON oi.product_id = p.product_id
            WHERE {where_clause}
            GROUP BY c.customer_name, c.region
            ORDER BY revenue DESC
        ) WHERE ROWNUM <= :limit_val
    """

    cursor.execute(query, params)
    rows = cursor.fetchall()

    result = [
        {
            "customer_name": row[0],
            "region": row[1],
            "number_of_orders": int(row[2]),
            "revenue": float(row[3])
        }
        for row in rows
    ]

    cursor.close()
    connection.close()
    return result


@router.get("/revenue-growth")
def get_revenue_growth(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    region: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
):
    connection = get_connection()
    cursor = connection.cursor()

    # Current revenue
    where_curr, params_curr = build_filter_clause(
        start_date=start_date, end_date=end_date, region=region, category=category
    )
    query_curr = f"""
        SELECT NVL(SUM(oi.quantity * oi.unit_price), 0)
        FROM orders o
        JOIN order_items oi ON o.order_id = oi.order_id
        JOIN customers c ON o.customer_id = c.customer_id
        JOIN products p ON oi.product_id = p.product_id
        WHERE {where_curr}
    """
    cursor.execute(query_curr, params_curr)
    curr_revenue = float(cursor.fetchone()[0])

    growth_percentage = None
    prev_revenue = 0.0

    if start_date and end_date:
        prev_start, prev_end = calculate_period_dates(start_date, end_date)
        where_prev, params_prev = build_filter_clause(
            start_date=prev_start, end_date=prev_end, region=region, category=category
        )
        query_prev = f"""
            SELECT NVL(SUM(oi.quantity * oi.unit_price), 0)
            FROM orders o
            JOIN order_items oi ON o.order_id = oi.order_id
            JOIN customers c ON o.customer_id = c.customer_id
            JOIN products p ON oi.product_id = p.product_id
            WHERE {where_prev}
        """
        cursor.execute(query_prev, params_prev)
        prev_revenue = float(cursor.fetchone()[0])

        if prev_revenue > 0:
            growth_percentage = round(((curr_revenue - prev_revenue) / prev_revenue) * 100, 1)
    else:
        # Month over Month comparison based on overall data
        query_months = f"""
            SELECT TO_CHAR(o.order_date, 'YYYY-MM') AS m, SUM(oi.quantity * oi.unit_price)
            FROM orders o
            JOIN order_items oi ON o.order_id = oi.order_id
            JOIN customers c ON o.customer_id = c.customer_id
            JOIN products p ON oi.product_id = p.product_id
            WHERE {where_curr}
            GROUP BY TO_CHAR(o.order_date, 'YYYY-MM')
            ORDER BY m DESC
        """
        cursor.execute(query_months, params_curr)
        month_rows = cursor.fetchall()
        if len(month_rows) >= 2:
            latest_m_rev = float(month_rows[0][1])
            prev_m_rev = float(month_rows[1][1])
            if prev_m_rev > 0:
                growth_percentage = round(((latest_m_rev - prev_m_rev) / prev_m_rev) * 100, 1)
                prev_revenue = prev_m_rev

    cursor.close()
    connection.close()

    return {
        "growth_percentage": growth_percentage,
        "current_revenue": curr_revenue,
        "previous_revenue": prev_revenue
    }


@router.get("/regions")
def get_regions():
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("""
        SELECT DISTINCT region
        FROM customers
        WHERE region IS NOT NULL
        ORDER BY region
    """)
    regions = [row[0] for row in cursor.fetchall()]
    cursor.close()
    connection.close()
    return regions


@router.get("/categories")
def get_categories():
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("""
        SELECT DISTINCT category
        FROM products
        WHERE category IS NOT NULL
        ORDER BY category
    """)
    categories = [row[0] for row in cursor.fetchall()]
    cursor.close()
    connection.close()
    return categories
