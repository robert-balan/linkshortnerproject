#!/usr/bin/env python3
"""
plot_links.py — Part of the link-chart skill.

Queries the short_links table for the past 12 months, counts links created per
calendar month, and exports a bar chart as a PNG image.
"""

import argparse
import os
import sys
from datetime import datetime, timezone
from pathlib import Path


def load_env(env_path: str) -> dict:
    """Parse a .env file and return a dict of key-value pairs."""
    env_vars = {}
    path = Path(env_path)
    if not path.exists():
        sys.exit(f"ERROR: .env file not found at '{env_path}'")
    with open(path) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, _, value = line.partition("=")
            # Strip optional surrounding quotes
            value = value.strip().strip('"').strip("'")
            env_vars[key.strip()] = value
    return env_vars


def query_monthly_counts(database_url: str) -> list[tuple[str, int]]:
    """
    Connect to PostgreSQL and return a list of (month_label, count) tuples for
    the past 12 calendar months, ordered oldest → newest.
    """
    try:
        import psycopg2
    except ImportError:
        sys.exit(
            "ERROR: psycopg2 is not installed. Run:\n"
            "  pip install psycopg2-binary"
        )

    sql = """
        SELECT
            TO_CHAR(DATE_TRUNC('month', created_at AT TIME ZONE 'UTC'), 'Mon YYYY') AS month_label,
            DATE_TRUNC('month', created_at AT TIME ZONE 'UTC')                      AS month_start,
            COUNT(*)                                                                 AS total
        FROM short_links
        WHERE created_at >= DATE_TRUNC('month', NOW() AT TIME ZONE 'UTC')
                            - INTERVAL '11 months'
        GROUP BY month_start, month_label
        ORDER BY month_start ASC;
    """

    conn = None
    try:
        conn = psycopg2.connect(database_url)
        with conn.cursor() as cur:
            cur.execute(sql)
            rows = cur.fetchall()
    except psycopg2.OperationalError as exc:
        sys.exit(f"ERROR: Could not connect to the database.\n{exc}")
    finally:
        if conn:
            conn.close()

    # rows: [(month_label, month_start, total), ...]
    return [(row[0], int(row[2])) for row in rows]


def fill_missing_months(data: list[tuple[str, int]]) -> list[tuple[str, int]]:
    """
    Ensure all 12 months are present in the result, inserting zero-count months
    where the database returned no rows (e.g. months with no links created).
    """
    from datetime import date
    import calendar

    now = datetime.now(timezone.utc)
    months = []
    for offset in range(11, -1, -1):
        # Calculate year/month going back from current month
        month = now.month - offset
        year = now.year
        while month <= 0:
            month += 12
            year -= 1
        label = date(year, month, 1).strftime("%b %Y")
        months.append(label)

    # Build a lookup from what the DB returned
    db_lookup = {label: count for label, count in data}
    return [(m, db_lookup.get(m, 0)) for m in months]


def plot_chart(data: list[tuple[str, int]], output_path: str) -> None:
    """Render the bar chart and save it as a PNG."""
    try:
        import matplotlib
        matplotlib.use("Agg")  # Non-interactive backend — no display needed
        import matplotlib.pyplot as plt
    except ImportError:
        sys.exit(
            "ERROR: matplotlib is not installed. Run:\n"
            "  pip install matplotlib"
        )

    labels = [row[0] for row in data]
    counts = [row[1] for row in data]

    fig, ax = plt.subplots(figsize=(14, 6))

    bars = ax.bar(labels, counts, color="#4F81BD", edgecolor="#2E4D7B", width=0.6)

    # Annotate each bar with its count
    for bar, count in zip(bars, counts):
        if count > 0:
            ax.text(
                bar.get_x() + bar.get_width() / 2,
                bar.get_height() + max(counts) * 0.01,
                str(count),
                ha="center",
                va="bottom",
                fontsize=9,
                color="#333333",
            )

    ax.set_xlabel("Month", fontsize=12, labelpad=8)
    ax.set_ylabel("Links Created", fontsize=12, labelpad=8)
    ax.set_title("Short Links Created — Past 12 Months", fontsize=14, fontweight="bold", pad=14)
    ax.set_ylim(0, max(counts) * 1.15 if max(counts) > 0 else 10)
    ax.yaxis.get_major_locator().set_params(integer=True)
    plt.xticks(rotation=30, ha="right", fontsize=9)
    plt.tight_layout()

    out = Path(output_path)
    out.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(out, dpi=150, bbox_inches="tight")
    plt.close(fig)
    print(f"Chart saved to: {out.resolve()}")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Plot monthly short-link creation counts as a bar chart PNG."
    )
    parser.add_argument(
        "--output",
        default="link-chart.png",
        help="Output PNG file path (default: link-chart.png)",
    )
    parser.add_argument(
        "--env",
        default=".env",
        help="Path to the .env file (default: .env)",
    )
    args = parser.parse_args()

    # 1. Load env
    env = load_env(args.env)
    database_url = env.get("DATABASE_URL") or os.environ.get("DATABASE_URL")
    if not database_url:
        sys.exit(
            "ERROR: DATABASE_URL not found in the .env file or environment variables."
        )

    # 2. Query DB
    print("Querying database...")
    raw_data = query_monthly_counts(database_url)

    # 3. Fill any months with no data
    data = fill_missing_months(raw_data)

    # 4. Plot
    print("Rendering chart...")
    plot_chart(data, args.output)


if __name__ == "__main__":
    main()
