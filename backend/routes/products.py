from fastapi import APIRouter, Query
from typing import Optional
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import get_connection

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("")
def get_products(
    category: Optional[str] = Query(None),
):
    connection = get_connection()
    cursor = connection.cursor()

    conditions = []
    params = {}

    if category:
        conditions.append("p.category = :category")
        params["category"] = category

    where_clause = " WHERE " + " AND ".join(conditions) if conditions else ""

    query = f"""
        SELECT
            p.product_id,
            p.product_name,
            p.category,
            p.unit_price,
            p.cost_price,
            NVL(SUM(oi.quantity), 0) AS units_sold,
            NVL(SUM(oi.quantity * oi.unit_price), 0) AS total_revenue
        FROM products p
        LEFT JOIN order_items oi ON p.product_id = oi.product_id
        LEFT JOIN orders o ON oi.order_id = o.order_id AND o.order_status = 'Completed'
        {where_clause}
        GROUP BY
            p.product_id,
            p.product_name,
            p.category,
            p.unit_price,
            p.cost_price
        ORDER BY p.product_id
    """

    cursor.execute(query, params)
    rows = cursor.fetchall()

    result = [
        {
            "product_id": row[0],
            "product_name": row[1],
            "category": row[2],
            "unit_price": float(row[3]),
            "cost_price": float(row[4]),
            "units_sold": int(row[5]),
            "total_revenue": float(row[6])
        }
        for row in rows
    ]

    cursor.close()
    connection.close()
    return result
