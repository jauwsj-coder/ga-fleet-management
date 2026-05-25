from __future__ import annotations

import io
import logging
import json
import os
import sqlite3
from datetime import datetime, timedelta
from pathlib import Path

from flask import Flask, jsonify, redirect, render_template, request, send_file, send_from_directory, session, url_for
from openpyxl import Workbook, load_workbook
from werkzeug.utils import secure_filename


BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "ga_operations.db"
REVIEW_PROOF_DIR = BASE_DIR / "uploads" / "review_follow_up"

app = Flask(__name__)
app.secret_key = "ga-operations-local-dev"

logging.basicConfig(level=logging.DEBUG, format="%(levelname)s:%(name)s:%(message)s")
logger = logging.getLogger(__name__)


STATUS_PENDING = "pending_leader_approval"
STATUS_REJECTED = "rejected"
STATUS_APPROVED = "approved"
STATUS_PROCESSING = "processing_ga"
STATUS_ASSIGNED = "assigned"
STATUS_ON_TRIP = "on_trip"
STATUS_COMPLETED = "completed"
STATUS_REVIEWED = "reviewed"
STATUS_CANCELED = "canceled"
EDITABLE_BOOKING_STATUSES = {STATUS_PENDING, STATUS_REJECTED}
ACTIVE_BOOKING_STATUSES = {STATUS_PENDING, STATUS_APPROVED, STATUS_PROCESSING, STATUS_ASSIGNED, STATUS_ON_TRIP}

STATUS_ALIASES = {
    "pending": STATUS_PENDING,
    "pending leader approval": STATUS_PENDING,
    "pending_leader_approval": STATUS_PENDING,
    "PENDING LEADER APPROVAL": STATUS_PENDING,
    "Pending Leader Approval": STATUS_PENDING,
    "approved": STATUS_APPROVED,
    "approved by leader": STATUS_APPROVED,
    "APPROVED BY LEADER": STATUS_APPROVED,
    "Approved": STATUS_APPROVED,
    "rejected": STATUS_REJECTED,
    "REJECTED": STATUS_REJECTED,
    "processing ga": STATUS_PROCESSING,
    "processing_ga": STATUS_PROCESSING,
    "PROCESSING GA": STATUS_PROCESSING,
    "assigned": STATUS_ASSIGNED,
    "assigned to driver": STATUS_ASSIGNED,
    "ASSIGNED TO DRIVER": STATUS_ASSIGNED,
    "on trip": STATUS_ON_TRIP,
    "on_trip": STATUS_ON_TRIP,
    "ON TRIP": STATUS_ON_TRIP,
    "completed": STATUS_COMPLETED,
    "COMPLETED": STATUS_COMPLETED,
    "reviewed": STATUS_REVIEWED,
    "canceled": STATUS_CANCELED,
    "cancelled": STATUS_CANCELED,
}

ROLE_LABELS = {
    "user": "User",
    "pimpinan": "Pimpinan",
    "ga_admin": "GA Admin",
    "driver": "Driver",
    "super_admin": "Super Admin GA",
}

DEFAULT_POSITION_OPTIONS = [
    "Direktur HRGA",
    "Manager Finance",
    "Manager GA",
    "Manager Marketing",
    "Manager Procurement",
]

DEFAULT_DEPARTMENT_OPTIONS = [
    "Finance",
    "HRGA",
    "Marketing",
    "Operasional",
    "Procurement",
]

MAINTENANCE_REFERENCE_DEFAULTS = {
    "toyota": "https://toyotaastrido.co.id/servis-mobil/service-berkala/",
    "honda": "https://www.honda-indonesia.com/aftersales/costs",
    "suzuki": "https://www.suzuki.co.id/services/automobile",
}


def db() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def rows(query: str, params: tuple = ()) -> list[dict]:
    with db() as conn:
        return [dict(row) for row in conn.execute(query, params).fetchall()]


def row(query: str, params: tuple = ()) -> dict | None:
    with db() as conn:
        found = conn.execute(query, params).fetchone()
        return dict(found) if found else None


def execute(query: str, params: tuple = ()) -> None:
    with db() as conn:
        conn.execute(query, params)
        conn.commit()


def wants_json() -> bool:
    return request.headers.get("X-Requested-With") == "fetch" or "application/json" in request.headers.get("Accept", "")


def ok_response(tab: str = "dashboard", message: str = "OK"):
    if wants_json():
        return jsonify({"ok": True, "success": True, "message": message})
    return redirect(url_for("index", tab=tab))


def error_response(message: str, tab: str = "dashboard", status_code: int = 400):
    if wants_json():
        return jsonify({"ok": False, "success": False, "message": message}), status_code
    return redirect(url_for("index", tab=tab, error=message))


def cutoff_date() -> str:
    return (datetime.now().date() - timedelta(days=92)).isoformat()


def table_columns(conn: sqlite3.Connection, table_name: str) -> set[str]:
    return {item["name"] for item in conn.execute(f"pragma table_info({table_name})").fetchall()}


def add_column_if_missing(conn: sqlite3.Connection, table_name: str, column_name: str, definition: str) -> None:
    if column_name not in table_columns(conn, table_name):
        conn.execute(f"alter table {table_name} add column {column_name} {definition}")


def cleanup_old_review_proofs(conn: sqlite3.Connection) -> None:
    cutoff = (datetime.now() - timedelta(days=365)).isoformat(timespec="seconds")
    old_files = conn.execute(
        """
        select id, review_proof_file
        from trip_requests
        where review_proof_uploaded_at is not null
          and review_proof_uploaded_at < ?
        """,
        (cutoff,),
    ).fetchall()
    for item in old_files:
        filename = item["review_proof_file"]
        if filename:
            path = REVIEW_PROOF_DIR / filename
            if path.exists():
                try:
                    path.unlink()
                except OSError:
                    logger.exception("Failed deleting old review proof file id=%s file=%s", item["id"], filename)
        conn.execute(
            """
            update trip_requests
            set review_proof_file = null,
                review_proof_original_name = null,
                review_proof_uploaded_at = null
            where id = ?
            """,
            (item["id"],),
        )


def parse_money(value: str | int | None) -> int:
    if value is None:
        return 0
    digits = "".join(ch for ch in str(value) if ch.isdigit())
    return int(digits or 0)


def current_language() -> str:
    return session.get("language", "id")


def status_label(status: str, lang: str | None = None) -> str:
    lang = lang or current_language()
    status = canonical_status(status)
    labels = {
        "id": {
            STATUS_PENDING: "Menunggu Persetujuan Pimpinan",
            STATUS_REJECTED: "Ditolak",
            STATUS_APPROVED: "Disetujui Pimpinan",
            STATUS_PROCESSING: "Diproses GA",
            STATUS_ASSIGNED: "Ditugaskan ke Driver",
            STATUS_ON_TRIP: "Dalam Perjalanan",
            STATUS_COMPLETED: "Selesai",
            STATUS_REVIEWED: "Sudah Direview",
            STATUS_CANCELED: "Dibatalkan",
        },
        "en": {
            STATUS_PENDING: "Pending Leader Approval",
            STATUS_REJECTED: "Rejected",
            STATUS_APPROVED: "Approved by Leader",
            STATUS_PROCESSING: "Processing by GA",
            STATUS_ASSIGNED: "Assigned to Driver",
            STATUS_ON_TRIP: "On Trip",
            STATUS_COMPLETED: "Completed",
            STATUS_REVIEWED: "Reviewed",
            STATUS_CANCELED: "Canceled",
        },
    }
    return labels.get(lang, labels["id"]).get(status, status)


def canonical_status(status: str | None) -> str:
    if not status:
        return ""
    raw = str(status).strip()
    return STATUS_ALIASES.get(raw, STATUS_ALIASES.get(raw.lower(), raw.lower().replace(" ", "_")))


def normalize_roles(raw_roles) -> set[str]:
    if raw_roles is None:
        return set()
    if isinstance(raw_roles, (list, tuple, set)):
        items = raw_roles
    else:
        text = str(raw_roles).strip()
        try:
            parsed = json.loads(text)
            items = parsed if isinstance(parsed, list) else [parsed]
        except Exception:
            items = text.replace(";", ",").split(",")
    return {str(role).strip().lower().replace(" ", "_") for role in items if str(role).strip()}


def option_values(kind: str) -> list[str]:
    return [
        item["value"]
        for item in rows(
            "select value from option_lists where kind = ? order by lower(value)",
            (kind,),
        )
    ]


def add_option_value(kind: str, value: str) -> str:
    cleaned = " ".join(value.strip().split())
    if not cleaned:
        return ""
    execute(
        "insert or ignore into option_lists (kind, value) values (?, ?)",
        (kind, cleaned),
    )
    return cleaned


def redirect_employee_tab():
    return redirect(url_for("index", tab="employees"))


def redirect_employee_error(message: str):
    return redirect(url_for("index", tab="employees", error=message))


def sync_driver_record(conn: sqlite3.Connection, nik: str, full_name: str, position: str, phone: str, roles: list[str]) -> None:
    existing = conn.execute("select id from drivers where nik = ?", (nik,)).fetchone()
    if "driver" in roles:
        if existing:
            conn.execute(
                "update drivers set driver_name = ?, position = ?, phone = ?, status = 'ACTIVE' where nik = ?",
                (full_name, position, phone, nik),
            )
        else:
            conn.execute(
                "insert into drivers (nik, driver_name, position, phone, status) values (?, ?, ?, ?, 'ACTIVE')",
                (nik, full_name, position, phone),
            )
    elif existing:
        conn.execute("update drivers set status = 'INACTIVE' where nik = ?", (nik,))


def roles_for(nik: str) -> list[str]:
    return [item["role"] for item in rows("select role from employee_roles where nik = ?", (nik,))]


def current_employee() -> dict | None:
    nik = session.get("nik")
    if not nik:
        return None
    emp = row("select * from employees where nik = ?", (nik,))
    if emp:
        emp["roles"] = roles_for(nik)
    return emp


def has_role(emp: dict | None, *roles: str) -> bool:
    if not emp:
        return False
    owned = normalize_roles(emp.get("roles") or emp.get("role"))
    wanted = normalize_roles(roles)
    return "super_admin" in owned or bool(owned.intersection(wanted))


def parse_dt(date_value: str, time_value: str) -> datetime:
    return datetime.strptime(f"{date_value} {time_value}", "%Y-%m-%d %H:%M")


def plate_parity(plate_number: str) -> str | None:
    digits = "".join(ch for ch in plate_number if ch.isdigit())
    if not digits:
        return None
    return "genap" if int(digits[-1]) % 2 == 0 else "ganjil"


def default_maintenance_reference(vehicle_name: str) -> str:
    normalized = (vehicle_name or "").strip().lower()
    for brand, link in MAINTENANCE_REFERENCE_DEFAULTS.items():
        if brand in normalized:
            return link
    return ""


def normalize_plate_rule(value: str | None) -> str:
    value = (value or "bebas").strip().lower()
    return value if value in {"ganjil", "genap", "bebas"} else "bebas"


