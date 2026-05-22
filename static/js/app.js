const moneyFormatter = new Intl.NumberFormat("id-ID");
let appData = null;
let lang = "id";
let dashboardPage = 1;
let performanceStartMonth = "";
let performanceEndMonth = "";
let reviewStartMonth = "";
let reviewEndMonth = "";
let userReviewPage = 1;
let scheduleMonthFilter = new Date().toISOString().slice(0, 7);
const BOOKING_DRAFT_KEY = "gaBookingDraft";
const BOOKING_SUBMITTING_KEY = "gaBookingSubmitting";

const I18N = {
  id: {
    logout: "Logout",
    navDashboard: "Dashboard",
    navBooking: "Booking",
    navHistory: "Riwayat Saya",
    navApproval: "Persetujuan",
    navGa: "Kontrol GA",
    navVehicles: "Manajemen Kendaraan",
    navMaintenance: "Perawatan Berkala",
    navUserReviews: "Review User",
    navEmployees: "Employee",
    navDriver: "Halaman Driver",
    historySubtitle: "Review wajib untuk perjalanan yang selesai.",
    approvalSubtitle: "Setujui atau tolak sesuai routing pimpinan user.",
    gaSubtitle: "Tugaskan kendaraan dan driver dengan deteksi konflik.",
    driverSubtitle: "Mulai dan selesaikan perjalanan dari halaman ini.",
    employeeMaster: "Master Employee",
    employeeSubtitle: "Sumber utama validasi NIK, routing approval, dan data role.",
    fullName: "Nama Lengkap",
    supervisorNik: "Pimpinan NIK",
    addEmployee: "Tambah Employee",
    manageOptions: "Kelola Pilihan Jabatan & Departemen",
    editEmployee: "Edit Employee",
    saveChanges: "Simpan Perubahan",
    dashboardTitle: "Dashboard Monitoring",
    dashboardSubtitle: "Ringkasan booking, approval, assignment, dan perjalanan selesai.",
    exportExcel: "Export Excel",
    statTotal: "Total Request",
    statPending: "Menunggu Persetujuan",
    statAssigned: "Ditugaskan / Berjalan",
    statCompleted: "Selesai",
    tripMonitoring: "Monitoring Perjalanan",
    driverSchedule: "Jadwal Driver",
    bookingTitle: "Booking Kendaraan",
    bookingSubtitle: "Data user otomatis diambil dari NIK login.",
    name: "Nama",
    department: "Departemen",
    destination: "Tujuan",
    purpose: "Keperluan",
    startDate: "Tanggal Mulai",
    endDate: "Tanggal Selesai",
    departTime: "Jam Berangkat",
    returnTime: "Jam Pulang",
    passengers: "Jumlah Penumpang",
    mapUrl: "Google Maps Link",
    notes: "Catatan Tambahan",
    submitRequest: "Kirim Request",
    vehicleTitle: "Manajemen Kendaraan",
    vehicleSubtitle: "Kelola master kendaraan operasional.",
    vehicleName: "Merk Kendaraan",
    plateNumber: "Nopol",
    vehicleType: "Tipe Kendaraan",
    capacity: "Kapasitas Kursi",
    vehicleStatus: "Status Kendaraan",
    stnkDate: "Tanggal STNK",
    kirDate: "Tanggal KIR",
    currentKm: "KM Akhir",
    lastMaintenanceMonth: "Tanggal Referensi Maintenance",
    maintenanceKmReference: "Referensi KM Perawatan",
    maintenanceMonthReference: "Interval Bulan Maintenance",
    maintenanceReferenceLink: "Link Referensi Perawatan",
    maintenanceDueMonth: "Tanggal Referensi Maintenance",
    maintenanceMonthInterval: "Interval Bulan Maintenance",
    maintenanceTitle: "Perawatan Berkala Kendaraan",
    maintenanceSubtitle: "Monitoring perawatan berkala kendaraan berdasarkan KM dan bulan perawatan.",
    preventiveMaintenance: "Perawatan Berkala",
    reference: "Referensi",
    openReference: "Buka Referensi",
    plateRule: "Checklist Plat",
    plateOdd: "Ganjil",
    plateEven: "Genap",
    plateFree: "Bebas",
    editBeforeAssign: "Edit Jadwal",
    editAssignment: "Edit Assignment",
    rejectByGa: "Reject oleh GA",
    noAvailableByRule: "Tidak ada kendaraan sesuai plat, kapasitas, dan jadwal.",
    addVehicle: "Tambah Kendaraan",
    vehicleList: "Daftar Kendaraan",
    vehicleDocAlerts: "Notifikasi Dokumen Kendaraan",
    notificationsTitle: "Notifikasi",
    notificationsEmpty: "Tidak ada notifikasi.",
    remainingKm: "sisa {km} KM",
    queueSchedule: "Jadwal Antrian",
    performanceChartTitle: "Grafik Performance GA",
    monitoringInterval: "Interval Monitoring:",
    until: "sd",
    allMonths: "12 Bulan",
    last12Months: "12 Bulan",
    last6Months: "6 Bulan",
    last3Months: "3 Bulan",
    dailyInMonth: "Harian",
    vehicleHealthTitle: "Dashboard Kesehatan Kendaraan",
    healthScore: "Skor Kesehatan",
    fuelLiters: "Liter BBM",
    parking: "Parkir",
    vehicleDocAlertEmpty: "Tidak ada STNK/KIR yang akan habis dalam 1 bulan.",
    expiresToday: "habis hari ini",
    expiredDays: "sudah habis {days} hari",
    expiresInDays: "habis dalam {days} hari",
    emptyTrips: "Belum ada data perjalanan.",
    emptyHistory: "Belum ada riwayat booking.",
    emptyApproval: "Tidak ada request menunggu persetujuan.",
    emptyGa: "Tidak ada request untuk diproses GA.",
    emptyDriver: "Belum ada tugas driver.",
    emptyVehicle: "Belum ada data kendaraan.",
    requester: "Pemesan",
    schedule: "Jadwal",
    leader: "Pimpinan",
    driver: "Driver",
    vehicle: "Kendaraan",
    cost: "Biaya",
    map: "Peta",
    openMaps: "Buka Google Maps",
    edit: "Edit",
    delete: "Delete",
    save: "Simpan",
    cancel: "Batal",
    cancelBooking: "Cancel Booking",
    confirmCancelBooking: "Batalkan booking ini?",
    approve: "Setujui",
    reject: "Tolak",
    processing: "Memproses...",
    approvalSuccessful: "Approval successful",
    rejectSuccessful: "Request rejected successfully",
    failedUpdateRequest: "Failed to update request",
    networkError: "Network error",
    assign: "Tugaskan",
    gaNote: "Catatan GA",
    leaderNote: "Catatan",
    review: "Review",
    userReviewsTitle: "Review User",
    userReviewsSubtitle: "Monitoring rating dan komentar perjalanan dari user.",
    reviewedAt: "Tanggal Review",
    followUp: "Tindak Lanjut",
    proof: "Bukti",
    uploadFollowUpProof: "Upload Bukti Tindak lanjut",
    downloadFollowUpProof: "Download bukti tindak lanjut",
    pdfOnly: "PDF",
    noUserReviews: "Belum ada review user.",
    sendReview: "Kirim Review",
    rating: "Rating",
    kmStart: "KM Awal",
    kmEnd: "KM Akhir",
    fuel: "BBM",
    toll: "Tol",
    startTrip: "Mulai Perjalanan",
    finishTrip: "Selesai",
    availableDrivers: "Driver Available",
    assignedDrivers: "Driver Assigned",
    dailySchedule: "Jadwal Harian",
    monthlySchedule: "Jadwal Bulanan",
    noSchedule: "Tidak ada jadwal.",
    noAvailableDrivers: "Tidak ada driver available untuk tanggal ini.",
    noAssignedDrivers: "Tidak ada driver assigned untuk tanggal ini.",
    noAvailableVehicles: "Tidak ada kendaraan available untuk tanggal ini.",
    noAssignedVehicles: "Tidak ada kendaraan assigned untuk tanggal ini.",
    action: "Aksi",
    position: "Jabatan",
    phone: "No Telp",
    role: "Role",
    supervisor: "Pimpinan",
    employeeDb: "Database Employee",
    confirmDeleteEmployee: "Hapus employee ini dari database?",
    confirmDeleteVehicle: "Hapus kendaraan ini?",
    confirmDeleteAllTrips: "Hapus semua riwayat perjalanan?",
    deleteAllTrips: "Hapus Semua Riwayat",
    scoreboardTitle: "Scoreboard Performa GA",
    overallScore: "Skor GA",
    totalCompletedTrips: "Trip Selesai",
    avgRating: "Rata-rata Rating",
    level: "Level",
    rank: "Peringkat",
    noRatingYet: "Belum ada rating",
    exportEmployees: "Export Employee",
    downloadTemplate: "Download Template",
    importEmployees: "Import Employee",
    chooseFile: "Pilih File",
    availableVehicles: "Kendaraan Available",
    assignedVehicles: "Kendaraan Assigned",
    prevMonth: "Bulan Sebelumnya",
    nextMonth: "Bulan Berikutnya",
    addOther: "Tambahkan lainnya +",
    selectPosition: "Pilih Jabatan",
    selectDepartment: "Pilih Departemen",
    requiredReviewWarning: "perjalanan selesai belum direview. Booking baru akan diblokir jika mencapai 3 perjalanan.",
    editedAt: "Terakhir diedit",
  },
  en: {
    logout: "Logout",
    navDashboard: "Dashboard",
    navBooking: "Booking",
    navHistory: "My History",
    navApproval: "Approval",
    navGa: "GA Control",
    navVehicles: "Vehicle Management",
    navMaintenance: "Preventive Maintenance",
    navUserReviews: "User Reviews",
    navEmployees: "Employee",
    navDriver: "Driver Page",
    historySubtitle: "Reviews are required for completed trips.",
    approvalSubtitle: "Approve or reject based on the requester's leader routing.",
    gaSubtitle: "Assign vehicles and drivers with conflict detection.",
    driverSubtitle: "Start and complete trips from this page.",
    employeeMaster: "Employee Master",
    employeeSubtitle: "Primary source for Employee ID validation, approval routing, and role data.",
    fullName: "Full Name",
    supervisorNik: "Supervisor ID",
    addEmployee: "Add Employee",
    manageOptions: "Manage Position & Department Options",
    editEmployee: "Edit Employee",
    saveChanges: "Save Changes",
    dashboardTitle: "Monitoring Dashboard",
    dashboardSubtitle: "Summary of bookings, approvals, assignments, and completed trips.",
    exportExcel: "Export Excel",
    statTotal: "Total Requests",
    statPending: "Pending Approval",
    statAssigned: "Assigned / On Trip",
    statCompleted: "Completed",
    tripMonitoring: "Trip Monitoring",
    driverSchedule: "Driver Schedule",
    bookingTitle: "Vehicle Booking",
    bookingSubtitle: "User data is automatically loaded from the logged-in Employee ID.",
    name: "Name",
    department: "Department",
    destination: "Destination",
    purpose: "Purpose",
    startDate: "Start Date",
    endDate: "End Date",
    departTime: "Departure Time",
    returnTime: "Return Time",
    passengers: "Passengers",
    mapUrl: "Google Maps Link",
    notes: "Additional Notes",
    submitRequest: "Submit Request",
    vehicleTitle: "Vehicle Management",
    vehicleSubtitle: "Manage operational vehicle master data.",
    vehicleName: "Vehicle Brand",
    plateNumber: "License Plate",
    vehicleType: "Vehicle Type",
    capacity: "Seat Capacity",
    vehicleStatus: "Vehicle Status",
    stnkDate: "STNK Date",
    kirDate: "KIR Date",
    currentKm: "End KM",
    lastMaintenanceMonth: "Maintenance Reference Date",
    maintenanceKmReference: "Maintenance KM Reference",
    maintenanceMonthReference: "Maintenance Month Interval",
    maintenanceReferenceLink: "Maintenance Reference Link",
    maintenanceDueMonth: "Maintenance Reference Date",
    maintenanceMonthInterval: "Maintenance Month Interval",
    maintenanceTitle: "Vehicle Preventive Maintenance",
    maintenanceSubtitle: "Monitor scheduled vehicle maintenance by KM and maintenance month.",
    preventiveMaintenance: "Preventive Maintenance",
    reference: "Reference",
    openReference: "Open Reference",
    plateRule: "Plate Checklist",
    plateOdd: "Odd",
    plateEven: "Even",
    plateFree: "Free",
    editBeforeAssign: "Edit Schedule",
    editAssignment: "Edit Assignment",
    rejectByGa: "Reject by GA",
    noAvailableByRule: "No vehicles match the plate rule, capacity, and schedule.",
    addVehicle: "Add Vehicle",
    vehicleList: "Vehicle List",
    vehicleDocAlerts: "Vehicle Document Alerts",
    notificationsTitle: "Notifications",
    notificationsEmpty: "No notifications.",
    remainingKm: "{km} KM remaining",
    queueSchedule: "Queue Schedule",
    performanceChartTitle: "GA Performance Chart",
    monitoringInterval: "Monitoring Interval:",
    until: "to",
    allMonths: "12 Months",
    last12Months: "12 Months",
    last6Months: "6 Months",
    last3Months: "3 Months",
    dailyInMonth: "Daily",
    vehicleHealthTitle: "Vehicle Health Dashboard",
    healthScore: "Health Score",
    fuelLiters: "Fuel Liters",
    parking: "Parking",
    vehicleDocAlertEmpty: "No STNK/KIR will expire within 1 month.",
    expiresToday: "expires today",
    expiredDays: "expired {days} days ago",
    expiresInDays: "expires in {days} days",
    emptyTrips: "No trip data yet.",
    emptyHistory: "No booking history yet.",
    emptyApproval: "No requests waiting for approval.",
    emptyGa: "No requests to process.",
    emptyDriver: "No driver assignments yet.",
    emptyVehicle: "No vehicle data yet.",
    requester: "Requester",
    schedule: "Schedule",
    leader: "Leader",
    driver: "Driver",
    vehicle: "Vehicle",
    cost: "Cost",
    map: "Map",
    openMaps: "Open Google Maps",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    cancelBooking: "Cancel Booking",
    confirmCancelBooking: "Cancel this booking?",
    approve: "Approve",
    reject: "Reject",
    processing: "Processing...",
    approvalSuccessful: "Approval successful",
    rejectSuccessful: "Request rejected successfully",
    failedUpdateRequest: "Failed to update request",
    networkError: "Network error",
    assign: "Assign",
    gaNote: "GA Note",
    leaderNote: "Note",
    review: "Review",
    userReviewsTitle: "User Reviews",
    userReviewsSubtitle: "Monitor user trip ratings and comments.",
    reviewedAt: "Review Date",
    followUp: "Follow Up",
    proof: "Proof",
    uploadFollowUpProof: "Upload Follow-up Proof",
    downloadFollowUpProof: "Download Follow-up Proof",
    pdfOnly: "PDF",
    noUserReviews: "No user reviews yet.",
    sendReview: "Submit Review",
    rating: "Rating",
    kmStart: "Start KM",
    kmEnd: "End KM",
    fuel: "Fuel",
    toll: "Toll",
    startTrip: "Start Trip",
    finishTrip: "Finish",
    availableDrivers: "Available Drivers",
    assignedDrivers: "Assigned Drivers",
    dailySchedule: "Daily Schedule",
    monthlySchedule: "Monthly Schedule",
    noSchedule: "No schedule.",
    noAvailableDrivers: "No available drivers for selected date.",
    noAssignedDrivers: "No assigned drivers for selected date.",
    noAvailableVehicles: "No available vehicles for selected date.",
    noAssignedVehicles: "No assigned vehicles for selected date.",
    action: "Action",
    position: "Position",
    phone: "Phone",
    role: "Role",
    supervisor: "Supervisor",
    employeeDb: "Employee Database",
    confirmDeleteEmployee: "Delete this employee from the database?",
    confirmDeleteVehicle: "Delete this vehicle?",
    confirmDeleteAllTrips: "Delete all trip history?",
    deleteAllTrips: "Delete All Trip History",
    scoreboardTitle: "GA Performance Scoreboard",
    overallScore: "GA Score",
    totalCompletedTrips: "Completed Trips",
    avgRating: "Average Rating",
    level: "Level",
    rank: "Rank",
    noRatingYet: "No rating yet",
    exportEmployees: "Export Employees",
    downloadTemplate: "Download Template",
    importEmployees: "Import Employees",
    chooseFile: "Choose File",
    availableVehicles: "Available Vehicles",
    assignedVehicles: "Assigned Vehicles",
    prevMonth: "Previous Month",
    nextMonth: "Next Month",
    addOther: "Add other +",
    selectPosition: "Select Position",
    selectDepartment: "Select Department",
    requiredReviewWarning: "completed trips have not been reviewed. New bookings will be blocked after 3 trips.",
    editedAt: "Last edited",
  },
};

