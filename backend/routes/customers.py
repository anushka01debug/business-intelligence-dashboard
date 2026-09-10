from fastapi import APIRouter, Query
from typing import Optional
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import get_connection

router = APIRouter(tags=["Customers"])


@router.get("/customers")
def get_customers(
    region: Optional[str] = Query(None),
):
    connection = get_connection()
    cursor = connection.cursor()

    conditions = []
    params = {}

    if region:
        conditions.append("c.region = :region")
        params["region"] = region

    where_clause = " WHERE " + " AND ".join(conditions) if conditions else ""

    query = f"""
        SELECT
            c.customer_id,
            c.customer_name,
            c.email,
            c.city,
            c.region,
            c.customer_type,
            TO_CHAR(c.registration_date, 'YYYY-MM-DD') AS registration_date,
            COUNT(DISTINCT o.order_id) AS total_orders,
            NVL(SUM(oi.quantity * oi.unit_price), 0) AS total_spent
        FROM customers c
        LEFT JOIN orders o ON c.customer_id = o.customer_id AND o.order_status = 'Completed'
        LEFT JOIN order_items oi ON o.order_id = oi.order_id
        {where_clause}
        GROUP BY
            c.customer_id,
            c.customer_name,
            c.email,
            c.city,
            c.region,
            c.customer_type,
            c.registration_date
        ORDER BY c.customer_id
    """

    cursor.execute(query, params)
    rows = cursor.fetchall()

    result = [
        {
            "customer_id": row[0],
            "customer_name": row[1],
            "email": row[2],
            "city": row[3],
            "region": row[4],
            "customer_type": row[5],
            "registration_date": row[6],
            "total_orders": int(row[7]),
            "total_spent": float(row[8])
        }
        for row in rows
    ]

    cursor.close()
    connection.close()
    return result