def overlaps(start_a: datetime, end_a: datetime, start_b: datetime, end_b: datetime) -> bool:
    return start_a < end_b and start_b < end_a


def request_with_details(request_id: int) -> dict | None:
    return row(
        """
        select r.*, e.full_name, e.position, e.department, e.supervisor_nik, e.phone,
               s.full_name as supervisor_name, d.driver_name, d.phone as driver_phone,
               v.plate_number, v.vehicle_name, v.vehicle_type, v.current_km as vehicle_current_km
        from trip_requests r
        join employees e on e.nik = r.requester_nik
        left join employees s on s.nik = e.supervisor_nik
        left join drivers d on d.id = r.driver_id
        left join vehicles v on v.id = r.vehicle_id
        where r.id = ?
        """,
        (request_id,),
    )


def trip_rows(where: str = "1=1", params: tuple = (), include_archived: bool = False) -> list[dict]:
    retention_clause = "" if include_archived else " and coalesce(r.end_date, r.travel_date) >= ?"
    final_params = params if include_archived else (*params, cutoff_date())
    return rows(
        f"""
        select r.*, e.full_name, e.position, e.department, e.phone,
               s.full_name as supervisor_name, d.driver_name, v.plate_number, v.vehicle_name, v.vehicle_type,
               v.current_km as vehicle_current_km
        from trip_requests r
        join employees e on e.nik = r.requester_nik
        left join employees s on s.nik = e.supervisor_nik
        left join drivers d on d.id = r.driver_id
        left join vehicles v on v.id = r.vehicle_id
        where {where}{retention_clause}
        order by r.created_at desc
        """,
        final_params,
    )


def detect_conflict(driver_id: int, vehicle_id: int, start_date: str, end_date: str, depart_time: str, return_time: str, exclude_id: int | None = None) -> str | None:
    new_start = parse_dt(start_date, depart_time)
    new_end = parse_dt(end_date, return_time)
    if new_end <= new_start:
        return "Jam pulang harus lebih besar dari jam berangkat."

    existing = rows(
        """
        select r.*, d.driver_name, v.plate_number
        from trip_requests r
        left join drivers d on d.id = r.driver_id
        left join vehicles v on v.id = r.vehicle_id
        where coalesce(r.start_date, r.travel_date) <= ?
          and coalesce(r.end_date, r.travel_date) >= ?
          and r.status in (?, ?, ?)
          and (? is null or r.id != ?)
          and (r.driver_id = ? or r.vehicle_id = ?)
        """,
        (end_date, start_date, STATUS_PROCESSING, STATUS_ASSIGNED, STATUS_ON_TRIP, exclude_id, exclude_id, driver_id, vehicle_id),
    )
    for item in existing:
        item_start_date = item.get("start_date") or item["travel_date"]
        item_end_date = item.get("end_date") or item["travel_date"]
        if overlaps(new_start, new_end, parse_dt(item_start_date, item["depart_time"]), parse_dt(item_end_date, item["return_time"])):
            if item["driver_id"] == driver_id:
                return f"Driver sudah ditugaskan pada jadwal {item['depart_time']} - {item['return_time']}."
            return f"Kendaraan {item['plate_number']} sudah dipakai pada jadwal {item['depart_time']} - {item['return_time']}."
    return None


def busy_resource_ids(start_date: str, end_date: str, depart_time: str, return_time: str, exclude_id: int | None = None) -> dict:
    new_start = parse_dt(start_date, depart_time)
    new_end = parse_dt(end_date, return_time)
    busy_drivers: set[int] = set()
    busy_vehicles: set[int] = set()
    existing = rows(
        """
        select id, driver_id, vehicle_id, start_date, end_date, travel_date, depart_time, return_time
        from trip_requests
        where coalesce(start_date, travel_date) <= ?
          and coalesce(end_date, travel_date) >= ?
          and status in (?, ?, ?)
          and (? is null or id != ?)
        """,
        (end_date, start_date, STATUS_PROCESSING, STATUS_ASSIGNED, STATUS_ON_TRIP, exclude_id, exclude_id),
    )
    for item in existing:
        item_start = parse_dt(item.get("start_date") or item["travel_date"], item["depart_time"])
        item_end = parse_dt(item.get("end_date") or item["travel_date"], item["return_time"])
        if overlaps(new_start, new_end, item_start, item_end):
            if item.get("driver_id"):
                busy_drivers.add(item["driver_id"])
            if item.get("vehicle_id"):
                busy_vehicles.add(item["vehicle_id"])
    return {"drivers": busy_drivers, "vehicles": busy_vehicles}


def availability_for_trip(item: dict) -> dict:
    busy = busy_resource_ids(
        item.get("start_date") or item["travel_date"],
        item.get("end_date") or item["travel_date"],
        item["depart_time"],
        item["return_time"],
        item["id"],
    )
    drivers = rows("select * from drivers where status = 'ACTIVE' order by driver_name")
    passengers = int(item.get("passengers") or 0)
    plate_rule = normalize_plate_rule(item.get("plate_rule"))
    vehicles = rows("select * from vehicles where status != 'MAINTENANCE' order by plate_number")
    available_vehicles = []
    for vehicle in vehicles:
        if vehicle["id"] in busy["vehicles"] and vehicle["id"] != item.get("vehicle_id"):
            continue
        if passengers and int(vehicle.get("capacity") or 0) < passengers:
            continue
        parity = plate_parity(vehicle.get("plate_number") or "")
        if plate_rule != "bebas" and parity != plate_rule:
            continue
        available_vehicles.append(vehicle)
    return {
        "drivers": [driver for driver in drivers if driver["id"] not in busy["drivers"] or driver["id"] == item.get("driver_id")],
        "vehicles": available_vehicles,
    }


def previous_vehicle_end_km(vehicle_id: int, trip_id: int) -> int:
    item = row(
        """
        select coalesce(km_end, 0) as km_end
        from trip_requests
        where vehicle_id = ?
          and id != ?
          and km_end is not null
        order by coalesce(end_date, travel_date) desc, return_time desc, id desc
        limit 1
        """,
        (vehicle_id, trip_id),
    )
    return int(item["km_end"]) if item else 0


def minimum_vehicle_start_km(vehicle_id: int, trip_id: int) -> int:
    vehicle = row("select coalesce(current_km, 0) as current_km from vehicles where id = ?", (vehicle_id,))
    stored_km = int(vehicle["current_km"]) if vehicle else 0
    return max(stored_km, previous_vehicle_end_km(vehicle_id, trip_id))


def vehicle_matches_request(vehicle_id: int, passengers: int, plate_rule: str) -> str | None:
    vehicle = row("select * from vehicles where id = ?", (vehicle_id,))
    if not vehicle:
        return "Kendaraan tidak ditemukan."
    if vehicle["status"] == "MAINTENANCE":
        return "Kendaraan sedang maintenance."
    if int(vehicle.get("capacity") or 0) < int(passengers or 0):
        return f"Kapasitas kursi kendaraan tidak cukup untuk {passengers} penumpang."
    normalized_rule = normalize_plate_rule(plate_rule)
    if normalized_rule != "bebas" and plate_parity(vehicle.get("plate_number") or "") != normalized_rule:
        return f"Nopol kendaraan tidak sesuai pilihan plat {normalized_rule}."
    return None


def available_resources_for_request(start_date: str, end_date: str, depart_time: str, return_time: str, passengers: int, plate_rule: str) -> dict:
    busy = busy_resource_ids(start_date, end_date, depart_time, return_time)
    drivers = rows("select * from drivers where status = 'ACTIVE' order by driver_name")
    vehicles = rows("select * from vehicles where status != 'MAINTENANCE' order by plate_number")
    available_drivers = [driver for driver in drivers if driver["id"] not in busy["drivers"]]
    available_vehicles = []
    normalized_rule = normalize_plate_rule(plate_rule)
    for vehicle in vehicles:
        if vehicle["id"] in busy["vehicles"]:
            continue
        if int(vehicle.get("capacity") or 0) < int(passengers or 0):
            continue
        if normalized_rule != "bebas" and plate_parity(vehicle.get("plate_number") or "") != normalized_rule:
            continue
        available_vehicles.append(vehicle)
    return {"drivers": available_drivers, "vehicles": available_vehicles}


def can_assign_vehicle_pool(requests_to_schedule: list[dict], vehicles: list[dict]) -> bool:
    vehicle_count = len(vehicles)
    matches: dict[int, list[int]] = {}
    for req_index, req in enumerate(requests_to_schedule):
        rule = normalize_plate_rule(req.get("plate_rule"))
        passenger_count = int(req.get("passengers") or 0)
        matches[req_index] = []
        for vehicle_index, vehicle in enumerate(vehicles):
            if int(vehicle.get("capacity") or 0) < passenger_count:
                continue
            if rule != "bebas" and plate_parity(vehicle.get("plate_number") or "") != rule:
                continue
            matches[req_index].append(vehicle_index)
        if not matches[req_index]:
            return False

    assigned_to: dict[int, int] = {}

    def assign(req_index: int, seen: set[int]) -> bool:
        for vehicle_index in matches[req_index]:
            if vehicle_index in seen:
                continue
            seen.add(vehicle_index)
            if vehicle_index not in assigned_to or assign(assigned_to[vehicle_index], seen):
                assigned_to[vehicle_index] = req_index
                return True
        return False

    ordered_requests = sorted(matches, key=lambda item: len(matches[item]))
    if len(ordered_requests) > vehicle_count:
        return False
    return all(assign(req_index, set()) for req_index in ordered_requests)