const statusClass = {
  pending_leader_approval: "pending",
  rejected: "rejected",
  approved: "approved",
  processing_ga: "processing",
  assigned: "assigned",
  on_trip: "on",
  completed: "completed",
  reviewed: "completed",
  canceled: "rejected",
};

function canonicalStatus(status) {
  const value = String(status || "").trim();
  const aliases = {
    "PENDING LEADER APPROVAL": "pending_leader_approval",
    "Pending Leader Approval": "pending_leader_approval",
    Pending: "pending_leader_approval",
    "APPROVED BY LEADER": "approved",
    "Approved by Leader": "approved",
    Approved: "approved",
    REJECTED: "rejected",
    Rejected: "rejected",
    "PROCESSING GA": "processing_ga",
    "ASSIGNED TO DRIVER": "assigned",
    "ON TRIP": "on_trip",
    COMPLETED: "completed",
    Reviewed: "reviewed",
    Canceled: "canceled",
  };
  return aliases[value] || value.toLowerCase().replaceAll(" ", "_");
}

function t(key) {
  return I18N[lang]?.[key] || I18N.id[key] || key;
}

function applyTranslations() {
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
}

function message(key, replacements = {}) {
  return Object.entries(replacements).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, value), t(key));
}

function activateTab(tabName) {
  const button = document.querySelector(`.nav-item[data-tab="${tabName}"]`);
  const panel = document.getElementById(tabName);
  if (!button || !panel) return;
  const currentPanel = document.querySelector(".tab-panel.active");
  if (currentPanel?.id === "booking" && tabName !== "booking") {
    clearBookingDraft(true);
  }
  document.getElementById("page-alert")?.remove();
  document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
  document.querySelectorAll(".tab-panel").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  panel.classList.add("active");
}

document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => activateTab(button.dataset.tab));
});

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function rupiah(value) {
  return `Rp ${moneyFormatter.format(Number(value || 0))}`;
}

