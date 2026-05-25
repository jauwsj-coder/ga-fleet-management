from __future__ import annotations

import os
import sqlite3
from pathlib import Path

import psycopg2
from psycopg2.extras import RealDictCursor

import app as ga_app


BASE_DIR = Path(__file__).resolve().parent
SQLITE_PATH = Path(os.environ.get("SQLITE_PATH", BASE_DIR / "ga_operations.db"))
RAW_DATABASE_URL = os.environ.get("DATABASE_URL", "").strip()
DATABASE_URL = RAW_DATABASE_URL
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
elif DATABASE_URL.startswith("postgresql+psycopg2://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql+psycopg2://", "postgresql://", 1)

TABLES = [
    "employees",
    "employee_roles",
    "drivers",
    "vehicles",
    "vehicle_maintenance_history",
    "trip_requests",
    "option_lists",
    "app_meta",
    "trip_edit_logs",
    "p2h_reports",
    "p2h_checklist_items",
    "p2h_attachments",
    "p2h_holidays",
    "p2h_workday_overrides",
]


def sqlite_tables(conn: sqlite3.Connection) -> set[str]:
    return {row["name"] for row in conn.execute("select name from sqlite_master where type = 'table'").fetchall()}


def sqlite_columns(conn: sqlite3.Connection, table: str) -> list[str]:
    return [row["name"] for row in conn.execute(f"pragma table_info({table})").fetchall()]


def pg_columns(conn, table: str) -> set[str]:
    with conn.cursor(cursor_factory=RealDictCursor) as cursor:
        cursor.execute(
            """
            select column_name
            from information_schema.columns
            where table_schema = 'public' and table_name = %s
            """,
            (table,),
        )
        return {row["column_name"] for row in cursor.fetchall()}


def reset_sequence(conn, table: str) -> None:
    if "id" not in pg_columns(conn, table):
        return
    with conn.cursor() as cursor:
        cursor.execute(
            f"select setval(pg_get_serial_sequence(%s, 'id'), coalesce((select max(id) from {table}), 1), true)",
            (table,),
        )


def migrate() -> None:
    if not DATABASE_URL:
        raise SystemExit("DATABASE_URL is required. Set it to your Railway PostgreSQL connection URL.")
    if not SQLITE_PATH.exists():
        raise SystemExit(f"SQLite source file not found: {SQLITE_PATH}")

    # Importing app creates the PostgreSQL schema through seed_data(); this is non-destructive.
    ga_app.seed_data()

    sqlite_conn = sqlite3.connect(SQLITE_PATH)
    sqlite_conn.row_factory = sqlite3.Row
    pg_conn = psycopg2.connect(DATABASE_URL)
    try:
        existing_sqlite_tables = sqlite_tables(sqlite_conn)
        migrated_tables: list[str] = []
        for table in TABLES:
            if table not in existing_sqlite_tables:
                continue
            source_columns = sqlite_columns(sqlite_conn, table)
            target_columns = pg_columns(pg_conn, table)
            columns = [column for column in source_columns if column in target_columns]
            if not columns:
                continue

            placeholders = ", ".join("%s" for _ in columns)
            column_sql = ", ".join(columns)
            rows = sqlite_conn.execute(f"select {column_sql} from {table}").fetchall()
            if not rows:
                continue

            with pg_conn.cursor() as cursor:
                for row in rows:
                    cursor.execute(
                        f"insert into {table} ({column_sql}) values ({placeholders}) on conflict do nothing",
                        tuple(row[column] for column in columns),
                    )
            migrated_tables.append(table)

        for table in migrated_tables:
            reset_sequence(pg_conn, table)
        pg_conn.commit()
        print("Migration completed.")
        print("Migrated tables:", ", ".join(migrated_tables) or "-")
    except Exception:
        pg_conn.rollback()
        raise
    finally:
        sqlite_conn.close()
        pg_conn.close()


if __name__ == "__main__":
    migrate()