def booking_capacity_message(start_date: str, end_date: str, depart_time: str, return_time: str, passengers: int, plate_rule: str) -> str | None:
    normalized_rule = normalize_plate_rule(plate_rule)
    drivers = rows("select * from drivers where status = 'ACTIVE'")
    vehicles = rows("select * from vehicles where status != 'MAINTENANCE'")
    matching_vehicles = [
        vehicle for vehicle in vehicles
        if int(vehicle.get("capacity") or 0) >= int(passengers or 0)
        and (normalized_rule == "bebas" or plate_parity(vehicle.get("plate_number") or "") == normalized_rule)
    ]
    if not drivers:
        return "Tidak ada driver aktif yang tersedia. Silakan menghubungi GA jika urgent."
    if not matching_vehicles:
        if normalized_rule != "bebas":
            return f"Tidak ada kendaraan plat {normalized_rule} yang kosong dan sesuai kapasitas {passengers} penumpang. Mohon ubah jadwal/plat atau hubungi GA jika urgent."
        return f"Tidak ada kendaraan kosong yang sesuai kapasitas {passengers} penumpang. Mohon ubah jadwal atau hubungi GA jika urgent."

    new_start = parse_dt(start_date, depart_time)
    new_end = parse_dt(end_date, return_time)
    existing = rows(
        """
        select id, start_date, end_date, travel_date, depart_time, return_time,
               passengers, plate_rule, driver_id, vehicle_id, status
        from trip_requests
        where coalesce(start_date, travel_date) <= ?
          and coalesce(end_date, travel_date) >= ?
          and status in (?, ?, ?, ?, ?)
        """,
        (end_date, start_date, STATUS_PENDING, STATUS_APPROVED, STATUS_PROCESSING, STATUS_ASSIGNED, STATUS_ON_TRIP),
    )
    busy_driver_ids: set[int] = set()
    busy_vehicle_ids: set[int] = set()
    queued_requests: list[dict] = []
    for item in existing:
        item_start = parse_dt(item.get("start_date") or item["travel_date"], item["depart_time"])
        item_end = parse_dt(item.get("end_date") or item["travel_date"], item["return_time"])
        if overlaps(new_start, new_end, item_start, item_end):
            if item.get("driver_id"):
                busy_driver_ids.add(item["driver_id"])
            if item.get("vehicle_id"):
                busy_vehicle_ids.add(item["vehicle_id"])
            if not item.get("vehicle_id"):
                queued_requests.append({
                    "passengers": item.get("passengers") or 0,
                    "plate_rule": item.get("plate_rule") or "bebas",
                })
    available_driver_count = len([driver for driver in drivers if driver["id"] not in busy_driver_ids])
    available_vehicles = [vehicle for vehicle in vehicles if vehicle["id"] not in busy_vehicle_ids]
    requests_to_schedule = queued_requests + [{"passengers": passengers, "plate_rule": normalized_rule}]
    if len(requests_to_schedule) > available_driver_count:
        return "Driver full book pada jadwal tersebut. Mohon ubah jadwal atau hubungi GA jika urgent."
    if not can_assign_vehicle_pool(requests_to_schedule, available_vehicles):
        if normalized_rule != "bebas":
            return f"Kendaraan plat {normalized_rule} full book atau kapasitas kursi tidak cukup pada jadwal tersebut. Mohon ubah jadwal/plat atau hubungi GA jika urgent."
        return "Kendaraan full book atau kapasitas kursi tidak cukup pada jadwal tersebut. Mohon ubah jadwal atau hubungi GA jika urgent."
    return None


def seed_data() -> None:
    with db() as conn:
        conn.executescript(
            """
            create table if not exists employees (
                nik text primary key,
                full_name text not null,
                position text not null,
                department text not null,
                supervisor_nik text,
                phone text not null,
                active integer not null default 1
            );
            create table if not exists employee_roles (
                nik text not null,
                role text not null,
                primary key (nik, role)
            );
            create table if not exists drivers (
                id integer primary key autoincrement,
                nik text not null,
                driver_name text not null,
                position text not null,
                phone text not null,
                status text not null default 'ACTIVE'
            );
            create table if not exists vehicles (
                id integer primary key autoincrement,
                plate_number text not null,
                vehicle_name text not null,
                vehicle_type text not null default 'Operational',
                capacity integer not null,
                status text not null default 'AVAILABLE',
                stnk_expiry_date text,
                kir_expiry_date text,
                current_km integer not null default 0,
                last_maintenance_month text,
                maintenance_km_interval integer not null default 10000,
                maintenance_month_interval integer not null default 6,
                maintenance_reference_url text
            );
            create table if not exists trip_requests (
                id integer primary key autoincrement,
                request_code text not null,
                requester_nik text not null,
                destination text not null,
                purpose text not null,
                travel_date text not null,
                depart_time text not null,
                return_time text not null,
                passengers integer not null,
                plate_rule text not null default 'bebas',
                notes text,
                status text not null,
                leader_note text,
                ga_note text,
                driver_id integer,
                vehicle_id integer,
                km_start integer,
                km_end integer,
                cost_fuel integer default 0,
                fuel_liters real default 0,
                cost_toll integer default 0,
                cost_parking integer default 0,
                rating integer default 0,
                review text,
                review_follow_up text,
                review_proof_file text,
                review_proof_original_name text,
                review_proof_uploaded_at text,
                created_at text not null,
                updated_at text not null
            );
            create table if not exists option_lists (
                kind text not null,
                value text not null,
                primary key (kind, value)
            );
            create table if not exists app_meta (
                key text primary key,
                value text not null
            );
            create table if not exists trip_edit_logs (
                id integer primary key autoincrement,
                trip_id integer not null,
                edited_by text not null,
                action text not null,
                before_data text,
                after_data text,
                created_at text not null
            );
            """
        )

        add_column_if_missing(conn, "trip_requests", "start_date", "text")
        add_column_if_missing(conn, "trip_requests", "end_date", "text")
        add_column_if_missing(conn, "trip_requests", "map_url", "text")
        add_column_if_missing(conn, "trip_requests", "edited_at", "text")
        add_column_if_missing(conn, "trip_requests", "plate_rule", "text not null default 'bebas'")
        add_column_if_missing(conn, "trip_requests", "fuel_liters", "real default 0")
        add_column_if_missing(conn, "trip_requests", "cost_parking", "integer default 0")
        add_column_if_missing(conn, "trip_requests", "review_follow_up", "text")
        add_column_if_missing(conn, "trip_requests", "review_proof_file", "text")
        add_column_if_missing(conn, "trip_requests", "review_proof_original_name", "text")
        add_column_if_missing(conn, "trip_requests", "review_proof_uploaded_at", "text")
        add_column_if_missing(conn, "vehicles", "vehicle_type", "text not null default 'Operational'")
        add_column_if_missing(conn, "vehicles", "stnk_expiry_date", "text")
        add_column_if_missing(conn, "vehicles", "kir_expiry_date", "text")
        add_column_if_missing(conn, "vehicles", "current_km", "integer not null default 0")
        add_column_if_missing(conn, "vehicles", "last_maintenance_month", "text")
        add_column_if_missing(conn, "vehicles", "last_maintenance_date", "text")
        add_column_if_missing(conn, "vehicles", "maintenance_km_interval", "integer not null default 10000")
        add_column_if_missing(conn, "vehicles", "maintenance_month_interval", "integer not null default 6")
        add_column_if_missing(conn, "vehicles", "maintenance_reference_url", "text")
        conn.execute("update trip_requests set start_date = travel_date where start_date is null or start_date = ''")
        conn.execute("update trip_requests set end_date = travel_date where end_date is null or end_date = ''")
        REVIEW_PROOF_DIR.mkdir(parents=True, exist_ok=True)
        cleanup_old_review_proofs(conn)
        for vehicle in conn.execute("select id, vehicle_name from vehicles where maintenance_reference_url is null or maintenance_reference_url = ''").fetchall():
            reference_url = default_maintenance_reference(vehicle["vehicle_name"])
            if reference_url:
                conn.execute("update vehicles set maintenance_reference_url = ? where id = ?", (reference_url, vehicle["id"]))
        conn.execute("update vehicles set last_maintenance_date = last_maintenance_month || '-01' where (last_maintenance_date is null or last_maintenance_date = '') and last_maintenance_month is not null and last_maintenance_month != ''")
        status_migrations = {
            STATUS_PENDING: ["PENDING LEADER APPROVAL", "Pending Leader Approval", "Pending", "pending"],
            STATUS_APPROVED: ["APPROVED BY LEADER", "Approved by Leader", "Approved"],
            STATUS_REJECTED: ["REJECTED", "Rejected"],
            STATUS_PROCESSING: ["PROCESSING GA", "Processing GA"],
            STATUS_ASSIGNED: ["ASSIGNED TO DRIVER", "Assigned to Driver", "Assigned"],
            STATUS_ON_TRIP: ["ON TRIP", "On Trip"],
            STATUS_COMPLETED: ["COMPLETED", "Completed"],
            STATUS_REVIEWED: ["REVIEWED", "Reviewed"],
        }
        for canonical, aliases in status_migrations.items():
            conn.execute(
                f"update trip_requests set status = ? where status in ({','.join('?' for _ in aliases)})",
                (canonical, *aliases),
            )
        conn.execute(
            """
            delete from trip_requests
            where status = ?
              and coalesce(rating, 0) > 0
              and coalesce(end_date, travel_date) < ?
            """,
            (STATUS_COMPLETED, cutoff_date()),
        )

        conn.execute("delete from employee_roles where nik in (select nik from employees where active = 0)")
        conn.execute("delete from employees where active = 0")

        for value in DEFAULT_POSITION_OPTIONS:
            conn.execute("insert or ignore into option_lists (kind, value) values ('position', ?)", (value,))
        for value in DEFAULT_DEPARTMENT_OPTIONS:
            conn.execute("insert or ignore into option_lists (kind, value) values ('department', ?)", (value,))

        seeded = conn.execute("select value from app_meta where key = 'seeded'").fetchone()
        employee_count = conn.execute("select count(*) from employees").fetchone()[0]
        if not seeded and employee_count > 0:
            conn.execute("insert or replace into app_meta (key, value) values ('seeded', '1')")
            conn.commit()
            return

        if not seeded:
            employees = [
                ("102145", "BUDI SANTOSO", "STAFF FINANCE", "FINANCE", "102146", "08123456789", ["user"]),
                ("102148", "SITI RAHAYU", "STAFF MARKETING", "MARKETING", "102146", "08125550001", ["user"]),
                ("102146", "IBU RINA", "FINANCE MANAGER", "FINANCE", None, "08129876543", ["pimpinan"]),
                ("102147", "AHMAD FAUZI", "GA ADMIN", "GENERAL AFFAIRS", "900001", "081233344455", ["ga_admin"]),
                ("200145", "BUDI SETIAWAN", "DRIVER OPERASIONAL", "GENERAL AFFAIRS", "102147", "081211122233", ["driver"]),
                ("200146", "ANDI WIJAYA", "DRIVER DIREKSI", "GENERAL AFFAIRS", "102147", "081299988877", ["driver"]),
                ("900001", "DEWI LESTARI", "KEPALA GA", "GENERAL AFFAIRS", None, "081200000001", ["super_admin", "pimpinan", "ga_admin"]),
            ]
            for nik, name, position, department, supervisor, phone, emp_roles in employees:
                conn.execute(
                    """
                    insert or ignore into employees
                    (nik, full_name, position, department, supervisor_nik, phone)
                    values (?, ?, ?, ?, ?, ?)
                    """,
                    (nik, name, position, department, supervisor, phone),
                )
                for role_name in emp_roles:
                    conn.execute("insert or ignore into employee_roles (nik, role) values (?, ?)", (nik, role_name))

            for nik, driver_name, position, phone, status in [
                ("200145", "BUDI SETIAWAN", "DRIVER OPERASIONAL", "081211122233", "ACTIVE"),
                ("200146", "ANDI WIJAYA", "DRIVER DIREKSI", "081299988877", "ACTIVE"),
            ]:
                conn.execute(
                    """
                    insert into drivers (nik, driver_name, position, phone, status)
                    select ?, ?, ?, ?, ?
                    where not exists (select 1 from drivers where nik = ?)
                    """,
                    (nik, driver_name, position, phone, status, nik),
                )

            for plate_number, vehicle_name, vehicle_type, capacity, status in [
                ("B 1234 GA", "Toyota Avanza", "MPV", 6, "AVAILABLE"),
                ("B 5678 GA", "Toyota Innova", "MPV", 7, "AVAILABLE"),
                ("B 9012 GA", "HiAce Commuter", "Van", 14, "AVAILABLE"),
            ]:
                conn.execute(
                    """
                    insert into vehicles (plate_number, vehicle_name, vehicle_type, capacity, status)
                    select ?, ?, ?, ?, ?
                    where not exists (select 1 from vehicles where plate_number = ?)
                    """,
                    (plate_number, vehicle_name, vehicle_type, capacity, status, plate_number),
                )
            conn.execute("insert or replace into app_meta (key, value) values ('seeded', '1')")
        conn.commit()