function formatDate(value) {
  if (!value) return "-";
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(lang === "en" ? "en-US" : "id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function formatMonthYear(value) {
  if (!value) return "-";
  const parsed = new Date(`${value}-01T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  const locale = lang === "en" ? "en-US" : "id-ID";
  const month = parsed.toLocaleDateString(locale, { month: "long" });
  return `${month.charAt(0).toUpperCase()}${month.slice(1)} - ${parsed.getFullYear()}`;
}

function monthName(monthIndex) {
  const locale = lang === "en" ? "en-US" : "id-ID";
  const label = new Date(2026, monthIndex, 1).toLocaleDateString(locale, { month: "long" });
  return `${label.charAt(0).toUpperCase()}${label.slice(1)}`;
}

function composeMonthValue(year, monthIndex) {
  return `${year}-${String(Number(monthIndex) + 1).padStart(2, "0")}`;
}

function monthSerial(value) {
  if (!value) return 0;
  const [year, month] = value.split("-").map(Number);
  return year * 12 + month - 1;
}

function monthDiff(start, end) {
  return monthSerial(end) - monthSerial(start);
}

function shiftMonth(value, offset) {
  const serial = monthSerial(value) + offset;
  return `${Math.floor(serial / 12)}-${String((serial % 12) + 1).padStart(2, "0")}`;
}

function plateRuleLabel(value) {
  if (value === "ganjil") return t("plateOdd");
  if (value === "genap") return t("plateEven");
  return t("plateFree");
}

function numericMoney(value) {
  return String(value || "").replace(/\D/g, "");
}

function formatMoneyInput(input) {
  const raw = numericMoney(input.value);
  input.value = raw ? rupiah(raw) : "";
}

document.addEventListener("input", (event) => {
  if (event.target.matches("[data-money]")) formatMoneyInput(event.target);
});

document.addEventListener("submit", (event) => {
  event.target.querySelectorAll("[data-money]").forEach((input) => {
    input.value = numericMoney(input.value);
  });
});

async function refreshData() {
  const response = await fetch("/api/data");
  appData = await response.json();
  renderStats();
  renderDashboard();
  renderScoreboard();
  renderPerformanceChart();
  renderVehicleHealth();
  renderSchedule();
  renderHistory();
  renderApproval();
  renderGa();
  renderDriver();
  renderVehicles();
  renderVehicleAlerts();
  renderMaintenance();
  renderUserReviews();
  renderEmployees();
  renderOptionManager();
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 10000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

document.addEventListener("submit", async (event) => {
  const form = event.target;
  if (!form.matches("[data-ajax-form], #approval-list form, #ga-list form, #user-review-list form")) return;
  event.preventDefault();
  const confirmKey = form.dataset.confirmKey;
  if (confirmKey && !window.confirm(t(confirmKey))) return;
  const submitter = event.submitter || document.activeElement;
  const formData = new FormData(form);
  if (submitter?.name) {
    formData.set(submitter.name, submitter.value);
  }
  const buttons = Array.from(form.querySelectorAll("button"));
  const originalLabels = buttons.map((button) => button.textContent);
  buttons.forEach((button) => {
    button.disabled = true;
    if (button === submitter) button.textContent = t("processing");
  });
  const isApprovalForm = !!form.closest("#approval-list");
  const actionUrl = form.getAttribute("action") || "";
  if (isApprovalForm) {
    console.log("Approval request", {
      requestId: actionUrl.split("/").slice(-2, -1)[0],
      action: submitter?.value,
      url: actionUrl,
      payload: Object.fromEntries(formData.entries()),
    });
  }

  let response;
  try {
    response = await fetchWithTimeout(actionUrl, {
      method: (form.method || "POST").toUpperCase(),
      body: formData,
      headers: { "X-Requested-With": "fetch", Accept: "application/json" },
    }, 10000);
  } catch (error) {
    console.error("Fetch/network error", error);
    window.alert(t("networkError"));
    buttons.forEach((button, index) => {
      button.disabled = false;
      button.textContent = originalLabels[index];
    });
    return;
  }

  try {
    const contentType = response.headers.get("content-type") || "";
    const result = contentType.includes("application/json")
      ? await response.json()
      : { ok: false, message: await response.text() || t("failedUpdateRequest") };
    if (isApprovalForm) console.log("Approval response", result);
    if (!response.ok || !result.ok) {
      window.alert(result.message || t("failedUpdateRequest"));
    } else if (isApprovalForm) {
      window.alert(submitter?.value === "reject" ? t("rejectSuccessful") : t("approvalSuccessful"));
      activateTab("approval");
      form.closest(".trip-card")?.remove();
    }
    buttons.forEach((button, index) => {
      button.disabled = false;
      button.textContent = originalLabels[index];
    });
    try {
      await Promise.race([
        refreshData(),
        new Promise((_, reject) => setTimeout(() => reject(new Error("refresh timeout")), 5000)),
      ]);
      if (isApprovalForm) activateTab("approval");
    } catch (renderError) {
      console.error("Refresh/render error after successful request", renderError);
    }
  } catch (error) {
    console.error("Response handling error", error);
    window.alert(t("failedUpdateRequest"));
  } finally {
    buttons.forEach((button, index) => {
      button.disabled = false;
      button.textContent = originalLabels[index];
    });
  }
});

function badge(status) {
  const canonical = canonicalStatus(status);
  return `<span class="badge ${statusClass[canonical] || "pending"}">${escapeHtml(appData.status_labels?.[canonical] || appData.status_labels?.[status] || status)}</span>`;
}

function empty(text) {
  return `<div class="empty">${text}</div>`;
}

function dateRange(item) {
  const start = item.start_date || item.travel_date;
  const end = item.end_date || item.travel_date;
  return start === end ? start : `${start} - ${end}`;
}

function sortedOptions(options) {
  return [...new Set(options || [])].sort((a, b) => a.localeCompare(b, "id", { sensitivity: "base" }));
}

function renderOptionSelects() {
  const configs = [
    { id: "employee-position", kind: "position", placeholder: t("selectPosition"), addLabel: t("addOther"), optionsKey: "positions" },
    { id: "edit-position", kind: "position", placeholder: t("selectPosition"), addLabel: t("addOther"), optionsKey: "positions" },
    { id: "employee-department", kind: "department", placeholder: t("selectDepartment"), addLabel: t("addOther"), optionsKey: "departments" },
    { id: "edit-department", kind: "department", placeholder: t("selectDepartment"), addLabel: t("addOther"), optionsKey: "departments" },
  ];

  configs.forEach((config) => {
    const select = document.getElementById(config.id);
    if (!select) return;
    const selected = select.value;
    const options = sortedOptions(appData.options?.[config.optionsKey] || []);
    select.innerHTML = `<option value="">${config.placeholder}</option>${options.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join("")}<option value="__add__">${config.addLabel}</option>`;
    if (selected && options.includes(selected)) select.value = selected;
  });
}

async function addDropdownOption(select) {
  const kind = select.dataset.optionKind;
  const value = window.prompt(kind === "position" ? t("position") : t("department"));
  if (!value || !value.trim()) {
    select.value = "";
    return;
  }
  const response = await fetch("/options", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind, value: value.trim() }),
  });
  const result = await response.json();
  if (!result.ok) {
    window.alert(result.message || "Failed");
    select.value = "";
    return;
  }
  if (kind === "position") appData.options.positions = result.options;
  if (kind === "department") appData.options.departments = result.options;
  renderOptionSelects();
  renderOptionManager();
  select.value = result.value;
}

async function deleteDropdownOption(kind, value) {
  if (!window.confirm(`${t("delete")} "${value}"?`)) return;
  const response = await fetch("/options/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind, value }),
  });
  const result = await response.json();
  if (!result.ok) return window.alert(result.message || "Failed");
  if (kind === "position") appData.options.positions = result.options;
  if (kind === "department") appData.options.departments = result.options;
  renderOptionSelects();
  renderOptionManager();
}

function tripCard(item, actions = "") {
  const costs = Number(item.cost_fuel || 0) + Number(item.cost_toll || 0);
  const maps = item.map_url ? `<div><strong>${t("map")}</strong><a href="${escapeHtml(item.map_url)}" target="_blank" rel="noopener">${t("openMaps")}</a></div>` : `<div><strong>${t("map")}</strong>-</div>`;
  return `
    <article class="trip-card">
      <div class="trip-top">
        <div>
          <h3>${escapeHtml(item.request_code)} - ${escapeHtml(item.full_name)}</h3>
          <span>${escapeHtml(item.department)} / ${escapeHtml(item.position || "")}</span>
        </div>
        ${badge(item.status)}
      </div>
      <div class="trip-meta">
        <div><strong>${t("destination")}</strong>${escapeHtml(item.destination)}</div>
        <div><strong>${t("schedule")}</strong>${escapeHtml(dateRange(item))} ${escapeHtml(item.depart_time)}-${escapeHtml(item.return_time)}</div>
        <div><strong>${t("passengers")}</strong>${escapeHtml(item.passengers)}</div>
        <div><strong>${t("plateRule")}</strong>${escapeHtml(plateRuleLabel(item.plate_rule))}</div>
        <div><strong>${t("leader")}</strong>${escapeHtml(item.supervisor_name || "-")}</div>
        <div><strong>${t("driver")}</strong>${escapeHtml(item.driver_name || "-")}</div>
        <div><strong>${t("vehicle")}</strong>${escapeHtml(item.plate_number || "-")} ${escapeHtml(item.vehicle_name || "")}</div>
        <div><strong>KM</strong>${escapeHtml(item.km_start || "-")} - ${escapeHtml(item.km_end || "-")}</div>
        <div><strong>${t("cost")}</strong>${rupiah(costs)}</div>
        ${maps}
      </div>
      <p>${escapeHtml(item.purpose)}${item.notes ? " - " + escapeHtml(item.notes) : ""}</p>
      ${item.edited_at ? `<p><strong>${t("editedAt")}:</strong> ${escapeHtml(item.edited_at)}</p>` : ""}
      ${item.leader_note ? `<p><strong>${t("leaderNote")}:</strong> ${escapeHtml(item.leader_note)}</p>` : ""}
      ${item.ga_note ? `<p><strong>${t("gaNote")}:</strong> ${escapeHtml(item.ga_note)}</p>` : ""}
      ${item.rating ? `<p><strong>${t("review")}:</strong> ${"★".repeat(item.rating)} ${escapeHtml(item.review || "")}</p>` : ""}
      ${actions ? `<div class="trip-actions">${actions}</div>` : ""}
    </article>
  `;
}

function bookingEditForm(item) {
  const plateRule = item.plate_rule || "bebas";
  return `
    <form class="form-grid compact" method="post" action="/requests/${item.id}/update">
      <label>${t("destination")}<input name="destination" value="${escapeHtml(item.destination)}" required></label>
      <label>${t("purpose")}<input name="purpose" value="${escapeHtml(item.purpose)}" required></label>
      <label>${t("startDate")}<input name="start_date" type="date" min="${todayIso()}" value="${escapeHtml(item.start_date || item.travel_date)}" required></label>
      <label>${t("endDate")}<input name="end_date" type="date" min="${todayIso()}" value="${escapeHtml(item.end_date || item.travel_date)}" required></label>
      <label>${t("departTime")}<input name="depart_time" type="time" value="${escapeHtml(item.depart_time)}" required></label>
      <label>${t("returnTime")}<input name="return_time" type="time" value="${escapeHtml(item.return_time)}" required></label>
      <label>${t("passengers")}<input name="passengers" type="number" min="1" max="50" value="${escapeHtml(item.passengers)}" required></label>
      <fieldset class="span-2 choice-group compact-choice">
        <legend>${t("plateRule")}</legend>
        <label><input type="radio" name="plate_rule" value="bebas" ${plateRule === "bebas" ? "checked" : ""}> ${t("plateFree")}</label>
        <label><input type="radio" name="plate_rule" value="ganjil" ${plateRule === "ganjil" ? "checked" : ""}> ${t("plateOdd")}</label>
        <label><input type="radio" name="plate_rule" value="genap" ${plateRule === "genap" ? "checked" : ""}> ${t("plateEven")}</label>
      </fieldset>
      <label>${t("mapUrl")}<input name="map_url" type="url" value="${escapeHtml(item.map_url || "")}"></label>
      <label class="span-2">${t("notes")}<textarea name="notes" rows="2">${escapeHtml(item.notes || "")}</textarea></label>
      <button class="button primary span-2" type="submit">${t("save")}</button>
    </form>
  `;
}

function historyBookingActions(item, status) {
  const canEdit = status === "pending_leader_approval" || status === "rejected";
  const canCancel = ["pending_leader_approval", "approved", "processing_ga", "rejected"].includes(status);
  if (!canEdit && !canCancel) return "";
  return `
    <div class="history-action-row">
      ${canEdit ? `<details class="action-collapse"><summary>${t("edit")}</summary>${bookingEditForm(item)}</details>` : ""}
      ${canCancel ? `<form class="inline-delete" method="post" action="/requests/${item.id}/cancel" onsubmit="return confirm('${escapeHtml(t("confirmCancelBooking"))}')"><button class="button danger small" type="submit">${t("cancelBooking")}</button></form>` : ""}
    </div>
  `;
}

function renderStats() {
  const stats = appData.stats || {};
  const filtered = chartFilteredItems();
  const pending = filtered.filter((item) => canonicalStatus(item.status) === "pending_leader_approval").length;
  const assigned = filtered.filter((item) => ["assigned", "on_trip"].includes(canonicalStatus(item.status))).length;
  const completed = filtered.filter((item) => ["completed", "reviewed"].includes(canonicalStatus(item.status))).length;
  document.getElementById("stat-total").textContent = filtered.length;
  document.getElementById("stat-pending").textContent = pending;
  document.getElementById("stat-assigned").textContent = assigned;
  document.getElementById("stat-completed").textContent = completed;
  const warning = document.getElementById("review-warning");
  if (stats.review_required > 0) {
    warning.textContent = `${stats.review_required} ${t("requiredReviewWarning")}`;
    warning.classList.remove("hidden");
  } else {
    warning.classList.add("hidden");
  }
}

function allDashboardItems() {
  const items = [...(appData.ga_requests || []), ...(appData.leader_requests || []), ...(appData.requests || []), ...(appData.driver_requests || [])];
  return [...new Map(items.map((item) => [item.id, item])).values()];
}

function selectedChartMonths() {
  const history = appData.performance_history || [];
  if (!history.length) return [];
  if (!performanceStartMonth || !history.some((item) => item.month === performanceStartMonth)) {
    performanceStartMonth = history[Math.max(0, history.length - 12)].month;
  }
  if (!performanceEndMonth || !history.some((item) => item.month === performanceEndMonth)) {
    performanceEndMonth = history[history.length - 1].month;
  }
  let start = performanceStartMonth <= performanceEndMonth ? performanceStartMonth : performanceEndMonth;
  let end = performanceStartMonth <= performanceEndMonth ? performanceEndMonth : performanceStartMonth;
  if (monthDiff(start, end) > 12) {
    if (performanceEndMonth === end) {
      start = shiftMonth(end, -12);
      performanceStartMonth = start;
    } else {
      end = shiftMonth(start, 12);
      performanceEndMonth = end;
    }
  }
  return history.filter((item) => item.month >= start && item.month <= end);
}

function initMonthInterval(startValue, endValue) {
  const history = appData.performance_history || [];
  if (!history.length) return { start: "", end: "" };
  let start = startValue && history.some((item) => item.month === startValue) ? startValue : history[Math.max(0, history.length - 12)].month;
  let end = endValue && history.some((item) => item.month === endValue) ? endValue : history[history.length - 1].month;
  if (start > end) [start, end] = [end, start];
  if (monthDiff(start, end) > 12) start = shiftMonth(end, -12);
  return { start, end };
}

function populateIntervalControls(prefix, startValue, endValue) {
  const history = appData.performance_history || [];
  const startMonthFilter = document.getElementById(`${prefix}-start-month-filter`);
  const startYearFilter = document.getElementById(`${prefix}-start-year-filter`);
  const endMonthFilter = document.getElementById(`${prefix}-end-month-filter`);
  const endYearFilter = document.getElementById(`${prefix}-end-year-filter`);
  if (!startMonthFilter || !startYearFilter || !endMonthFilter || !endYearFilter || !history.length) return;
  const years = [...new Set(history.map((item) => item.month.slice(0, 4)))];
  const monthOptions = Array.from({ length: 12 }, (_, index) => `<option value="${index}">${escapeHtml(monthName(index))}</option>`).join("");
  const yearOptions = years.map((year) => `<option value="${escapeHtml(year)}">${escapeHtml(year)}</option>`).join("");
  [startMonthFilter, endMonthFilter].forEach((filter) => { filter.innerHTML = monthOptions; });
  [startYearFilter, endYearFilter].forEach((filter) => { filter.innerHTML = yearOptions; });
  startYearFilter.value = startValue.slice(0, 4);
  startMonthFilter.value = String(Number(startValue.slice(5, 7)) - 1);
  endYearFilter.value = endValue.slice(0, 4);
  endMonthFilter.value = String(Number(endValue.slice(5, 7)) - 1);
}

function filteredDashboardItems() {
  const items = allDashboardItems();
  return items.filter((item) => {
    const start = item.start_date || item.travel_date || "";
    const end = item.end_date || item.travel_date || "";
    return start.slice(0, 7) <= scheduleMonthFilter && end.slice(0, 7) >= scheduleMonthFilter;
  });
}

function chartFilteredItems() {
  const items = allDashboardItems();
  const months = new Set(selectedChartMonths().map((item) => item.month));
  return months.size ? items.filter((item) => {
    const start = item.start_date || item.travel_date || "";
    const end = item.end_date || item.travel_date || "";
    return [...months].some((month) => start.slice(0, 7) <= month && end.slice(0, 7) >= month);
  }) : items;
}

function renderDashboard() {
  const list = document.getElementById("dashboard-list");
  const pagination = document.getElementById("dashboard-pagination");
  const unique = filteredDashboardItems();
  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(unique.length / pageSize));
  dashboardPage = Math.min(Math.max(dashboardPage, 1), totalPages);
  const pageItems = unique.slice((dashboardPage - 1) * pageSize, dashboardPage * pageSize);
  list.innerHTML = pageItems.length ? pageItems.map((item) => tripCard(item)).join("") : empty(t("emptyTrips"));
  if (!pagination) return;
  pagination.innerHTML = unique.length > pageSize ? Array.from({ length: totalPages }, (_, index) => {
    const page = index + 1;
    return `<button class="button small ${page === dashboardPage ? "primary" : "secondary"}" type="button" data-dashboard-page="${page}">${page}</button>`;
  }).join("") : "";
}

function renderScoreboard() {
  const target = document.getElementById("scoreboard-list");
  if (!target) return;
  const completed = filteredDashboardItems().filter((item) => Number(item.rating || 0) > 0);
  const average = completed.length ? Math.round((completed.reduce((sum, item) => sum + Number(item.rating || 0), 0) / completed.length) * 100) / 100 : 0;
  const level = average >= 4.5 ? "Excellence" : average >= 3.5 ? "Good" : completed.length ? "Poor" : "-";
  const drivers = {};
  const allDrivers = [...(appData.schedule?.drivers || []), ...(appData.drivers || [])];
  allDrivers.forEach((driver) => {
    const key = driver.driver_name || "-";
    if (!drivers[key]) drivers[key] = { name: key, ratings: [] };
  });
  completed.forEach((item) => {
    const key = item.driver_name || "-";
    if (!drivers[key]) drivers[key] = { name: key, ratings: [] };
    drivers[key].ratings.push(Number(item.rating || 0));
  });
  const rankedDrivers = Object.values(drivers)
    .map((driver) => {
      const total = driver.ratings.length;
      const driverAverage = total ? Math.round((driver.ratings.reduce((sum, rating) => sum + rating, 0) / total) * 100) / 100 : 0;
      const driverLevel = driverAverage >= 4.5 ? "Excellence" : driverAverage >= 3.5 ? "Good" : total ? "Poor" : t("noRatingYet");
      return { ...driver, average: driverAverage, total, level: driverLevel };
    })
    .sort((a, b) => b.average - a.average || b.total - a.total || a.name.localeCompare(b.name));
  const driverCards = rankedDrivers.map((driver, index) => {
    const rank = index + 1;
    const isTopRank = rank <= 3;
    const tone = driver.total ? String(driver.level || "").toLowerCase() : "empty-score";
    return `
    <article class="score-card driver-score ${isTopRank ? "top-rank" : ""} ${tone}">
      <div class="rank-badge">${t("rank")} ${rank}</div>
      <span>${escapeHtml(driver.name)}</span>
      <strong>${escapeHtml(driver.average)}</strong>
      <small>${escapeHtml(driver.level)} / ${driver.total} ${t("totalCompletedTrips")}</small>
    </article>`;
  }).join("");
  target.innerHTML = `
    <div class="scoreboard-grid">
      <article class="score-card ga-score ${String(level).toLowerCase()}"><span>${t("overallScore")}</span><strong>${escapeHtml(average)}</strong><small>${escapeHtml(level)}</small></article>
      <article class="score-card"><span>${t("avgRating")}</span><strong>${escapeHtml(average)}</strong></article>
      <article class="score-card"><span>${t("totalCompletedTrips")}</span><strong>${escapeHtml(completed.length)}</strong></article>
      ${driverCards || `<article class="score-card"><span>${t("driver")}</span><strong>0</strong></article>`}
    </div>
  `;
}

function renderPerformanceChart() {
  const target = document.getElementById("performance-chart");
  const startMonthFilter = document.getElementById("performance-start-month-filter");
  const startYearFilter = document.getElementById("performance-start-year-filter");
  const endMonthFilter = document.getElementById("performance-end-month-filter");
  const endYearFilter = document.getElementById("performance-end-year-filter");
  if (!target || !startMonthFilter || !startYearFilter || !endMonthFilter || !endYearFilter) return;
  selectedChartMonths();
  populateIntervalControls("performance", performanceStartMonth, performanceEndMonth);
  const months = selectedChartMonths();
  const data = months;
  const points = data.length ? data : [{ month: "-", date: "-", average_rating: 0, completed_trips: 0 }];
  const width = 720;
  const height = 220;
  const maxRating = 5;
  const gap = 8;
  const barWidth = Math.max(8, (width - 64 - gap * (points.length - 1)) / points.length);
  target.innerHTML = `
    <svg class="performance-svg" viewBox="0 0 ${width} ${height}" role="img">
      ${points.map((item, index) => {
        const value = Number(item.average_rating || 0);
        const barHeight = (value / maxRating) * (height - 64);
        const x = 32 + index * (barWidth + gap);
        const y = height - 32 - barHeight;
        const label = formatMonthYear(item.month || "-").split(" - ")[0].slice(0, 3);
        return `<rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="4" fill="#1d4ed8"><title>${escapeHtml(item.month || item.date)}: ${escapeHtml(value)} / ${escapeHtml(item.completed_trips)} trips</title></rect><text x="${x + barWidth / 2}" y="${height - 8}" text-anchor="middle">${escapeHtml(label)}</text>`;
      }).join("")}
    </svg>
  `;
  renderStats();
  renderScoreboard();
  renderDashboard();
}

function renderVehicleHealth() {
  const target = document.getElementById("vehicle-health-list");
  if (!target) return;
  const items = appData.vehicle_health || [];
  target.innerHTML = items.length ? `<div class="health-grid">${items.map((item) => `
    <article class="health-card ${String(item.status || "").toLowerCase()}">
      <span>${escapeHtml(item.plate_number)} - ${escapeHtml(item.vehicle_name)}</span>
      <strong>${escapeHtml(item.score)}%</strong>
      <small>${escapeHtml(item.status)} / ${escapeHtml(item.alerts)} alert</small>
    </article>
  `).join("")}</div>` : empty(t("emptyVehicle"));
}

function selectedReviewRange() {
  const range = initMonthInterval(reviewStartMonth, reviewEndMonth);
  reviewStartMonth = range.start;
  reviewEndMonth = range.end;
  return range;
}

function filteredUserReviews() {
  selectedReviewRange();
  return (appData.user_reviews || []).filter((item) => {
    const month = ((item.updated_at || item.end_date || item.travel_date) || "").slice(0, 7);
    return month >= reviewStartMonth && month <= reviewEndMonth;
  });
}

function renderUserReviews() {
  const list = document.getElementById("user-review-list");
  const pagination = document.getElementById("user-review-pagination");
  const exportLink = document.getElementById("user-review-export");
  if (!list || !pagination) return;
  selectedReviewRange();
  populateIntervalControls("review", reviewStartMonth, reviewEndMonth);
  if (exportLink) {
    exportLink.href = `/export/reviews.xlsx?start=${encodeURIComponent(reviewStartMonth)}&end=${encodeURIComponent(reviewEndMonth)}`;
  }
  const reviews = filteredUserReviews();
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(reviews.length / pageSize));
  userReviewPage = Math.min(Math.max(userReviewPage, 1), totalPages);
  const pageItems = reviews.slice((userReviewPage - 1) * pageSize, userReviewPage * pageSize);
  list.innerHTML = pageItems.length ? `
    <table class="review-table">
      <thead><tr>
        <th>${t("reviewedAt")}</th><th>${t("requester")}</th><th>${t("driver")}</th><th>${t("rating")}</th>
        <th>${t("review")}</th><th>${t("followUp")}</th><th>${t("proof")}</th>
      </tr></thead>
      <tbody>${pageItems.map((item) => `<tr>
        <td>${escapeHtml(formatDate((item.updated_at || item.end_date || item.travel_date || "").slice(0, 10)))}</td>
        <td><strong>${escapeHtml(item.full_name || "-")}</strong><small>${escapeHtml(item.department || "-")} / ${escapeHtml(item.destination || "-")}</small></td>
        <td>${escapeHtml(item.driver_name || "-")}</td>
        <td><span class="rating-pill">${escapeHtml(item.rating || 0)}</span></td>
        <td class="review-copy">${escapeHtml(item.review || "-")}</td>
        <td>
          <form class="follow-up-form" method="post" action="/requests/${item.id}/review-follow-up">
            <input name="review_follow_up" value="${escapeHtml(item.review_follow_up || "")}" placeholder="${escapeHtml(t("followUp"))}">
            <button class="icon-action" type="submit" title="${escapeHtml(t("save"))}" aria-label="${escapeHtml(t("save"))}">✓</button>
          </form>
        </td>
        <td>
          <div class="proof-actions">
            <form class="proof-upload-form" method="post" action="/requests/${item.id}/review-proof" enctype="multipart/form-data">
              <label class="icon-action" title="${escapeHtml(t("uploadFollowUpProof"))}" aria-label="${escapeHtml(t("uploadFollowUpProof"))}">
                ↑
                <input class="proof-upload-input" name="review_proof" type="file" accept="application/pdf,.pdf" required>
              </label>
            </form>
            ${item.review_proof_file ? `<a class="icon-action" href="/requests/${item.id}/review-proof" target="_blank" rel="noopener" title="${escapeHtml(t("downloadFollowUpProof"))}" aria-label="${escapeHtml(t("downloadFollowUpProof"))}">↓</a>` : `<span class="proof-empty">PDF</span>`}
          </div>
        </td>
      </tr>`).join("")}</tbody>
    </table>` : empty(t("noUserReviews"));
  pagination.innerHTML = reviews.length > pageSize ? Array.from({ length: totalPages }, (_, index) => {
    const page = index + 1;
    return `<button class="button small ${page === userReviewPage ? "primary" : "secondary"}" type="button" data-user-review-page="${page}">${page}</button>`;
  }).join("") : "";
}

function renderSchedule() {
  const target = document.getElementById("driver-schedule");
  if (!target) return;
  renderCalendar(new Date());
  showCalendarDate(new Date().toISOString().slice(0, 10));
  target.innerHTML = "";
}

function scheduleEmpty(key) {
  return `<div class="schedule-empty"><span aria-hidden="true">□</span><p>${t(key)}</p></div>`;
}

function scheduleCard(titleKey, items, field, emptyKey, tone) {
  const count = items.length;
  const body = count
    ? items.map((item) => `<button class="schedule-pill ${tone}" type="button">${escapeHtml(item[field])}</button>`).join("")
    : scheduleEmpty(emptyKey);
  return `
    <section class="schedule-card">
      <div class="schedule-card-head">
        <h4>${t(titleKey)} <span>${count}</span></h4>
      </div>
      <div class="schedule-card-body">${body}</div>
    </section>
  `;
}

function scheduleSummaryMarkup(date) {
  const trips = (appData.schedule?.monthly || []).filter((item) => (item.start_date || item.travel_date) <= date && date <= (item.end_date || item.travel_date));
  const assignedTrips = trips.filter((item) => ["assigned", "on_trip"].includes(canonicalStatus(item.status)));
  const queueTrips = trips.filter((item) => ["pending_leader_approval", "approved", "processing_ga"].includes(canonicalStatus(item.status)));
  const assignedDriverIds = new Set(trips.map((item) => item.driver_id).filter(Boolean));
  const assignedVehicleIds = new Set(trips.map((item) => item.vehicle_id).filter(Boolean));
  const allDrivers = appData.schedule?.drivers || [];
  const allVehicles = appData.schedule?.vehicles || [];
  return `
    <div class="fleet-summary-grid">
      <div class="fleet-summary-column">
        ${scheduleCard("availableDrivers", allDrivers.filter((d) => !assignedDriverIds.has(d.id)), "driver_name", "noAvailableDrivers", "available")}
        ${scheduleCard("availableVehicles", allVehicles.filter((v) => !assignedVehicleIds.has(v.id)), "plate_number", "noAvailableVehicles", "available")}
      </div>
      <div class="fleet-summary-column">
        ${scheduleCard("assignedDrivers", allDrivers.filter((d) => assignedDriverIds.has(d.id)), "driver_name", "noAssignedDrivers", "assigned")}
        ${scheduleCard("assignedVehicles", allVehicles.filter((v) => assignedVehicleIds.has(v.id)), "plate_number", "noAssignedVehicles", "assigned")}
      </div>
    </div>
    <div class="table-wrap"><h4>${t("dailySchedule")}</h4><table><tbody>${assignedTrips.length ? assignedTrips.map((item) => `<tr><td>${escapeHtml(item.depart_time)}-${escapeHtml(item.return_time)}</td><td>${escapeHtml(item.driver_name || "-")}</td><td>${escapeHtml(item.plate_number || "-")}</td><td>${escapeHtml(item.destination)}</td></tr>`).join("") : `<tr><td colspan="4">${scheduleEmpty("noSchedule")}</td></tr>`}</tbody></table></div>
    <div class="table-wrap"><h4>${t("queueSchedule")}</h4><table><tbody>${queueTrips.length ? queueTrips.map((item) => `<tr><td>${escapeHtml(item.depart_time)}-${escapeHtml(item.return_time)}</td><td>${escapeHtml(item.full_name || "-")}</td><td>${escapeHtml(item.destination)}</td><td>${badge(item.status)}</td></tr>`).join("") : `<tr><td colspan="4">${scheduleEmpty("noSchedule")}</td></tr>`}</tbody></table></div>
  `;
}

function scheduleCountsForDate(date) {
  const trips = (appData.schedule?.monthly || []).filter((item) => (item.start_date || item.travel_date) <= date && date <= (item.end_date || item.travel_date));
  const assigned = trips.filter((item) => ["assigned", "on_trip"].includes(canonicalStatus(item.status))).length;
  const queue = trips.filter((item) => ["pending_leader_approval", "approved", "processing_ga"].includes(canonicalStatus(item.status))).length;
  return { assigned, queue, total: assigned + queue };
}

function renderCalendar(baseDate) {
  const target = document.getElementById("schedule-calendar");
  if (!target) return;
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  scheduleMonthFilter = `${year}-${String(month + 1).padStart(2, "0")}`;
  const days = new Date(year, month + 1, 0).getDate();
  const weekdayLabels = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const locale = lang === "en" ? "en-US" : "id-ID";
  const monthOptions = Array.from({ length: 12 }, (_, index) => {
    const label = new Date(year, index, 1).toLocaleDateString(locale, { month: "long" });
    return `<option value="${index}" ${index === month ? "selected" : ""}>${escapeHtml(label.charAt(0).toUpperCase() + label.slice(1))}</option>`;
  }).join("");
  const yearOptions = Array.from({ length: 7 }, (_, index) => year - 3 + index)
    .map((item) => `<option value="${item}" ${item === year ? "selected" : ""}>${item}</option>`)
    .join("");
  const firstDay = new Date(year, month, 1).getDay();
  const blanks = Array.from({ length: firstDay }, () => `<span class="calendar-day muted"></span>`).join("");
  const cells = Array.from({ length: days }, (_, index) => {
    const day = index + 1;
    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const counts = scheduleCountsForDate(date);
    return `<button class="calendar-day" type="button" data-calendar-date="${date}">
      <span class="calendar-date-number">${day}</span>
      ${counts.total ? `<span class="calendar-schedule-badge">${counts.total}</span><span class="calendar-schedule-lines">${counts.assigned ? `<small class="assigned-dot">${counts.assigned} assigned</small>` : ""}${counts.queue ? `<small class="queue-dot">${counts.queue} queue</small>` : ""}</span>` : ""}
    </button>`;
  }).join("");
  target.innerHTML = `
    <div class="calendar-controls">
      <button class="button secondary small" type="button" data-calendar-nav="-1">&lt;&lt;</button>
      <span class="select-wrap calendar-select"><select data-calendar-month>${monthOptions}</select></span>
      <span class="select-wrap calendar-select year-select"><select data-calendar-year>${yearOptions}</select></span>
      <button class="button secondary small" type="button" data-calendar-nav="1">&gt;&gt;</button>
    </div>
    <div class="calendar-grid calendar-weekdays">${weekdayLabels.map((label) => `<strong>${label}</strong>`).join("")}</div>
    <div class="calendar-grid">${blanks}${cells}</div>
    <div id="calendar-detail"></div>
  `;
  target.dataset.year = year;
  target.dataset.month = month;
}

function showCalendarDate(date) {
  const detail = document.getElementById("calendar-detail");
  if (!detail) return;
  document.querySelectorAll(".calendar-day").forEach((btn) => btn.classList.toggle("active", btn.dataset.calendarDate === date));
  detail.innerHTML = scheduleSummaryMarkup(date);
}

function renderHistory() {
  const list = document.getElementById("history-list");
  if (!list) return;
  const items = appData.requests || [];
  list.innerHTML = items.length ? items.map((item) => {
    let actions = "";
    const status = canonicalStatus(item.status);
    actions += historyBookingActions(item, status);
    if (status === "completed" && !item.rating) {
      actions += `<form class="inline-form review-form" method="post" action="/requests/${item.id}/review">
        <label>${t("rating")}<select name="rating" required><option value="5">5</option><option value="4">4</option><option value="3">3</option><option value="2">2</option><option value="1">1</option></select></label>
        <label>${t("review")}<input name="review"></label>
        <button class="button primary" type="submit">${t("sendReview")}</button>
      </form>`;
    }
    return tripCard(item, actions);
  }).join("") : empty(t("emptyHistory"));
}

function renderApproval() {
  const list = document.getElementById("approval-list");
  if (!list) return;
  const items = (appData.leader_requests || []).filter((item) => canonicalStatus(item.status) === "pending_leader_approval");
  list.innerHTML = items.length ? items.map((item) => tripCard(item, `
    <form class="inline-form two" method="post" action="/requests/${item.id}/approval">
      <label>${t("leaderNote")}<input name="leader_note"></label>
      <button class="button primary" name="action" value="approve" type="submit">${t("approve")}</button>
      <button class="button secondary" name="action" value="reject" type="submit">${t("reject")}</button>
    </form>
  `)).join("") : empty(t("emptyApproval"));
}

function renderGa() {
  const list = document.getElementById("ga-list");
  if (!list) return;
  const items = appData.ga_requests || [];
  list.innerHTML = items.length ? items.map((item) => {
    const driverOptions = (item.availability?.drivers || appData.drivers || []).map((driver) => `<option value="${driver.id}" ${driver.id === item.driver_id ? "selected" : ""}>${escapeHtml(driver.driver_name)} - ${escapeHtml(driver.status)}</option>`).join("");
    const vehicleOptions = (item.availability?.vehicles || []).map((vehicle) => `<option value="${vehicle.id}" ${vehicle.id === item.vehicle_id ? "selected" : ""}>${escapeHtml(vehicle.plate_number)} - ${escapeHtml(vehicle.vehicle_name)} (${vehicle.capacity})</option>`).join("");
    const status = canonicalStatus(item.status);
    const canEditAssignment = status === "assigned" || status === "on_trip";
    const editForm = `
      <details class="collapse-panel">
        <summary>${status === "approved" || status === "processing_ga" ? t("editBeforeAssign") : t("editAssignment")}</summary>
        <form class="form-grid compact" method="post" action="/requests/${item.id}/update">
          <label>${t("destination")}<input name="destination" value="${escapeHtml(item.destination)}" required></label>
          <label>${t("purpose")}<input name="purpose" value="${escapeHtml(item.purpose)}" required></label>
          <label>${t("startDate")}<input name="start_date" type="date" value="${escapeHtml(item.start_date || item.travel_date)}" required></label>
          <label>${t("endDate")}<input name="end_date" type="date" value="${escapeHtml(item.end_date || item.travel_date)}" required></label>
          <label>${t("departTime")}<input name="depart_time" type="time" value="${escapeHtml(item.depart_time)}" required></label>
          <label>${t("returnTime")}<input name="return_time" type="time" value="${escapeHtml(item.return_time)}" required></label>
          ${canEditAssignment ? `<label>${t("driver")}<select name="driver_id">${driverOptions}</select></label>
          <label>${t("vehicle")}<select name="vehicle_id">${vehicleOptions}</select></label>` : ""}
          <label>${t("passengers")}<input name="passengers" type="number" min="1" max="50" value="${escapeHtml(item.passengers)}" required></label>
          <fieldset class="span-2 choice-group compact-choice">
            <legend>${t("plateRule")}</legend>
            <label><input type="radio" name="plate_rule" value="bebas" ${(item.plate_rule || "bebas") === "bebas" ? "checked" : ""}> ${t("plateFree")}</label>
            <label><input type="radio" name="plate_rule" value="ganjil" ${item.plate_rule === "ganjil" ? "checked" : ""}> ${t("plateOdd")}</label>
            <label><input type="radio" name="plate_rule" value="genap" ${item.plate_rule === "genap" ? "checked" : ""}> ${t("plateEven")}</label>
          </fieldset>
          <label>${t("mapUrl")}<input name="map_url" type="url" value="${escapeHtml(item.map_url || "")}"></label>
          <label class="span-2">${t("notes")}<textarea name="notes">${escapeHtml(item.notes || "")}</textarea></label>
          <button class="button primary span-2" type="submit">${t("save")}</button>
        </form>
      </details>`;
    const rejectForm = `
      <details class="collapse-panel">
        <summary>${t("rejectByGa")}</summary>
        <form class="inline-form two" method="post" action="/requests/${item.id}/ga-reject">
          <label>${t("gaNote")}<input name="ga_note"></label>
          <button class="button danger" type="submit">${t("reject")}</button>
        </form>
      </details>`;
    const assignActions = status === "approved" || status === "processing_ga" ? `
      <form class="inline-form" method="post" action="/requests/${item.id}/assign">
        <label>${t("driver")}<select name="driver_id" required>${driverOptions}</select></label>
        <label>${t("vehicle")}<select name="vehicle_id" required>${vehicleOptions}</select></label>
        <label>${t("gaNote")}<input name="ga_note"></label>
        <button class="button primary" type="submit">${t("assign")}</button>
      </form>
      ${vehicleOptions ? "" : `<div class="alert warning">${t("noAvailableByRule")}</div>`}` : "";
    return tripCard(item, assignActions + editForm + rejectForm);
  }).join("") : empty(t("emptyGa"));
}

function renderDriver() {
  const list = document.getElementById("driver-list");
  if (!list) return;
  const items = appData.driver_requests || [];
  list.innerHTML = items.length ? items.map((item) => {
    let actions = "";
    const status = canonicalStatus(item.status);
    const minimumKm = Number(item.vehicle_current_km || item.km_start || 0);
    if (status === "assigned") actions = `<form class="inline-form two" method="post" action="/requests/${item.id}/driver"><label>${t("kmStart")}<input name="km_start" type="number" min="${minimumKm}" value="${minimumKm}" required></label><button class="button primary" name="action" value="start" type="submit">${t("startTrip")}</button></form>`;
    if (status === "on_trip") actions = `<form class="inline-form driver-finish" method="post" action="/requests/${item.id}/driver"><label>${t("kmEnd")}<input name="km_end" type="number" min="0" required></label><label>${t("fuelLiters")}<input name="fuel_liters" type="number" min="0" step="0.01"></label><label>${t("fuel")}<input name="cost_fuel" data-money inputmode="numeric"></label><label>${t("toll")}<input name="cost_toll" data-money inputmode="numeric"></label><label>${t("parking")}<input name="cost_parking" data-money inputmode="numeric"></label><button class="button primary" name="action" value="finish" type="submit">${t("finishTrip")}</button></form>`;
    return tripCard(item, actions);
  }).join("") : empty(t("emptyDriver"));
}

function expiryText(alert) {
  if (alert.type === "maintenance_km") return message("remainingKm", { km: Math.max(Number(alert.days_left || 0), 0) });
  const days = Number(alert.days_left || 0);
  if (days < 0) return message("expiredDays", { days: Math.abs(days) });
  if (days === 0) return t("expiresToday");
  return message("expiresInDays", { days });
}

function renderVehicleAlerts() {
  const button = document.getElementById("vehicle-alert-button");
  const count = document.getElementById("vehicle-alert-count");
  const summary = document.getElementById("vehicle-alert-summary");
  const list = document.getElementById("vehicle-alert-list");
  if (!button || !count || !summary || !list) return;
  const alerts = appData.notifications || appData.vehicle_alerts || [];
  count.textContent = alerts.length;
  summary.textContent = alerts.length;
  count.classList.toggle("hidden", alerts.length === 0);
  button.classList.toggle("has-alerts", alerts.length > 0);
  list.innerHTML = alerts.length ? alerts.map((alert) => `
    <div class="notification-item ${alert.expired ? "expired" : ""}">
      <div>
        <strong>${escapeHtml(alert.title || alert.document || "Notification")}${alert.plate_number ? " - " + escapeHtml(alert.plate_number) : ""}</strong>
        <span>${escapeHtml(alert.message || alert.vehicle_name || "-")}</span>
      </div>
      <div class="notification-date">
        <strong>${alert.expiry_date && String(alert.expiry_date).includes("-") ? formatDate(alert.expiry_date) : escapeHtml(alert.expiry_date || "")}</strong>
        <span>${alert.days_left !== undefined ? escapeHtml(expiryText(alert)) : escapeHtml(alert.tab || "")}</span>
      </div>
    </div>
  `).join("") : `<div class="notification-empty">${t("notificationsEmpty")}</div>`;
}

function renderVehicles() {
  const target = document.getElementById("vehicle-list");
  if (!target) return;
  const vehicles = appData.vehicles || [];
  const vehicleForms = vehicles.map((vehicle) => `<form id="vehicle-form-${vehicle.id}" method="post" action="/vehicles/${vehicle.id}/update"></form>`).join("");
  target.innerHTML = vehicles.length ? `${vehicleForms}<table><thead><tr><th>${t("vehicleName")}</th><th>${t("plateNumber")}</th><th>${t("vehicleType")}</th><th>${t("capacity")}</th><th>${t("stnkDate")}</th><th>${t("kirDate")}</th><th>${t("vehicleStatus")}</th><th>${t("action")}</th></tr></thead><tbody>${vehicles.map((vehicle) => `
    <tr>
        <td><input form="vehicle-form-${vehicle.id}" name="vehicle_name" value="${escapeHtml(vehicle.vehicle_name)}" required></td>
        <td><input form="vehicle-form-${vehicle.id}" name="plate_number" value="${escapeHtml(vehicle.plate_number)}" required></td>
        <td><input form="vehicle-form-${vehicle.id}" name="vehicle_type" value="${escapeHtml(vehicle.vehicle_type || "")}" required></td>
        <td><input form="vehicle-form-${vehicle.id}" name="capacity" type="number" min="1" value="${escapeHtml(vehicle.capacity)}" required></td>
        <td><input form="vehicle-form-${vehicle.id}" name="stnk_expiry_date" type="date" value="${escapeHtml(vehicle.stnk_expiry_date || "")}"></td>
        <td><input form="vehicle-form-${vehicle.id}" name="kir_expiry_date" type="date" value="${escapeHtml(vehicle.kir_expiry_date || "")}"></td>
        <td><select form="vehicle-form-${vehicle.id}" name="status"><option value="AVAILABLE" ${vehicle.status === "AVAILABLE" ? "selected" : ""}>Available</option><option value="MAINTENANCE" ${vehicle.status === "MAINTENANCE" ? "selected" : ""}>Maintenance</option><option value="ASSIGNED" ${vehicle.status === "ASSIGNED" ? "selected" : ""}>Assigned</option></select></td>
        <td><div class="row-actions"><button class="button secondary small" form="vehicle-form-${vehicle.id}" type="submit">${t("save")}</button>
      <form class="inline-delete" method="post" action="/vehicles/${vehicle.id}/delete" onsubmit="return confirm('${t("confirmDeleteVehicle")}')"><button class="button danger small" type="submit">${t("delete")}</button></form></div></td>
    </tr>`).join("")}</tbody></table>` : empty(t("emptyVehicle"));
}

function renderMaintenance() {
  const target = document.getElementById("maintenance-list");
  if (!target) return;
  const vehicles = appData.maintenance_vehicles || [];
  const canEditKm = !!appData.can_edit_vehicle_km;
  const maintenanceForms = vehicles.map((vehicle) => `<form id="maintenance-form-${vehicle.id}" method="post" action="/vehicles/${vehicle.id}/maintenance"></form>`).join("");
  target.innerHTML = vehicles.length ? `${maintenanceForms}<table><thead><tr><th>${t("plateNumber")}</th><th>${t("vehicleName")}</th><th>${t("vehicleType")}</th><th>${t("currentKm")}</th><th>${t("lastMaintenanceMonth")}</th><th>${t("maintenanceKmReference")}</th><th>${t("maintenanceMonthReference")}</th><th>${t("maintenanceReferenceLink")}</th><th>${t("action")}</th></tr></thead><tbody>${vehicles.map((vehicle) => `
    <tr>
      <td>${escapeHtml(vehicle.plate_number)}</td>
      <td>${escapeHtml(vehicle.vehicle_name)}</td>
      <td>${escapeHtml(vehicle.vehicle_type || "-")}</td>
      <td><input form="maintenance-form-${vehicle.id}" name="current_km" type="number" min="0" value="${escapeHtml(vehicle.current_km || 0)}" ${canEditKm ? "" : "readonly"}></td>
      <td><input form="maintenance-form-${vehicle.id}" name="last_maintenance_date" type="date" value="${escapeHtml(vehicle.last_maintenance_date || (vehicle.last_maintenance_month ? vehicle.last_maintenance_month + "-01" : ""))}"></td>
      <td><input form="maintenance-form-${vehicle.id}" name="maintenance_km_interval" type="number" min="1" value="${escapeHtml(vehicle.maintenance_km_interval || 10000)}"></td>
      <td><input form="maintenance-form-${vehicle.id}" name="maintenance_month_interval" type="number" min="1" value="${escapeHtml(vehicle.maintenance_month_interval || 6)}" ${canEditKm ? "" : "readonly"}></td>
      <td><div class="reference-cell"><input form="maintenance-form-${vehicle.id}" name="maintenance_reference_url" type="url" value="${escapeHtml(vehicle.maintenance_reference_url || "")}">${vehicle.maintenance_reference_url ? `<a href="${escapeHtml(vehicle.maintenance_reference_url)}" target="_blank" rel="noopener">${t("openReference")}</a>` : ""}</div></td>
      <td><button class="button secondary small" form="maintenance-form-${vehicle.id}" type="submit">${t("save")}</button></td>
    </tr>`).join("")}</tbody></table>` : empty(t("emptyVehicle"));
}

function renderEmployees() {
  const target = document.getElementById("employee-list");
  if (!target) return;
  const employees = appData.employees || [];
  target.innerHTML = employees.length ? `<table><thead><tr><th>NIK</th><th>${t("name")}</th><th>${t("position")}</th><th>${t("department")}</th><th>${t("supervisor")}</th><th>${t("phone")}</th><th>${t("role")}</th><th>${t("action")}</th></tr></thead><tbody>${employees.map((item) => `
    <tr><td>${escapeHtml(item.nik)}</td><td>${escapeHtml(item.full_name)}</td><td>${escapeHtml(item.position)}</td><td>${escapeHtml(item.department)}</td><td>${escapeHtml(item.supervisor_nik || "-")}</td><td>${escapeHtml(item.phone)}</td><td>${escapeHtml(item.roles_text || "-")}</td><td><div class="row-actions"><button class="button secondary small" type="button" data-edit-employee="${escapeHtml(item.nik)}">${t("edit")}</button><form class="inline-delete" method="post" action="/employees/${encodeURIComponent(item.nik)}/delete" onsubmit="return confirm('${t("confirmDeleteEmployee")}')"><button class="button danger small" type="submit">${t("delete")}</button></form></div></td></tr>`).join("")}</tbody></table>` : empty("No data");
}

function renderOptionManager() {
  const positionTarget = document.getElementById("position-option-list");
  const departmentTarget = document.getElementById("department-option-list");
  if (!positionTarget || !departmentTarget) return;
  const renderChips = (kind, values) => sortedOptions(values).map((value) => `<span class="option-chip">${escapeHtml(value)}<button type="button" title="${t("delete")}" data-delete-option data-kind="${kind}" data-value="${escapeHtml(value)}">x</button></span>`).join("");
  positionTarget.innerHTML = renderChips("position", appData.options?.positions || []);
  departmentTarget.innerHTML = renderChips("department", appData.options?.departments || []);
}

function openEmployeeModal(nik) {
  const employee = (appData.employees || []).find((item) => item.nik === nik);
  if (!employee) return;
  const modal = document.getElementById("employee-modal");
  const form = document.getElementById("employee-edit-form");
  form.action = `/employees/${encodeURIComponent(employee.nik)}/update`;
  document.getElementById("edit-nik").value = employee.nik;
  document.getElementById("edit-full-name").value = employee.full_name || "";
  document.getElementById("edit-supervisor").value = employee.supervisor_nik || "";
  document.getElementById("edit-phone").value = employee.phone || "";
  renderOptionSelects();
  document.getElementById("edit-position").value = employee.position || "";
  document.getElementById("edit-department").value = employee.department || "";
  const roles = String(employee.roles_text || "").split(",").map((role) => role.trim());
  document.querySelectorAll(".edit-role").forEach((checkbox) => checkbox.checked = roles.includes(checkbox.value));
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
}

function closeEmployeeModal() {
  const modal = document.getElementById("employee-modal");
  if (!modal) return;
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
}

function setupBookingPersistence() {
  const form = document.querySelector('#booking form[action="/requests"]');
  if (!form) return;
  form.querySelectorAll('input[type="date"]').forEach((input) => {
    input.min = todayIso();
  });
  const params = new URLSearchParams(window.location.search);
  const hadSubmit = sessionStorage.getItem(BOOKING_SUBMITTING_KEY) === "1";
  const hasError = !!params.get("error");
  if (hadSubmit && !hasError) clearBookingDraft(true);
  sessionStorage.removeItem(BOOKING_SUBMITTING_KEY);
  restoreBookingDraft();
  form.addEventListener("input", saveBookingDraft);
  form.addEventListener("change", saveBookingDraft);
  form.addEventListener("submit", () => {
    saveBookingDraft();
    sessionStorage.setItem(BOOKING_SUBMITTING_KEY, "1");
  });
}

function saveBookingDraft() {
  const form = document.querySelector('#booking form[action="/requests"]');
  if (!form) return;
  localStorage.setItem(BOOKING_DRAFT_KEY, JSON.stringify(Object.fromEntries(new FormData(form).entries())));
}

function restoreBookingDraft() {
  const form = document.querySelector('#booking form[action="/requests"]');
  if (!form) return;
  const saved = JSON.parse(localStorage.getItem(BOOKING_DRAFT_KEY) || "{}");
  Object.entries(saved).forEach(([name, value]) => {
    const field = form.elements[name];
    if (field) field.value = value;
  });
}

function clearBookingDraft(resetForm = false) {
  localStorage.removeItem(BOOKING_DRAFT_KEY);
  sessionStorage.removeItem(BOOKING_SUBMITTING_KEY);
  if (resetForm) {
    document.querySelector('#booking form[action="/requests"]')?.reset();
  }
}

document.addEventListener("change", (event) => {
  if (event.target.matches("[data-option-kind]") && event.target.value === "__add__") addDropdownOption(event.target);
  if (event.target.matches("#performance-start-month-filter, #performance-start-year-filter, #performance-end-month-filter, #performance-end-year-filter")) {
    const startMonth = document.getElementById("performance-start-month-filter")?.value ?? "";
    const startYear = document.getElementById("performance-start-year-filter")?.value || "";
    const endMonth = document.getElementById("performance-end-month-filter")?.value ?? "";
    const endYear = document.getElementById("performance-end-year-filter")?.value || "";
    if (startYear && startMonth !== "") performanceStartMonth = composeMonthValue(startYear, startMonth);
    if (endYear && endMonth !== "") performanceEndMonth = composeMonthValue(endYear, endMonth);
    dashboardPage = 1;
    renderPerformanceChart();
  }
  if (event.target.matches("#review-start-month-filter, #review-start-year-filter, #review-end-month-filter, #review-end-year-filter")) {
    const startMonth = document.getElementById("review-start-month-filter")?.value ?? "";
    const startYear = document.getElementById("review-start-year-filter")?.value || "";
    const endMonth = document.getElementById("review-end-month-filter")?.value ?? "";
    const endYear = document.getElementById("review-end-year-filter")?.value || "";
    if (startYear && startMonth !== "") reviewStartMonth = composeMonthValue(startYear, startMonth);
    if (endYear && endMonth !== "") reviewEndMonth = composeMonthValue(endYear, endMonth);
    userReviewPage = 1;
    renderUserReviews();
  }
  if (event.target.matches(".proof-upload-input")) {
    event.target.closest("form")?.requestSubmit();
  }
  if (event.target.matches("[data-calendar-month], [data-calendar-year]")) {
    const monthSelect = document.querySelector("[data-calendar-month]");
    const yearSelect = document.querySelector("[data-calendar-year]");
    const base = new Date(Number(yearSelect.value), Number(monthSelect.value), 1);
    renderCalendar(base);
    showCalendarDate(`${base.getFullYear()}-${String(base.getMonth() + 1).padStart(2, "0")}-01`);
    dashboardPage = 1;
    renderDashboard();
  }
});

document.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit-employee]");
  if (editButton) openEmployeeModal(editButton.dataset.editEmployee);
  const optionButton = event.target.closest("[data-delete-option]");
  if (optionButton) deleteDropdownOption(optionButton.dataset.kind, optionButton.dataset.value);
  const calendarDay = event.target.closest("[data-calendar-date]");
  if (calendarDay) showCalendarDate(calendarDay.dataset.calendarDate);
  const calendarNav = event.target.closest("[data-calendar-nav]");
  if (calendarNav) {
    const target = document.getElementById("schedule-calendar");
    const base = new Date(Number(target.dataset.year), Number(target.dataset.month) + Number(calendarNav.dataset.calendarNav), 1);
    renderCalendar(base);
    showCalendarDate(`${base.getFullYear()}-${String(base.getMonth() + 1).padStart(2, "0")}-01`);
    dashboardPage = 1;
    renderDashboard();
  }
  const dashboardPageButton = event.target.closest("[data-dashboard-page]");
  if (dashboardPageButton) {
    dashboardPage = Number(dashboardPageButton.dataset.dashboardPage || 1);
    renderDashboard();
  }
  const userReviewPageButton = event.target.closest("[data-user-review-page]");
  if (userReviewPageButton) {
    userReviewPage = Number(userReviewPageButton.dataset.userReviewPage || 1);
    renderUserReviews();
  }
  if (event.target.matches("#performance-start-month-filter, #performance-start-year-filter, #performance-end-month-filter, #performance-end-year-filter")) return;
  if (event.target.matches("#review-start-month-filter, #review-start-year-filter, #review-end-month-filter, #review-end-year-filter")) return;
  const alertButton = event.target.closest("#vehicle-alert-button");
  const alertPanel = document.getElementById("vehicle-alert-panel");
  if (alertButton && alertPanel) {
    alertPanel.classList.toggle("hidden");
  } else if (alertPanel && !event.target.closest(".notification-wrap")) {
    alertPanel.classList.add("hidden");
  }
  if (event.target.matches("[data-close-modal]")) closeEmployeeModal();
});

async function init() {
  const response = await fetch("/api/data");
  appData = await response.json();
  lang = appData.language || localStorage.getItem("gaLanguage") || "id";
  applyTranslations();
  renderOptionSelects();
  renderStats();
  renderDashboard();
  renderScoreboard();
  renderPerformanceChart();
  renderVehicleHealth();
  renderSchedule();
  renderHistory();
  renderApproval();
  renderGa();
  renderDriver();
  renderVehicles();
  renderVehicleAlerts();
  renderMaintenance();
  renderUserReviews();
  renderEmployees();
  renderOptionManager();
  setupBookingPersistence();
  activateTab(new URLSearchParams(window.location.search).get("tab") || "dashboard");
}

init();
