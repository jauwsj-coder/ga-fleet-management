from __future__ import annotations

import argparse
import os
import sqlite3
from pathlib import Path

try:
    import psycopg2
except ImportError:
    psycopg2 = None


BASE_DIR = Path(__file__).resolve().parent
SQLITE_PATH = BASE_DIR / "ga_operations.db"
RAW_DATABASE_URL = os.environ.get("DATABASE_URL", "").strip()
DATABASE_URL = RAW_DATABASE_URL
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

TRANSACTION_TABLES = [
    "p2h_attachments",
    "p2h_checklist_items",
    "p2h_reports",
    "vehicle_maintenance_history",
    "trip_edit_logs",
    "trip_requests",
]

MASTER_TABLES_NEVER_TOUCH = {
    "employees",
    "employee_roles",
    "users",
    "roles",
    "drivers",
    "vehicles",
    "option_lists",
    "departments",
    "positions",
}


def sqlite_tables(conn: sqlite3.Connection) -> set[str]:
    return {row[0] for row in conn.execute("select name from sqlite_master where type = 'table'").fetchall()}


def postgres_tables(conn) -> set[str]:
    with conn.cursor() as cursor:
        cursor.execute(
            """
            select table_name
            from information_schema.tables
            where table_schema = 'public' and table_type = 'BASE TABLE'
            """
        )
        return {row[0] for row in cursor.fetchall()}


def reset_sqlite() -> list[tuple[str, int]]:
    if not SQLITE_PATH.exists():
        raise FileNotFoundError(f"SQLite database not found: {SQLITE_PATH}")
    conn = sqlite3.connect(SQLITE_PATH)
    try:
        existing = sqlite_tables(conn)
        cleared: list[tuple[str, int]] = []
        for table in TRANSACTION_TABLES:
            if table not in existing or table in MASTER_TABLES_NEVER_TOUCH:
                continue
            cursor = conn.execute(f"delete from {table}")
            cleared.append((table, cursor.rowcount))
        conn.commit()
        return cleared
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def reset_postgres() -> list[tuple[str, int]]:
    if psycopg2 is None:
        raise RuntimeError("psycopg2-binary is required for PostgreSQL reset.")
    if not DATABASE_URL:
        raise RuntimeError("DATABASE_URL is required for PostgreSQL reset.")
    conn = psycopg2.connect(DATABASE_URL)
    try:
        existing = postgres_tables(conn)
        cleared: list[tuple[str, int]] = []
        with conn.cursor() as cursor:
            for table in TRANSACTION_TABLES:
                if table not in existing or table in MASTER_TABLES_NEVER_TOUCH:
                    continue
                cursor.execute(f"delete from {table}")
                cleared.append((table, cursor.rowcount))
        conn.commit()
        return cleared
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def main() -> None:
    parser = argparse.ArgumentParser(description="Safely reset GA Operations transaction/testing data only.")
    parser.add_argument("--confirm", choices=["yes"], required=True, help="Required safety confirmation.")
    parser.add_argument("--database", choices=["auto", "postgres", "sqlite"], default="auto")
    args = parser.parse_args()

    if args.database == "postgres" or (args.database == "auto" and DATABASE_URL):
        cleared = reset_postgres()
        target = "PostgreSQL"
    else:
        cleared = reset_sqlite()
        target = "SQLite"

    print(f"Operational reset completed on {target}.")
    print("Master employee/user/login/role tables were not touched.")
    for table, rowcount in cleared:
        print(f"- {table}: {rowcount} row(s) deleted")


if __name__ == "__main__":
    main()