@app.before_request
def ensure_db() -> None:
    seed_data()


@app.get("/")
def index():
    emp = current_employee()
    if not emp:
        return render_template("login.html")
    return render_template(
        "app.html",
        emp=emp,
        role_labels=ROLE_LABELS,
        statuses={
            "pending": STATUS_PENDING,
            "approved": STATUS_APPROVED,
            "processing": STATUS_PROCESSING,
            "assigned": STATUS_ASSIGNED,
            "on_trip": STATUS_ON_TRIP,
            "completed": STATUS_COMPLETED,
            "rejected": STATUS_REJECTED,
        },
    )


@app.post("/login")
def login():
    nik = request.form.get("nik", "").strip()
    session["language"] = request.form.get("language", "id")
    emp = row("select * from employees where nik = ? and active = 1", (nik,))
    if not emp:
        return render_template("login.html", error="NIK tidak ditemukan atau tidak aktif.")
    session["nik"] = nik
    return redirect(url_for("index"))


@app.get("/logout")
def logout():
    session.clear()
    return redirect(url_for("index"))


@app.post("/requests")
def create_request():
    emp = current_employee()
    if not has_role(emp, "user"):
        return redirect(url_for("index"))

    pending_reviews = row(
        "select count(*) as total from trip_requests where requester_nik = ? and status = ? and coalesce(rating, 0) = 0",
        (emp["nik"], STATUS_COMPLETED),
    )["total"]
    if pending_reviews >= 3:
        return error_response("You have 3 completed trips waiting for review.", "booking")

    active_count = row(
        """
        select count(*) as total
        from trip_requests
        where requester_nik = ?
          and (
            status in (?, ?, ?, ?, ?)
            or (status = ? and coalesce(rating, 0) = 0)
          )
          and coalesce(end_date, travel_date) >= ?
        """,
        (emp["nik"], STATUS_PENDING, STATUS_APPROVED, STATUS_PROCESSING, STATUS_ASSIGNED, STATUS_ON_TRIP, STATUS_COMPLETED, cutoff_date()),
    )["total"]
    if active_count >= 3:
        return error_response("You already have 3 active or unreviewed bookings.", "booking")

    now = datetime.now().isoformat(timespec="seconds")
    start_date = request.form.get("start_date") or request.form.get("travel_date")
    end_date = request.form.get("end_date") or start_date
    if start_date < datetime.now().date().isoformat():
        return error_response("Tanggal booking tidak boleh tanggal lampau.", "booking")
    if parse_dt(end_date, request.form["return_time"]) <= parse_dt(start_date, request.form["depart_time"]):
        return error_response("End date/time must be after start date/time.", "booking")
    passengers = int(request.form["passengers"])
    plate_rule = normalize_plate_rule(request.form.get("plate_rule"))
    capacity_message = booking_capacity_message(
        start_date,
        end_date,
        request.form["depart_time"],
        request.form["return_time"],
        passengers,
        plate_rule,
    )
    if capacity_message:
        return error_response(capacity_message, "booking")
    availability = available_resources_for_request(
        start_date,
        end_date,
        request.form["depart_time"],
        request.form["return_time"],
        passengers,
        plate_rule,
    )
    if not availability["drivers"] or not availability["vehicles"]:
        return error_response(
            "Jadwal tersebut sudah penuh untuk driver/kendaraan yang sesuai. Silakan menghubungi GA jika urgent.",
            "booking",
        )
    with db() as conn:
        conn.execute(
            """
            insert into trip_requests (
                request_code, requester_nik, destination, purpose, travel_date, start_date, end_date,
                depart_time, return_time, passengers, plate_rule, notes, map_url, status, created_at, updated_at
            ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                "REQ-" + datetime.now().strftime("%Y%m%d%H%M%S"),
                emp["nik"],
                request.form["destination"].strip(),
                request.form["purpose"].strip(),
                start_date,
                start_date,
                end_date,
                request.form["depart_time"],
                request.form["return_time"],
                passengers,
                plate_rule,
                request.form.get("notes", "").strip(),
                request.form.get("map_url", "").strip(),
                STATUS_PENDING,
                now,
                now,
            ),
        )
        conn.commit()
    return ok_response("booking", "Booking submitted")


@app.post("/requests/<int:request_id>/update")
def update_request(request_id: int):
    emp = current_employee()
    item = request_with_details(request_id)
    if not emp or not item:
        return error_response("Trip not found.", "history", 404)
    can_user_edit = item["requester_nik"] == emp["nik"] and item["status"] in EDITABLE_BOOKING_STATUSES
    can_ga_edit = has_role(emp, "ga_admin")
    if not can_user_edit and not can_ga_edit:
        return error_response("You are not allowed to edit this trip.", "history", 403)
    start_date = request.form["start_date"]
    end_date = request.form["end_date"]
    if can_user_edit and start_date < datetime.now().date().isoformat():
        return error_response("Tanggal booking tidak boleh tanggal lampau.", "history")
    if parse_dt(end_date, request.form["return_time"]) <= parse_dt(start_date, request.form["depart_time"]):
        return error_response("End date/time must be after start date/time.", "history")
    driver_id = request.form.get("driver_id") or item.get("driver_id")
    vehicle_id = request.form.get("vehicle_id") or item.get("vehicle_id")
    if can_ga_edit and driver_id and vehicle_id:
        vehicle_error = vehicle_matches_request(
            int(vehicle_id),
            int(request.form["passengers"]),
            normalize_plate_rule(request.form.get("plate_rule") or item.get("plate_rule")),
        )
        if vehicle_error:
            return error_response(vehicle_error, "ga")
        conflict = detect_conflict(int(driver_id), int(vehicle_id), start_date, end_date, request.form["depart_time"], request.form["return_time"], request_id)
        if conflict:
            return error_response(conflict, "ga")
    now = datetime.now().isoformat(timespec="seconds")
    with db() as conn:
        conn.execute(
            """
            update trip_requests
            set destination = ?, purpose = ?, travel_date = ?, start_date = ?, end_date = ?,
                depart_time = ?, return_time = ?, passengers = ?, plate_rule = ?, notes = ?, map_url = ?,
                driver_id = coalesce(?, driver_id), vehicle_id = coalesce(?, vehicle_id),
                edited_at = ?, updated_at = ?
            where id = ?
            """,
            (
                request.form["destination"].strip(),
                request.form["purpose"].strip(),
                start_date,
                start_date,
                end_date,
                request.form["depart_time"],
                request.form["return_time"],
                int(request.form["passengers"]),
                normalize_plate_rule(request.form.get("plate_rule") or item.get("plate_rule")),
                request.form.get("notes", "").strip(),
                request.form.get("map_url", "").strip(),
                int(driver_id) if can_ga_edit and driver_id else None,
                int(vehicle_id) if can_ga_edit and vehicle_id else None,
                now,
                now,
                request_id,
            ),
        )
        conn.execute(
            "insert into trip_edit_logs (trip_id, edited_by, action, before_data, after_data, created_at) values (?, ?, ?, ?, ?, ?)",
            (request_id, emp["nik"], "GA_EDIT" if can_ga_edit else "USER_EDIT", str(dict(item)), str(dict(request.form)), now),
        )
        conn.commit()
    return ok_response("ga" if can_ga_edit else "history", "Trip updated")


@app.post("/requests/<int:request_id>/cancel")
def cancel_request(request_id: int):
    emp = current_employee()
    item = request_with_details(request_id)
    if not emp or not item or item["requester_nik"] != emp["nik"]:
        return error_response("Trip not found.", "history", 404)
    if item["status"] in {STATUS_ASSIGNED, STATUS_ON_TRIP, STATUS_COMPLETED, STATUS_REVIEWED, STATUS_CANCELED}:
        return error_response("This booking cannot be canceled.", "history", 409)
    now = datetime.now().isoformat(timespec="seconds")
    with db() as conn:
        conn.execute(
            "update trip_requests set status = ?, updated_at = ? where id = ?",
            (STATUS_CANCELED, now, request_id),
        )
        conn.execute(
            "insert into trip_edit_logs (trip_id, edited_by, action, before_data, after_data, created_at) values (?, ?, ?, ?, ?, ?)",
            (request_id, emp["nik"], "USER_CANCEL", str(dict(item)), STATUS_CANCELED, now),
        )
        conn.commit()
    return ok_response("history", "Booking canceled")


@app.post("/requests/<int:request_id>/approval")
def approval(request_id: int):
    emp = current_employee()

    data = request.get_json(silent=True) or request.form
    action = (data.get("action") or "").strip().lower()
    leader_note = (data.get("leader_note") or "").strip()

    logger.debug(
        "Approval request received booking_id=%s leader=%s roles=%s action=%s",
        request_id,
        emp["nik"] if emp else None,
        emp.get("roles") if emp else None,
        action,
    )

    if action not in {"approve", "reject"}:
        logger.debug(
            "Approval failed invalid action booking_id=%s action=%s",
            request_id,
            action,
        )
        return error_response("Invalid approval action", "approval", 400)

    if not emp or not has_role(emp, "pimpinan"):
        logger.debug(
            "Approval failed unauthorized booking_id=%s user=%s",
            request_id,
            emp["nik"] if emp else None,
        )
        return error_response("You are not authorized to approve this request", "approval", 403)

    try:
        with db() as conn:
            item_row = conn.execute(
                """
                SELECT r.*, e.supervisor_nik, e.full_name as requester_name, e.supervisor_nik as requester_supervisor_nik
                FROM trip_requests r
                JOIN employees e ON e.nik = r.requester_nik
                WHERE r.id = ?
                """,
                (request_id,),
            ).fetchone()

            if not item_row:
                logger.debug(
                    "Approval failed missing booking_id=%s leader=%s",
                    request_id,
                    emp["nik"],
                )
                return error_response("Request not found", "approval", 404)

            item = dict(item_row)
            old_status = item.get("status")
            canonical_old_status = canonical_status(old_status)

            allowed_pending_statuses = {
                STATUS_PENDING,
                "Pending",
                "Pending Leader Approval",
                "PENDING LEADER APPROVAL",
            }

            logger.debug(
                "Approval context booking_id=%s action=%s leader=%s roles=%s requester=%s supervisor_nik=%s old_status=%s canonical_status=%s",
                request_id,
                action,
                emp["nik"],
                emp.get("roles"),
                item.get("requester_nik"),
                item.get("supervisor_nik"),
                old_status,
                canonical_old_status,
            )

            if canonical_old_status not in {canonical_status(status) for status in allowed_pending_statuses}:
                logger.debug(
                    "Approval failed invalid status booking_id=%s status=%s leader=%s",
                    request_id,
                    old_status,
                    emp["nik"],
                )
                return error_response(
                    f"Request status is not pending approval. Current status: {old_status}",
                    "approval",
                    409,
                )

            supervisor_nik = (item.get("supervisor_nik") or "").strip()
            if not supervisor_nik and not has_role(emp, "super_admin"):
                logger.debug(
                    "Approval failed missing supervisor_nik booking_id=%s leader=%s requester=%s",
                    request_id,
                    emp["nik"],
                    item.get("requester_nik"),
                )
                return error_response("Requester has no assigned supervisor NIK", "approval", 400)

            if emp["nik"] != supervisor_nik and not has_role(emp, "super_admin"):
                logger.debug(
                    "Approval failed wrong leader booking_id=%s leader=%s supervisor=%s",
                    request_id,
                    emp["nik"],
                    supervisor_nik,
                )
                return error_response(
                    "You are not the assigned leader for this request",
                    "approval",
                    403,
                )

            status = STATUS_APPROVED if action == "approve" else STATUS_REJECTED

            result = conn.execute(
                """
                UPDATE trip_requests
                SET status = ?, leader_note = ?, updated_at = ?
                WHERE id = ?
                """,
                (
                    status,
                    leader_note,
                    datetime.now().isoformat(timespec="seconds"),
                    request_id,
                ),
            )

            if result.rowcount != 1:
                conn.rollback()
                logger.debug(
                    "Approval update affected no rows booking_id=%s leader=%s action=%s",
                    request_id,
                    emp["nik"],
                    action,
                )
                return error_response("No request was updated", "approval", 409)

            conn.commit()

            logger.debug(
                "Approval update committed booking_id=%s leader=%s requester=%s supervisor_nik=%s action=%s old_status=%s new_status=%s rowcount=%s",
                request_id,
                emp["nik"],
                item.get("requester_nik"),
                supervisor_nik,
                action,
                old_status,
                status,
                result.rowcount,
            )

    except Exception as e:
        logger.exception(
            "Approval error booking_id=%s leader=%s action=%s",
            request_id,
            emp["nik"] if emp else None,
            action,
        )
        return error_response(f"Approval error: {str(e)}", "approval", 500)

    message = "Request approved successfully" if action == "approve" else "Request rejected successfully"
    return ok_response("approval", message)


@app.post("/requests/<int:request_id>/assign")
def assign(request_id: int):
    emp = current_employee()
    if not has_role(emp, "ga_admin"):
        return redirect(url_for("index"))
    item = request_with_details(request_id)
    if not item:
        return redirect(url_for("index"))
    driver_id = int(request.form["driver_id"])
    vehicle_id = int(request.form["vehicle_id"])
    vehicle_error = vehicle_matches_request(vehicle_id, int(item["passengers"]), item.get("plate_rule"))
    if vehicle_error:
        return error_response(vehicle_error, "ga")
    conflict = detect_conflict(driver_id, vehicle_id, item.get("start_date") or item["travel_date"], item.get("end_date") or item["travel_date"], item["depart_time"], item["return_time"], request_id)
    if conflict:
        return error_response(conflict, "ga")
    execute(
        "update trip_requests set driver_id = ?, vehicle_id = ?, ga_note = ?, status = ?, updated_at = ? where id = ?",
        (driver_id, vehicle_id, request.form.get("ga_note", "").strip(), STATUS_ASSIGNED, datetime.now().isoformat(timespec="seconds"), request_id),
    )
    return ok_response("ga", "Assignment saved")


@app.post("/requests/<int:request_id>/ga-reject")
def ga_reject(request_id: int):
    emp = current_employee()
    if not has_role(emp, "ga_admin"):
        return error_response("You are not authorized to reject this request.", "ga", 403)
    item = request_with_details(request_id)
    if not item:
        return error_response("Trip not found.", "ga", 404)
    if item["status"] in {STATUS_COMPLETED, STATUS_REVIEWED}:
        return error_response("Completed trips cannot be rejected.", "ga", 409)
    now = datetime.now().isoformat(timespec="seconds")
    note = request.form.get("ga_note", "").strip()
    with db() as conn:
        conn.execute(
            "update trip_requests set status = ?, ga_note = ?, updated_at = ? where id = ?",
            (STATUS_REJECTED, note, now, request_id),
        )
        conn.execute(
            "insert into trip_edit_logs (trip_id, edited_by, action, before_data, after_data, created_at) values (?, ?, ?, ?, ?, ?)",
            (request_id, emp["nik"], "GA_REJECT", str(dict(item)), note, now),
        )
        conn.commit()
    return ok_response("ga", "Request rejected by GA")


@app.post("/requests/<int:request_id>/driver")
def driver_update(request_id: int):
    emp = current_employee()
    item = request_with_details(request_id)
    if not item or not has_role(emp, "driver"):
        return redirect(url_for("index"))
    driver = row("select * from drivers where id = ? and nik = ?", (item["driver_id"], emp["nik"]))
    if not driver and not has_role(emp, "super_admin"):
        return redirect(url_for("index"))
    action = request.form.get("action")
    if action == "start":
        km_start = int(request.form.get("km_start") or 0)
        minimum_km = minimum_vehicle_start_km(item["vehicle_id"], request_id) if item.get("vehicle_id") else 0
        if km_start < minimum_km:
            return error_response(f"Start KM cannot be lower than previous End KM ({minimum_km}).", "driver")
        execute(
            "update trip_requests set status = ?, km_start = ?, updated_at = ? where id = ?",
            (STATUS_ON_TRIP, km_start, datetime.now().isoformat(timespec="seconds"), request_id),
        )
    elif action == "finish":
        km_end = int(request.form.get("km_end") or 0)
        km_start = int(item.get("km_start") or 0)
        if km_end < km_start:
            return error_response(f"End KM cannot be lower than Start KM ({km_start}).", "driver")
        with db() as conn:
            now = datetime.now().isoformat(timespec="seconds")
            conn.execute(
                """
                update trip_requests
                set status = ?, km_end = ?, cost_fuel = ?, fuel_liters = ?, cost_toll = ?, cost_parking = ?, updated_at = ?
                where id = ?
                """,
                (
                    STATUS_COMPLETED,
                    km_end,
                    parse_money(request.form.get("cost_fuel")),
                    float(request.form.get("fuel_liters") or 0),
                    parse_money(request.form.get("cost_toll")),
                    parse_money(request.form.get("cost_parking")),
                    now,
                    request_id,
                ),
            )
            if item.get("vehicle_id"):
                conn.execute(
                    "update vehicles set current_km = max(coalesce(current_km, 0), ?) where id = ?",
                    (km_end, item["vehicle_id"]),
                )
            conn.commit()
    return ok_response("driver", "Driver update saved")


@app.post("/requests/<int:request_id>/review")
def review(request_id: int):
    emp = current_employee()
    item = request_with_details(request_id)
    if not emp or not item or item["requester_nik"] != emp["nik"]:
        return redirect(url_for("index"))
    rating = int(request.form["rating"])
    execute(
        "update trip_requests set rating = ?, review = ?, updated_at = ? where id = ?",
        (rating, request.form.get("review", "").strip(), datetime.now().isoformat(timespec="seconds"), request_id),
    )
    return redirect(url_for("index", tab="history"))


@app.post("/requests/<int:request_id>/review-follow-up")
def update_review_follow_up(request_id: int):
    emp = current_employee()
    if not has_role(emp, "ga_admin"):
        return error_response("Unauthorized", "user-reviews", 403)
    item = request_with_details(request_id)
    if not item or not item.get("rating"):
        return error_response("Review not found", "user-reviews", 404)
    execute(
        "update trip_requests set review_follow_up = ? where id = ?",
        (request.form.get("review_follow_up", "").strip(), request_id),
    )
    return ok_response("user-reviews", "Follow up saved")


@app.post("/requests/<int:request_id>/review-proof")
def upload_review_proof(request_id: int):
    emp = current_employee()
    if not has_role(emp, "ga_admin"):
        return error_response("Unauthorized", "user-reviews", 403)
    item = request_with_details(request_id)
    if not item or not item.get("rating"):
        return error_response("Review not found", "user-reviews", 404)
    uploaded = request.files.get("review_proof")
    if not uploaded or not uploaded.filename:
        return error_response("Upload Bukti Tindak lanjut wajib PDF", "user-reviews")
    original_name = secure_filename(uploaded.filename)
    if not original_name.lower().endswith(".pdf") or uploaded.mimetype not in {"application/pdf", "application/x-pdf", ""}:
        return error_response("File wajib dalam bentuk PDF", "user-reviews")
    REVIEW_PROOF_DIR.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    filename = f"review_{request_id}_{timestamp}.pdf"
    existing_file = item.get("review_proof_file")
    if existing_file:
        old_path = REVIEW_PROOF_DIR / existing_file
        if old_path.exists():
            old_path.unlink()
    uploaded.save(REVIEW_PROOF_DIR / filename)
    execute(
        """
        update trip_requests
        set review_proof_file = ?,
            review_proof_original_name = ?,
            review_proof_uploaded_at = ?
        where id = ?
        """,
        (filename, original_name, datetime.now().isoformat(timespec="seconds"), request_id),
    )
    return ok_response("user-reviews", "Upload Bukti Tindak lanjut berhasil")


@app.get("/requests/<int:request_id>/review-proof")
def download_review_proof(request_id: int):
    emp = current_employee()
    if not has_role(emp, "ga_admin"):
        return redirect(url_for("index"))
    item = request_with_details(request_id)
    filename = item.get("review_proof_file") if item else None
    if not filename or not (REVIEW_PROOF_DIR / filename).exists():
        return redirect(url_for("index", tab="user-reviews", error="Bukti tindak lanjut belum tersedia"))
    return send_from_directory(
        REVIEW_PROOF_DIR,
        filename,
        as_attachment=False,
        download_name=item.get("review_proof_original_name") or filename,
        mimetype="application/pdf",
    )


@app.post("/employees")
def add_employee():
    emp = current_employee()
    if not has_role(emp, "ga_admin"):
        return redirect(url_for("index"))
    nik = request.form["nik"].strip()
    if row("select nik from employees where nik = ?", (nik,)):
        logger.debug("Employee insert blocked; duplicate NIK=%s", nik)
        return redirect_employee_error("NIK sudah terdaftar")

    roles = request.form.getlist("roles")
    position = add_option_value("position", request.form["position"])
    department = add_option_value("department", request.form["department"])
    full_name = request.form["full_name"].strip().upper()
    phone = request.form["phone"].strip()
    with db() as conn:
        try:
            logger.debug("Inserting employee NIK=%s name=%s roles=%s", nik, full_name, roles or ["user"])
            conn.execute(
                "insert into employees (nik, full_name, position, department, supervisor_nik, phone) values (?, ?, ?, ?, ?, ?)",
                (
                    nik,
                    full_name,
                    position,
                    department,
                    request.form.get("supervisor_nik") or None,
                    phone,
                ),
            )
            for role_name in roles or ["user"]:
                conn.execute("insert into employee_roles (nik, role) values (?, ?)", (nik, role_name))
            sync_driver_record(conn, nik, full_name, position, phone, roles)
            conn.commit()
        except sqlite3.IntegrityError:
            conn.rollback()
            logger.exception("Employee insert failed due to duplicate or constraint issue. NIK=%s", nik)
            return redirect_employee_error("NIK sudah terdaftar")
    return redirect_employee_tab()


@app.post("/employees/<nik>/update")
def update_employee(nik: str):
    emp = current_employee()
    if not has_role(emp, "ga_admin"):
        return redirect(url_for("index"))
    roles = request.form.getlist("roles") or ["user"]
    position = add_option_value("position", request.form["position"])
    department = add_option_value("department", request.form["department"])
    full_name = request.form["full_name"].strip().upper()
    phone = request.form["phone"].strip()
    with db() as conn:
        conn.execute(
            """
            update employees
            set full_name = ?, position = ?, department = ?, supervisor_nik = ?, phone = ?, active = 1
            where nik = ?
            """,
            (full_name, position, department, request.form.get("supervisor_nik") or None, phone, nik),
        )
        conn.execute("delete from employee_roles where nik = ?", (nik,))
        for role_name in roles:
            conn.execute("insert into employee_roles (nik, role) values (?, ?)", (nik, role_name))
        sync_driver_record(conn, nik, full_name, position, phone, roles)
        conn.commit()
    return redirect_employee_tab()


@app.post("/employees/<nik>/delete")
def delete_employee(nik: str):
    emp = current_employee()
    if not has_role(emp, "ga_admin"):
        return redirect(url_for("index"))
    if emp["nik"] == nik:
        return redirect_employee_error("Tidak bisa menghapus user yang sedang login.")
    with db() as conn:
        logger.debug("Deleting employee permanently NIK=%s", nik)
        conn.execute("delete from employee_roles where nik = ?", (nik,))
        conn.execute("delete from employees where nik = ?", (nik,))
        conn.execute("update drivers set status = 'INACTIVE' where nik = ?", (nik,))
        conn.commit()
        remaining = conn.execute("select count(*) from employees where nik = ?", (nik,)).fetchone()[0]
        logger.debug("Employee delete complete NIK=%s remaining_rows=%s", nik, remaining)
    return redirect_employee_tab()


@app.post("/options")
def add_option():
    emp = current_employee()
    if not has_role(emp, "ga_admin"):
        return jsonify({"ok": False, "message": "Tidak berwenang."}), 403
    payload = request.get_json(silent=True) or {}
    kind = payload.get("kind", "")
    if kind not in {"position", "department"}:
        return jsonify({"ok": False, "message": "Jenis dropdown tidak valid."}), 400
    value = add_option_value(kind, payload.get("value", ""))
    if not value:
        return jsonify({"ok": False, "message": "Nilai tidak boleh kosong."}), 400
    return jsonify({"ok": True, "value": value, "options": option_values(kind)})


@app.post("/options/delete")
def delete_option():
    emp = current_employee()
    if not has_role(emp, "ga_admin"):
        return jsonify({"ok": False, "message": "Tidak berwenang."}), 403
    payload = request.get_json(silent=True) or {}
    kind = payload.get("kind", "")
    value = payload.get("value", "").strip()
    if kind not in {"position", "department"} or not value:
        return jsonify({"ok": False, "message": "Pilihan tidak valid."}), 400
    execute("delete from option_lists where kind = ? and value = ?", (kind, value))
    return jsonify({"ok": True, "options": option_values(kind)})


@app.post("/vehicles")
def add_vehicle():
    emp = current_employee()
    if not has_role(emp, "ga_admin"):
        return redirect(url_for("index"))
    execute(
        """
        insert into vehicles (
            vehicle_name, plate_number, vehicle_type, capacity, status, stnk_expiry_date, kir_expiry_date,
            current_km, last_maintenance_month, maintenance_km_interval, maintenance_month_interval, maintenance_reference_url
        )
        values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            request.form["vehicle_name"].strip(),
            request.form["plate_number"].strip().upper(),
            request.form["vehicle_type"].strip(),
            int(request.form["capacity"]),
            request.form["status"],
            request.form.get("stnk_expiry_date", "").strip() or None,
            request.form.get("kir_expiry_date", "").strip() or None,
            int(request.form.get("current_km") or 0),
            (request.form.get("last_maintenance_date", "").strip() or "")[:7] or None,
            int(request.form.get("maintenance_km_interval") or 10000),
            int(request.form.get("maintenance_month_interval") or 6),
            request.form.get("maintenance_reference_url", "").strip() or default_maintenance_reference(request.form["vehicle_name"]),
        ),
    )
    return redirect(url_for("index", tab="vehicles"))


