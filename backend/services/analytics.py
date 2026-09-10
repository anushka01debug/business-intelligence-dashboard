from datetime import datetime, timedelta
from typing import Optional, Dict, Tuple, Any

def build_filter_clause(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    region: Optional[str] = None,
    category: Optional[str] = None,
    completed_only: bool = True
) -> Tuple[str, Dict[str, Any]]:
    """
    Constructs a SQL WHERE clause fragment and parameter dictionary
    for Oracle DB queries joining orders (o), order_items (oi),
    customers (c), and products (p).
    """
    conditions = []
    params = {}

    if completed_only:
        conditions.append("o.order_status = 'Completed'")

    if start_date:
        conditions.append("TRUNC(o.order_date) >= TO_DATE(:start_date, 'YYYY-MM-DD')")
        params["start_date"] = start_date

    if end_date:
        conditions.append("TRUNC(o.order_date) <= TO_DATE(:end_date, 'YYYY-MM-DD')")
        params["end_date"] = end_date

    if region:
        conditions.append("c.region = :region")
        params["region"] = region

    if category:
        conditions.append("p.category = :category")
        params["category"] = category

    where_clause = " AND ".join(conditions) if conditions else "1=1"
    return where_clause, params


def calculate_period_dates(start_date_str: str, end_date_str: str) -> Tuple[str, str]:
    """
    Calculates the previous period start and end dates of equal duration.
    """
    start_dt = datetime.strptime(start_date_str, "%Y-%m-%d")
    end_dt = datetime.strptime(end_date_str, "%Y-%m-%d")
    
    duration = (end_dt - start_dt).days + 1
    
    prev_end_dt = start_dt - timedelta(days=1)
    prev_start_dt = prev_end_dt - timedelta(days=duration - 1)
    
    return prev_start_dt.strftime("%Y-%m-%d"), prev_end_dt.strftime("%Y-%m-%d")
