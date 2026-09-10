from fastapi import APIRouter, Query
from typing import Optional
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import get_connection

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.get("")
def get_orders(
    status: Optional[str] = Query(None),
    region: Optional[str] = Query(None),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None)
):
    connection = get_connection()
    cursor = connection.cursor()

    conditions = []
    params = {}

    if status:
        conditions.append("o.order_status = :status")
        params["status"] = status

    if region:
        conditions.append("c.region = :region")
        params["region"] = region

    if start_date:
        conditions.append("TRUNC(o.order_date) >= TO_DATE(:start_date, 'YYYY-MM-DD')")
        params["start_date"] = start_date

    if end_date:
        conditions.append("TRUNC(o.order_date) <= TO_DATE(:end_date, 'YYYY-MM-DD')")
        params["end_date"] = end_date

    where_clause = " WHERE " + " AND ".join(conditions) if conditions else ""

    query = f"""
        SELECT
            o.order_id,
            c.customer_name,
            c.region,
            TO_CHAR(o.order_date, 'YYYY-MM-DD') AS order_date,
            o.order_status,
            o.payment_method,
            COUNT(oi.order_item_id) AS items_count,
            NVL(SUM(oi.quantity * oi.unit_price), 0) AS total_amount
        FROM orders o
        JOIN customers c ON o.customer_id = c.customer_id
        LEFT JOIN order_items oi ON o.order_id = oi.order_id
        {where_clause}
        GROUP BY
            o.order_id,
            c.customer_name,
            c.region,
            o.order_date,
            o.order_status,
            o.payment_method
        ORDER BY o.order_date DESC, o.order_id DESC
    """

    cursor.execute(query, params)
    rows = cursor.fetchall()

    result = [
        {
            "order_id": row[0],
            "customer_name": row[1],
            "region": row[2],
            "order_date": row[3],
            "order_status": row[4],
            "payment_method": row[5],
            "items_count": int(row[6]),
            "total_amount": float(row[7])
        }
        for row in rows
    ]

    cursor.close()
    connection.close()
    return result