@app.post("/vehicles/<int:vehicle_id>/update")
def update_vehicle(vehicle_id: int):
    emp = current_employee()
    if not has_role(emp, "ga_admin"):
        return redirect(url_for("index"))
    execute(
        """
        update vehicles
        set vehicle_name = ?, plate_number = ?, vehicle_type = ?, capacity = ?, status = ?,
            stnk_expiry_date = ?, kir_expiry_date = ?
        where id = ?
        """,
        (
            request.form["vehicle_name"].strip(),
            request.form["plate_number"].strip().upper(),
            request.form["vehicle_type"].strip(),
            int(request.form["capacity"]),
            request.form["status"],
            request.form.get("stnk_expiry_date", "").strip() or None,
            request.form.get("kir_expiry_date", "").strip() or None,
            vehicle_id,
        ),
    )
    return redirect(url_for("index", tab="vehicles"))


@app.post("/vehicles/<int:vehicle_id>/maintenance")
def update_vehicle_maintenance(vehicle_id: int):
    emp = current_employee()
    if not has_role(emp, "ga_admin"):
        return redirect(url_for("index"))
    current_km_value = request.form.get("current_km")
    can_edit_km = has_role(emp, "super_admin") and current_km_value not in {None, ""}
    is_super_admin = has_role(emp, "super_admin")
    existing = row("select * from vehicles where id = ?", (vehicle_id,))
    if not existing:
        return redirect(url_for("index", tab="maintenance"))
    maintenance_date = request.form.get("last_maintenance_date", "").strip() or None
    maintenance_month = maintenance_date[:7] if maintenance_date else None
    month_interval = int(request.form.get("maintenance_month_interval") or existing.get("maintenance_month_interval") or 6) if is_super_admin else int(existing.get("maintenance_month_interval") or 6)
    km_interval = int(request.form.get("maintenance_km_interval") or existing.get("maintenance_km_interval") or 10000)
    with db() as conn:
        if can_edit_km:
            conn.execute(
                """
                update vehicles
                set current_km = ?, last_maintenance_date = ?, last_maintenance_month = ?, maintenance_km_interval = ?,
                    maintenance_month_interval = ?, maintenance_reference_url = ?
                where id = ?
                """,
                (
                    int(current_km_value),
                    maintenance_date,
                    maintenance_month,
                    km_interval,
                    month_interval,
                    request.form.get("maintenance_reference_url", "").strip(),
                    vehicle_id,
                ),
            )
        else:
            conn.execute(
                """
                update vehicles
                set last_maintenance_date = ?, last_maintenance_month = ?, maintenance_km_interval = ?,
                    maintenance_month_interval = ?, maintenance_reference_url = ?
                where id = ?
                """,
                (
                    maintenance_date,
                    maintenance_month,
                    km_interval,
                    month_interval,
                    request.form.get("maintenance_reference_url", "").strip(),
                    vehicle_id,
                ),
            )
        conn.commit()
    return redirect(url_for("index", tab="maintenance"))


@app.post("/vehicles/<int:vehicle_id>/delete")
def delete_vehicle(vehicle_id: int):
    emp = current_employee()
    if not has_role(emp, "ga_admin"):
        return redirect(url_for("index"))
    execute("delete from vehicles where id = ?", (vehicle_id,))
    return redirect(url_for("index", tab="vehicles"))


@app.post("/trips/delete-all")
def delete_all_trips():
    emp = current_employee()
    if not has_role(emp, "super_admin"):
        return error_response("Only Super Admin can delete all trip history.", "dashboard", 403)
    with db() as conn:
        conn.execute("delete from trip_edit_logs")
        conn.execute("delete from trip_requests")
        conn.commit()
    return ok_response("dashboard", "All trip history deleted")


@app.get("/dev/reset-requests")
def dev_reset_requests():
    if not app.debug:
        return jsonify({"success": False, "message": "Development reset is only available when Flask debug mode is enabled."}), 403
    if request.args.get("confirm") != "yes":
        return jsonify({"success": False, "message": "Confirmation required. Use /dev/reset-requests?confirm=yes"}), 400

    allowed_tables = [
        "bookings",
        "booking_requests",
        "approvals",
        "trips",
        "trip_requests",
        "trip_history",
        "ratings",
        "driver_assignments",
        "edit_logs",
        "trip_edit_logs",
    ]
    forbidden_tables = {
        "employees",
        "users",
        "drivers",
        "vehicles",
        "roles",
        "employee_roles",
        "departments",
        "positions",
    }

    with db() as conn:
        existing_tables = {
            item["name"]
            for item in conn.execute("select name from sqlite_master where type = 'table'").fetchall()
        }
        tables_to_clear = [
            table for table in allowed_tables
            if table in existing_tables and table not in forbidden_tables
        ]
        logger.warning("Development reset will clear transaction tables only: %s", tables_to_clear)
        for table in tables_to_clear:
            conn.execute(f"delete from {table}")
        conn.commit()

    return jsonify({
        "success": True,
        "message": "Only booking/approval/trip test data has been reset. Master employee, driver, vehicle, and role data were not deleted.",
        "cleared_tables": tables_to_clear,
    })


@app.get("/employees/template.xlsx")
def employee_template():
    emp = current_employee()
    if not has_role(emp, "ga_admin"):
        return redirect(url_for("index"))
    wb = Workbook()
    ws = wb.active
    ws.title = "Employee Template"
    ws.append(["NIK", "Full Name", "Position", "Department", "Supervisor", "Phone Number", "Roles"])
    ws.append(["10001", "EMPLOYEE NAME", "Manager GA", "HRGA", "1001", "08123456789", "user,driver"])
    buffer = io.BytesIO()
    wb.save(buffer)
    buffer.seek(0)
    return send_file(buffer, as_attachment=True, download_name="employee_template.xlsx", mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")


@app.get("/employees/export.xlsx")
def export_employees():
    emp = current_employee()
    if not has_role(emp, "ga_admin"):
        return redirect(url_for("index"))
    wb = Workbook()
    ws = wb.active
    ws.title = "Employees"
    ws.append(["NIK", "Full Name", "Position", "Department", "Supervisor", "Phone Number", "Roles"])
    for item in rows(
        """
        select e.*, group_concat(er.role, ',') as roles_text
        from employees e left join employee_roles er on er.nik = e.nik
        where e.active = 1
        group by e.nik order by e.full_name
        """
    ):
        ws.append([item["nik"], item["full_name"], item["position"], item["department"], item["supervisor_nik"] or "", item["phone"], item["roles_text"] or "user"])
    buffer = io.BytesIO()
    wb.save(buffer)
    buffer.seek(0)
    return send_file(buffer, as_attachment=True, download_name="employees.xlsx", mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")


@app.post("/employees/import")
def import_employees():
    emp = current_employee()
    if not has_role(emp, "ga_admin"):
        return redirect(url_for("index"))
    file = request.files.get("employee_file")
    if not file:
        return error_response("Please select an Excel file.", "employees")
    wb = load_workbook(file, data_only=True)
    ws = wb.active
    headers = [str(cell.value or "").strip() for cell in ws[1]]
    required = ["NIK", "Full Name", "Position", "Department", "Supervisor", "Phone Number", "Roles"]
    if headers[: len(required)] != required:
        return error_response("Invalid employee template columns.", "employees")
    valid_roles = set(ROLE_LABELS)
    imported = 0
    with db() as conn:
        for row_values in ws.iter_rows(min_row=2, values_only=True):
            nik, full_name, position, department, supervisor, phone, roles_text = [str(value or "").strip() for value in row_values[:7]]
            if not nik or not full_name or not position or not department or not phone:
                continue
            roles = [role.strip() for role in (roles_text or "user").split(",") if role.strip()]
            if any(role not in valid_roles for role in roles):
                conn.rollback()
                return error_response(f"Invalid role for NIK {nik}.", "employees")
            if conn.execute("select nik from employees where nik = ?", (nik,)).fetchone():
                conn.rollback()
                return error_response(f"NIK sudah terdaftar: {nik}", "employees")
            position = " ".join(position.split())
            department = " ".join(department.split())
            conn.execute("insert or ignore into option_lists (kind, value) values ('position', ?)", (position,))
            conn.execute("insert or ignore into option_lists (kind, value) values ('department', ?)", (department,))
            conn.execute(
                "insert into employees (nik, full_name, position, department, supervisor_nik, phone) values (?, ?, ?, ?, ?, ?)",
                (nik, full_name.upper(), position, department, supervisor or None, phone),
            )
            for role_name in roles or ["user"]:
                conn.execute("insert into employee_roles (nik, role) values (?, ?)", (nik, role_name))
            sync_driver_record(conn, nik, full_name.upper(), position, phone, roles)
            imported += 1
        conn.commit()
    return ok_response("employees", f"Imported {imported} employees")


def schedule_summary() -> dict:
    today = datetime.now().date().isoformat()
    month_prefix = today[:7]
    assigned_trips = trip_rows("r.status in (?, ?)", (STATUS_ASSIGNED, STATUS_ON_TRIP))
    queue_trips = trip_rows("r.status in (?, ?, ?)", (STATUS_PENDING, STATUS_APPROVED, STATUS_PROCESSING))
    monthly_source = trip_rows("r.status in (?, ?, ?, ?, ?)", (STATUS_PENDING, STATUS_APPROVED, STATUS_PROCESSING, STATUS_ASSIGNED, STATUS_ON_TRIP))
    daily = [item for item in assigned_trips if (item.get("start_date") or item["travel_date"]) <= today <= (item.get("end_date") or item["travel_date"])]
    queue_daily = [item for item in queue_trips if (item.get("start_date") or item["travel_date"]) <= today <= (item.get("end_date") or item["travel_date"])]
    monthly = monthly_source
    assigned_driver_ids = {item["driver_id"] for item in daily if item.get("driver_id")}
    all_drivers = rows("select * from drivers where status = 'ACTIVE' order by driver_name")
    return {
        "available_drivers": [driver for driver in all_drivers if driver["id"] not in assigned_driver_ids],
        "assigned_drivers": [driver for driver in all_drivers if driver["id"] in assigned_driver_ids],
        "drivers": all_drivers,
        "vehicles": rows("select * from vehicles order by plate_number"),
        "daily": daily,
        "queue_daily": queue_daily,
        "queue_monthly": queue_trips,
        "monthly": monthly,
    }


def vehicle_expiry_alerts() -> list[dict]:
    today = datetime.now().date()
    warning_until = today + timedelta(days=30)
    alerts = []
    vehicles = rows(
        """
        select id, plate_number, vehicle_name, stnk_expiry_date, kir_expiry_date
        from vehicles
        order by plate_number
        """
    )
    for vehicle in vehicles:
        for field, document in (("stnk_expiry_date", "STNK"), ("kir_expiry_date", "KIR")):
            raw_date = (vehicle.get(field) or "").strip()
            if not raw_date:
                continue
            try:
                expiry_date = datetime.fromisoformat(raw_date).date()
            except ValueError:
                logger.warning("Invalid %s expiry date for vehicle %s: %s", document, vehicle.get("id"), raw_date)
                continue
            if expiry_date <= warning_until:
                days_left = (expiry_date - today).days
                alerts.append({
                    "vehicle_id": vehicle["id"],
                    "plate_number": vehicle["plate_number"],
                    "vehicle_name": vehicle["vehicle_name"],
                    "document": document,
                    "expiry_date": raw_date,
                    "days_left": days_left,
                    "expired": days_left < 0,
                })
    return sorted(alerts, key=lambda item: (item["expiry_date"], item["plate_number"], item["document"]))


def add_months(year_month: str, months: int) -> str | None:
    if not year_month:
        return None
    try:
        year, month = [int(part) for part in year_month.split("-", 1)]
    except ValueError:
        return None
    month_index = (year * 12 + (month - 1)) + int(months or 0)
    return f"{month_index // 12:04d}-{month_index % 12 + 1:02d}"


def maintenance_alerts() -> list[dict]:
    today = datetime.now().date()
    warning_until = today + timedelta(days=30)
    alerts = []
    vehicles = rows(
        """
        select id, plate_number, vehicle_name, vehicle_type, current_km, last_maintenance_month, last_maintenance_date,
               maintenance_km_interval, maintenance_month_interval
        from vehicles
        order by plate_number
        """
    )
    for vehicle in vehicles:
        interval_km = int(vehicle.get("maintenance_km_interval") or 0)
        current_km = int(vehicle.get("current_km") or 0)
        if interval_km > 0:
            next_due_km = ((current_km // interval_km) + 1) * interval_km
            remaining_km = next_due_km - current_km
            if remaining_km <= 1000:
                alerts.append({
                    "type": "maintenance_km",
                    "vehicle_id": vehicle["id"],
                    "plate_number": vehicle["plate_number"],
                    "vehicle_name": vehicle["vehicle_name"],
                    "document": "KM Service",
                    "expiry_date": str(next_due_km),
                    "days_left": remaining_km,
                    "expired": remaining_km <= 0,
                    "message": f"{vehicle['plate_number']} mendekati jadwal service KM {next_due_km}. Sisa {max(remaining_km, 0)} KM.",
                })
        raw_maintenance_date = vehicle.get("last_maintenance_date") or (f"{vehicle.get('last_maintenance_month')}-01" if vehicle.get("last_maintenance_month") else "")
        due_month = add_months(raw_maintenance_date[:7], int(vehicle.get("maintenance_month_interval") or 0))
        if due_month:
            due_day = raw_maintenance_date[8:10] if len(raw_maintenance_date) >= 10 else "01"
            due_date = datetime.strptime(f"{due_month}-{due_day}", "%Y-%m-%d").date()
            days_left = (due_date - today).days
            if due_date <= warning_until:
                alerts.append({
                    "type": "maintenance_month",
                    "vehicle_id": vehicle["id"],
                    "plate_number": vehicle["plate_number"],
                    "vehicle_name": vehicle["vehicle_name"],
                    "document": "Bulan Service",
                    "expiry_date": due_month,
                    "days_left": days_left,
                    "expired": days_left < 0,
                    "message": f"{vehicle['plate_number']} mendekati jadwal service bulan {due_month}.",
                })
    return alerts


def vehicle_health_dashboard() -> list[dict]:
    alerts = maintenance_alerts() + vehicle_expiry_alerts()
    alert_map: dict[int, list[dict]] = {}
    for alert in alerts:
        alert_map.setdefault(alert["vehicle_id"], []).append(alert)
    vehicles = rows("select * from vehicles order by plate_number")
    health = []
    for vehicle in vehicles:
        usage = rows(
            """
            select km_start, km_end, fuel_liters
            from trip_requests
            where vehicle_id = ?
              and status = ?
              and coalesce(end_date, travel_date) >= ?
              and km_start is not null
              and km_end is not null
            """,
            (vehicle["id"], STATUS_COMPLETED, cutoff_date()),
        )
        total_km = sum(max(0, int(item["km_end"] or 0) - int(item["km_start"] or 0)) for item in usage)
        total_liters = sum(float(item.get("fuel_liters") or 0) for item in usage)
        km_per_liter = round(total_km / total_liters, 2) if total_liters else 0
        vehicle_alerts = alert_map.get(vehicle["id"], [])
        has_expired = any(alert.get("expired") for alert in vehicle_alerts)
        if vehicle["status"] == "MAINTENANCE" or has_expired or (total_liters and km_per_liter < 7):
            status = "Kurang sehat"
            score = 55
        elif vehicle_alerts or (total_liters and km_per_liter < 10):
            status = "Sehat"
            score = 78
        else:
            status = "Sangat sehat"
            score = 95
        health.append({
            "vehicle_id": vehicle["id"],
            "plate_number": vehicle["plate_number"],
            "vehicle_name": vehicle["vehicle_name"],
            "vehicle_type": vehicle["vehicle_type"],
            "current_km": vehicle.get("current_km") or 0,
            "status": status,
            "score": score,
            "alerts": len(vehicle_alerts),
            "km_3mo": total_km,
            "fuel_liters_3mo": round(total_liters, 2),
            "km_per_liter": km_per_liter,
        })
    return health


def task_notifications(emp: dict) -> list[dict]:
    notifications = []
    roles = normalize_roles(emp.get("roles"))
    if "pimpinan" in roles and "super_admin" not in roles:
        leader_items = trip_rows("e.supervisor_nik = ? and r.status = ?", (emp["nik"], STATUS_PENDING))
        for item in leader_items:
            notifications.append({
                "type": "approval",
                "title": "Approval Pimpinan",
                "message": f"{item['request_code']} menunggu approval.",
                "tab": "approval",
            })
    if has_role(emp, "ga_admin"):
        ga_items = trip_rows("r.status in (?, ?)", (STATUS_APPROVED, STATUS_PROCESSING))
        for item in ga_items:
            notifications.append({
                "type": "assignment",
                "title": "Assignment GA",
                "message": f"{item['request_code']} menunggu assignment driver/kendaraan.",
                "tab": "ga",
            })
    if has_role(emp, "driver"):
        driver_items = trip_rows("d.nik = ? and r.status = ?", (emp["nik"], STATUS_ASSIGNED))
        for item in driver_items:
            notifications.append({
                "type": "driver_start",
                "title": "Perjalanan Driver",
                "message": f"{item['request_code']} siap dimulai.",
                "tab": "driver",
            })
    if has_role(emp, "user"):
        review_items = trip_rows("r.requester_nik = ? and r.status = ? and coalesce(r.rating, 0) = 0", (emp["nik"], STATUS_COMPLETED))
        for item in review_items:
            notifications.append({
                "type": "review",
                "title": "Review Perjalanan",
                "message": f"{item['request_code']} menunggu review.",
                "tab": "history",
            })
    return notifications


def performance_scoreboard() -> dict:
    completed = trip_rows("r.status = ? and coalesce(r.rating, 0) > 0", (STATUS_COMPLETED,))
    total = len(completed)
    avg = round(sum(item["rating"] or 0 for item in completed) / total, 2) if total else 0

    def level(score: float) -> str:
        if score >= 4.5:
            return "Excellence"
        if score >= 3.5:
            return "Good"
        return "Poor"

    drivers = {}
    for item in completed:
        key = item.get("driver_id") or 0
        if key not in drivers:
            drivers[key] = {"driver_name": item.get("driver_name") or "-", "ratings": [], "completed": 0}
        drivers[key]["ratings"].append(item["rating"] or 0)
        drivers[key]["completed"] += 1
    driver_scores = []
    for data in drivers.values():
        driver_avg = round(sum(data["ratings"]) / len(data["ratings"]), 2) if data["ratings"] else 0
        driver_scores.append({
            "driver_name": data["driver_name"],
            "average_rating": driver_avg,
            "completed_trips": data["completed"],
            "level": level(driver_avg),
        })
    return {
        "overall_score": avg,
        "average_rating": avg,
        "total_completed_trips": total,
        "level": level(avg) if total else "-",
        "drivers": sorted(driver_scores, key=lambda item: item["average_rating"], reverse=True),
    }


def performance_history() -> list[dict]:
    today = datetime.now().date().replace(day=1)
    months = []
    for offset in range(23, -1, -1):
        month_index = today.year * 12 + today.month - 1 - offset
        months.append(f"{month_index // 12:04d}-{month_index % 12 + 1:02d}")
    completed = trip_rows("r.status = ? and coalesce(r.rating, 0) > 0", (STATUS_COMPLETED,))
    history = []
    for month in months:
        ratings = [
            item["rating"] or 0 for item in completed
            if ((item.get("end_date") or item["travel_date"]) or "")[:7] == month
        ]
        history.append({
            "month": month,
            "average_rating": round(sum(ratings) / len(ratings), 2) if ratings else 0,
            "completed_trips": len(ratings),
        })
    return history


def performance_daily_history() -> dict:
    completed = trip_rows("r.status = ? and coalesce(r.rating, 0) > 0", (STATUS_COMPLETED,))
    months = {item["month"] for item in performance_history()}
    result: dict[str, list[dict]] = {}
    for month in months:
        year, month_num = [int(part) for part in month.split("-")]
        days_in_month = (datetime(year + (1 if month_num == 12 else 0), 1 if month_num == 12 else month_num + 1, 1).date() - timedelta(days=1)).day
        rows_for_month = []
        for day in range(1, days_in_month + 1):
            date_key = f"{month}-{day:02d}"
            ratings = [
                item["rating"] or 0 for item in completed
                if (item.get("end_date") or item["travel_date"]) == date_key
            ]
            rows_for_month.append({
                "date": date_key,
                "average_rating": round(sum(ratings) / len(ratings), 2) if ratings else 0,
                "completed_trips": len(ratings),
            })
        result[month] = rows_for_month
    return result


@app.get("/api/data")
def api_data():
    emp = current_employee()
    if not emp:
        return jsonify({"authenticated": False})

    data: dict = {
        "authenticated": True,
        "me": emp,
        "language": current_language(),
        "roles": emp["roles"],
        "role_labels": ROLE_LABELS,
        "status_labels": {status: status_label(status) for status in [
            STATUS_PENDING, STATUS_REJECTED, STATUS_APPROVED, STATUS_PROCESSING,
            STATUS_ASSIGNED, STATUS_ON_TRIP, STATUS_COMPLETED, STATUS_REVIEWED, STATUS_CANCELED
        ]},
        "requests": [],
        "employees": [],
        "drivers": [],
        "vehicles": [],
        "vehicle_alerts": [],
        "maintenance_alerts": [],
        "notifications": [],
        "maintenance_vehicles": [],
        "user_reviews": [],
        "can_edit_vehicle_km": has_role(emp, "super_admin"),
        "schedule": schedule_summary(),
        "scoreboard": performance_scoreboard(),
        "performance_history": performance_history(),
        "performance_daily_history": performance_daily_history(),
        "vehicle_health": vehicle_health_dashboard(),
        "options": {
            "positions": option_values("position"),
            "departments": option_values("department"),
        },
        "stats": {},
    }

    if has_role(emp, "user"):
        data["requests"] = trip_rows("r.requester_nik = ?", (emp["nik"],))
    if has_role(emp, "pimpinan"):
        leader_items = trip_rows("(e.supervisor_nik = ? or ? = 1)", (emp["nik"], 1 if has_role(emp, "super_admin") else 0))
        data["leader_requests"] = leader_items
    if has_role(emp, "ga_admin"):
        data["ga_requests"] = trip_rows("r.status in (?, ?, ?, ?)", (STATUS_APPROVED, STATUS_PROCESSING, STATUS_ASSIGNED, STATUS_ON_TRIP))
        for item in data["ga_requests"]:
            item["availability"] = availability_for_trip(item)
        data["employees"] = rows(
            """
            select e.*, group_concat(er.role, ', ') as roles_text
            from employees e left join employee_roles er on er.nik = e.nik
            where e.active = 1
            group by e.nik order by e.full_name
            """
        )
        data["drivers"] = rows("select * from drivers where status = 'ACTIVE' order by driver_name")
        data["vehicles"] = rows("select * from vehicles order by plate_number")
        data["maintenance_vehicles"] = rows("select * from vehicles order by plate_number")
        data["user_reviews"] = trip_rows("coalesce(r.rating, 0) > 0")
        data["vehicle_alerts"] = vehicle_expiry_alerts()
        data["maintenance_alerts"] = maintenance_alerts()
    data["notifications"] = task_notifications(emp)
    if has_role(emp, "ga_admin"):
        data["notifications"].extend(data["vehicle_alerts"])
        data["notifications"].extend(data["maintenance_alerts"])
    if has_role(emp, "driver"):
        data["driver_requests"] = trip_rows("d.nik = ? and r.status in (?, ?, ?)", (emp["nik"], STATUS_ASSIGNED, STATUS_ON_TRIP, STATUS_COMPLETED))

    all_trips = trip_rows() if has_role(emp, "ga_admin", "pimpinan") else data["requests"]
    data["stats"] = {
        "total": len(all_trips),
        "pending": sum(1 for x in all_trips if x["status"] == STATUS_PENDING),
        "assigned": sum(1 for x in all_trips if x["status"] in [STATUS_ASSIGNED, STATUS_ON_TRIP]),
        "completed": sum(1 for x in all_trips if x["status"] == STATUS_COMPLETED),
        "review_required": row(
            "select count(*) as total from trip_requests where requester_nik = ? and status = ? and coalesce(rating, 0) = 0",
            (emp["nik"], STATUS_COMPLETED),
        )["total"],
    }
    return jsonify(data)


@app.get("/export/trips.xlsx")
def export_trips():
    emp = current_employee()
    if not has_role(emp, "ga_admin", "pimpinan"):
        return redirect(url_for("index"))
    wb = Workbook()
    ws = wb.active
    ws.title = "Trip History"
    headers = [
        "Request Code", "Requester", "Department", "Destination", "Purpose", "Start Date", "End Date", "Depart",
        "Return", "Passengers", "Status", "Driver", "Vehicle", "KM Start", "KM End", "Fuel (Liter)", "Fuel (Rp)",
        "Toll", "Rating", "Review",
    ]
    ws.append(headers)
    for item in trip_rows():
        ws.append([
            item["request_code"], item["full_name"], item["department"], item["destination"], item["purpose"],
            item.get("start_date") or item["travel_date"], item.get("end_date") or item["travel_date"], item["depart_time"], item["return_time"], item["passengers"], item["status"],
            item["driver_name"] or "", item["plate_number"] or "", item["km_start"] or "", item["km_end"] or "",
            item.get("fuel_liters") or 0, item["cost_fuel"] or 0, item["cost_toll"] or 0, item["rating"] or "", item["review"] or "",
        ])
    for column in ws.columns:
        ws.column_dimensions[column[0].column_letter].width = min(max(len(str(cell.value or "")) for cell in column) + 2, 34)
    buffer = io.BytesIO()
    wb.save(buffer)
    buffer.seek(0)
    return send_file(buffer, as_attachment=True, download_name="ga_trip_history.xlsx", mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")


@app.get("/export/reviews.xlsx")
def export_reviews():
    emp = current_employee()
    if not has_role(emp, "ga_admin"):
        return redirect(url_for("index"))
    start = request.args.get("start", "").strip()
    end = request.args.get("end", "").strip()
    if start and end and start > end:
        start, end = end, start
    wb = Workbook()
    ws = wb.active
    ws.title = "User Reviews"
    headers = [
        "Review Date", "Request Code", "Requester", "Department", "Destination", "Purpose",
        "Start Date", "End Date", "Driver", "Vehicle", "Rating", "Review", "Follow Up", "Proof File", "Proof Uploaded At",
    ]
    ws.append(headers)
    for item in trip_rows("coalesce(r.rating, 0) > 0"):
        review_month = ((item.get("updated_at") or item.get("end_date") or item.get("travel_date") or "")[:7])
        if start and review_month < start:
            continue
        if end and review_month > end:
            continue
        ws.append([
            (item.get("updated_at") or "")[:10],
            item["request_code"],
            item["full_name"],
            item["department"],
            item["destination"],
            item["purpose"],
            item.get("start_date") or item["travel_date"],
            item.get("end_date") or item["travel_date"],
            item.get("driver_name") or "",
            item.get("plate_number") or "",
            item.get("rating") or "",
            item.get("review") or "",
            item.get("review_follow_up") or "",
            item.get("review_proof_original_name") or "",
            item.get("review_proof_uploaded_at") or "",
        ])
    for column in ws.columns:
        ws.column_dimensions[column[0].column_letter].width = min(max(len(str(cell.value or "")) for cell in column) + 2, 42)
    buffer = io.BytesIO()
    wb.save(buffer)
    buffer.seek(0)
    return send_file(buffer, as_attachment=True, download_name="ga_user_reviews.xlsx", mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")


if __name__ == "__main__":
    seed_data()
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
