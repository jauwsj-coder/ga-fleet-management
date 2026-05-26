const moneyFormatter = new Intl.NumberFormat("id-ID");
let appData = { options: { positions: [], departments: [] } };
let lang = "id";
let dashboardPage = 1;
let performanceStartMonth = "";
let performanceEndMonth = "";
let reviewStartMonth = "";
let reviewEndMonth = "";
let userReviewPage = 1;
let historyPage = 1;
let scheduleMonthFilter = new Date().toISOString().slice(0, 7);
let performanceChartInstance = null;
let p2hTrendChartInstance = null;
let p2hStatusChartInstance = null;
let p2hConsistencyChartInstance = null;
let p2hStartMonth = "";
let p2hEndMonth = "";
const BOOKING_DRAFT_KEY = "gaBookingDraft";
const BOOKING_SUBMITTING_KEY = "gaBookingSubmitting";

const I18N = {
  id: {
    logout: "Logout",
    appEyebrow: "Manajemen Armada & Kendaraan",
    count: "Jumlah",
    vehicleDocumentNotifications: "Notifikasi dokumen kendaraan",
    navDashboard: "Dasbor",
    navDriverScheduleDashboard: "Dasbor Jadwal Driver",
    navBooking: "Pemesanan",
    navHistory: "Riwayat Saya",
    navApproval: "Persetujuan",
    navGa: "Kontrol GA",
    navVehicles: "Manajemen Kendaraan",
    navMaintenance: "Perawatan Berkala",
    navUserReviews: "Ulasan User",
    navEmployees: "Karyawan",
    navBackupRestore: "Cadangkan & Pulihkan",
    navDriver: "Halaman Driver",
    navP2hChecklist: "Checklist P2H",
    navP2hReport: "Laporan P2H",
    navGuide: "Panduan & Teknis",
    navDataManagement: "Manajemen Data",
    p2hChecklistTitle: "Checklist P2H",
    p2hChecklistSubtitle: "Pemeriksaan dan pengecekan harian kendaraan oleh driver.",
    p2hReportTitle: "Laporan P2H",
    p2hReportSubtitle: "Ringkasan, analitik, dan tindak lanjut pemeriksaan harian kendaraan.",
    p2hPerformanceTitle: "Grafik Pengecekan Harian / Performa P2H",
    p2hMissingDriverAlert: "Anda belum mengisi Checklist P2H hari ini. Mohon segera lakukan pemeriksaan kendaraan dan kirim laporan P2H.",
    p2hMissingGaAlert: "Perhatian: Terdapat driver yang belum mengisi P2H hari ini sampai batas waktu 09:00.",
    p2hDate: "Tanggal P2H",
    p2hCondition: "Kondisi Kendaraan",
    p2hFuelStatus: "Status BBM",
    p2hKmStart: "KM awal hari ini",
    p2hGeneralNote: "Catatan umum",
    p2hDamageNote: "Catatan kerusakan",
    p2hRecommendation: "Rekomendasi tindak lanjut",
    p2hUpload: "Unggah foto kerusakan",
    submitP2h: "Simpan P2H",
    confirmSubmitP2h: "Kirim Checklist P2H hari ini?",
    p2hHistoryMine: "Riwayat P2H Saya",
    p2hReportsTable: "Tabel Laporan P2H",
    downloadP2hReport: "Unduh Laporan P2H",
    followUpStatus: "Status Tindak Lanjut",
    p2hStatus: "Status P2H",
    p2hTrendTitle: "Tren P2H",
    p2hNormalVsFollowUp: "Normal vs Tindak Lanjut",
    p2hNoChartData: "Belum ada data grafik.",
    p2hNoStatusData: "Belum ada data status.",
    p2hNoConsistencyData: "Belum ada data konsistensi.",
    p2hNoReportPeriod: "Belum ada laporan P2H pada periode ini.",
    p2hNoReport: "Belum ada laporan P2H.",
    p2hOk: "OK",
    p2hNotOk: "Tidak OK",
    p2hNotApplicable: "Tidak Berlaku",
    p2hNew: "Baru",
    p2hInProgress: "Diproses",
    p2hDone: "Selesai",
    p2hInvalid: "Ditolak / Tidak Valid",
    p2hTime: "Jam",
    p2hNotSubmitted: "Belum Submit",
    p2hVeryConsistent: "Sangat Konsisten",
    p2hConsistent: "Konsisten",
    p2hNeedsMonitoring: "Perlu Monitoring",
    p2hNotConsistent: "Tidak Konsisten",
    followUpNote: "Catatan Tindak Lanjut",
    followUpAction: "Tindakan Perbaikan",
    followUpDate: "Tanggal Tindak Lanjut",
    saveFollowUp: "Simpan Tindak Lanjut",
    p2hChecklistItems: "Checklist pemeriksaan",
    p2hOperationalCleanliness: "Checklist kebersihan",
    totalRequiredDays: "Total Hari Wajib P2H",
    totalP2hReports: "Total Laporan P2H",
    avgDriverConsistency: "Rata-rata Konsistensi Driver",
    missingDrivers: "Driver Belum Submit",
    totalNotOk: "Total Temuan Tidak OK",
    followUpDone: "Tindak Lanjut Selesai",
    followUpPending: "Tindak Lanjut Tertunda",
    driverConsistencyPerformance: "Performa Konsistensi Driver",
    requiredDays: "Hari Wajib P2H",
    submittedDays: "Jumlah Kirim P2H",
    missingDays: "Jumlah Tidak Kirim",
    consistency: "Konsistensi",
    findings: "Temuan Tidak OK",
    manualP2hWorkdays: "Hari Kerja Manual",
    saveWorkdays: "Simpan Hari Kerja",
    manualWorkdayHint: "Opsional. Jika diisi, angka ini menggantikan hitungan Senin-Jumat dikurangi tanggal merah pada interval ini.",
    p2hHolidaysExcluded: "Tanggal merah nasional/cuti bersama tidak dihitung.",
    guideTitle: "Panduan & Teknis",
    backupRestoreTitle: "Cadangkan & Pulihkan Database",
    backupRestoreSubtitle: "Pencadangan manual database aplikasi dan pemulihan khusus Super Admin.",
    backupDatabase: "Cadangkan Database",
    backupHistory: "Riwayat Cadangan",
    latestBackup: "Cadangan Terakhir",
    backupFile: "File Cadangan",
    backupSize: "Ukuran File",
    backupDate: "Tanggal Backup",
    downloadBackup: "Unduh Cadangan",
    restoreBackup: "Pulihkan Cadangan",
    deleteBackup: "Hapus Cadangan",
    confirmRestoreBackup: "Pulihkan database dari cadangan ini? Data saat ini akan diganti.",
    confirmDeleteBackup: "Hapus file cadangan ini secara permanen?",
    noBackupHistory: "Belum ada cadangan database.",
    dataManagementTitle: "Manajemen Data",
    dataManagementSubtitle: "Kelola ukuran data, arsip operasional, dan pembersihan data rendah prioritas secara aman.",
    databaseSize: "Ukuran Database",
    masterData: "Master Data",
    transactionData: "Data Transaksi",
    temporaryData: "Data Sementara",
    archivedData: "Data Diarsipkan",
    retentionRules: "Aturan Retensi",
    archiveOldData: "Arsipkan Data Lama",
    archiveCutoffDate: "Arsip sebelum tanggal",
    deleteTestingData: "Hapus Data Testing",
    deleteOldLogs: "Hapus Log Lama",
    logCutoffDate: "Hapus log sebelum tanggal",
    testingCutoffDate: "Hapus testing sampai tanggal",
    dataManagementAudit: "Audit Manajemen Data",
    archiveSummary: "Ringkasan Arsip Bulanan",
    confirmArchiveData: "Arsipkan data operasional lama? Master data tidak akan dihapus.",
    confirmDeleteTestingData: "Hapus data testing yang terdeteksi? Master data tidak akan dihapus.",
    confirmDeleteOldLogs: "Hapus log lama? Master data tidak akan dihapus.",
    protectedData: "Dilindungi",
    noAuditLog: "Belum ada audit.",
    noArchiveSummary: "Belum ada ringkasan arsip.",
    guideSubtitle: "Cari scope role, flow, aturan, dan langkah penggunaan sistem.",
    guideSearchLabel: "Cari Panduan",
    guideSearchPlaceholder: "Cari booking, approval, driver, review...",
    guideAskLabel: "Tanya Panduan",
    guideAskButton: "Tanya",
    guideAskPlaceholder: "Contoh: bagaimana cara approve request?",
    guideAnswerTitle: "Jawaban Panduan",
    guideRelatedTopic: "Topik terkait",
    guideNoAnswer: "Saya belum menemukan jawaban yang pas di panduan. Coba gunakan kata kunci lain seperti booking, approval, Kontrol GA, driver, review, maintenance, atau jadwal.",
    guideAskEmpty: "Tulis pertanyaan dulu ya.",
    downloadGuidePdf: "Unduh PDF",
    historySubtitle: "Review wajib untuk perjalanan yang selesai.",
    filterStartDate: "Dari Tanggal",
    filterEndDate: "Sampai Tanggal",
    clearFilter: "Reset Filter",
    approvalSubtitle: "Setujui atau tolak sesuai routing pimpinan user.",
    gaSubtitle: "Tugaskan kendaraan dan driver dengan deteksi konflik.",
    driverSubtitle: "Mulai dan selesaikan perjalanan dari halaman ini.",
    employeeMaster: "Master Karyawan",
    employeeSubtitle: "Sumber utama validasi NIK, routing approval, dan data role.",
    fullName: "Nama Lengkap",
    supervisorNik: "Pimpinan NIK",
    addEmployee: "Tambah Karyawan",
    manageOptions: "Kelola Pilihan Jabatan & Departemen",
    editEmployee: "Edit Karyawan",
    saveChanges: "Simpan Perubahan",
    dashboardTitle: "Dasbor Monitoring",
    dashboardSubtitle: "Ringkasan booking, approval, assignment, dan perjalanan selesai.",
    exportExcel: "Ekspor Excel",
    statTotal: "Total Permintaan",
    statPending: "Menunggu Persetujuan",
    statAssigned: "Ditugaskan / Berjalan",
    statWaitingTrip: "Menunggu Perjalanan",
    statCompleted: "Selesai",
    statRejected: "Ditolak",
    tripMonitoring: "Monitoring Perjalanan",
    driverSchedule: "Jadwal Driver",
    driverScheduleDashboardTitle: "Dasbor Jadwal Driver",
    driverScheduleDashboardSubtitle: "Informasi jadwal, ketersediaan driver, kendaraan, dan slot waktu.",
    viewDriverScheduleDashboard: "Lihat Dasbor Jadwal Driver",
    quickSearch: "Pencarian Cepat",
    todaySchedule: "Jadwal Hari Ini",
    tomorrowSchedule: "Jadwal Besok",
    emptySlots: "Slot Kosong",
    noRecommendedSlotInfo: "Tidak ada rekomendasi slot yang tersedia. Untuk keperluan di luar jam operasional, silakan hubungi GA minimal H-2.",
    fullScheduleDrivers: "Driver Jadwal Penuh",
    almostFullSchedule: "Hampir penuh",
    fullBooked: "Penuh",
    departureReminderTitle: "Pengingat Keberangkatan",
    gaDepartureReminder: "Perhatian: Driver belum memulai perjalanan untuk booking {code} yang dijadwalkan berangkat pukul {time}. Mohon lakukan follow up.",
    driverDepartureReminder: "Anda memiliki jadwal perjalanan pukul {time}. Silakan klik 'Mulai Perjalanan' jika sudah siap berangkat.",
    available: "Tersedia",
    allDrivers: "Semua Driver",
    allVehicles: "Semua Kendaraan",
    noDefaultDriver: "Belum ada driver default",
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
    mapUrl: "Tautan Google Maps",
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
    lastServiceDate: "Tanggal Service Terakhir",
    lastMaintenanceMonth: "Tanggal Referensi Maintenance",
    maintenanceKmReference: "Referensi KM Perawatan",
    maintenanceMonthReference: "Interval Bulan Maintenance",
    maintenanceReferenceLink: "Link Referensi Perawatan",
    maintenanceDueMonth: "Tanggal Referensi Maintenance",
    maintenanceMonthInterval: "Interval Bulan Maintenance",
    maintenanceTitle: "Perawatan Berkala Kendaraan",
    maintenanceSubtitle: "Monitoring perawatan berkala kendaraan berdasarkan KM dan bulan perawatan.",
    maintenanceRealization: "Input Realisasi Perawatan",
    maintenanceTypeSection: "Pilih jenis perawatan yang dilakukan",
    maintenancePartSection: "Checklist part/komponen yang diganti atau diperbaiki",
    customMaintenanceType: "Jenis perawatan lainnya",
    customPart: "Part lainnya / custom part",
    maintenanceHistory: "Riwayat Realisasi Perawatan",
    maintenanceType: "Jenis Perawatan",
    maintenanceParts: "Checklist Part",
    inputBy: "Input Oleh",
    filterPlateNumber: "Filter No Polisi",
    preventiveMaintenance: "Perawatan Berkala",
    reference: "Referensi",
    openReference: "Buka Referensi",
    plateRule: "Checklist Plat",
    plateOdd: "Ganjil",
    plateEven: "Genap",
    plateFree: "Bebas",
    editBeforeAssign: "Edit Jadwal",
    editAssignment: "Edit Assignment",
    rejectByGa: "Ditolak oleh GA",
    noAvailableByRule: "Tidak ada kendaraan sesuai plat, kapasitas, dan jadwal.",
    driverManagement: "Manajemen Driver",
    addRegisteredDriver: "Tambah Driver Terdaftar",
    selectRegisteredEmployee: "Pilih karyawan terdaftar",
    addDriver: "Tambah Driver",
    noRegisteredDriverCandidate: "Tidak ada karyawan terdaftar yang bisa ditambahkan sebagai driver.",
    confirmDeleteDriver: "Hapus driver dari Manajemen Driver?",
    defaultVehicle: "Kendaraan Default",
    simExpiryDate: "Masa Berlaku SIM",
    defaultVehicleUnavailable: "Informasi: unit yang tersedia saat ini berbeda dengan kendaraan default/rekomendasi driver.",
    assignedVehicleRecommendationWarning: "Kendaraan yang direkomendasikan adalah kendaraan dengan status assigned / dedicated, harap menghubungi pengguna kendaraan terkait.",
    defaultVehicleMissing: "Driver belum memiliki kendaraan default.",
    addVehicle: "Tambah Kendaraan",
    vehicleList: "Daftar Kendaraan",
    vehicleDocAlerts: "Notifikasi Dokumen Kendaraan",
    notificationsTitle: "Notifikasi",
    notificationsEmpty: "Tidak ada notifikasi.",
    remainingKm: "sisa {km} KM",
    queueSchedule: "Jadwal Antrian",
    performanceChartTitle: "Grafik Performa GA",
    performanceChartSubtitle: "Monitoring permintaan kendaraan per periode",
    periodScore: "Skor Periode",
    runningAverage: "Rata-rata Berjalan",
    statCanceled: "Dibatalkan",
    monitoringInterval: "Interval Monitoring:",
    until: "sd",
    startMonth: "Bulan mulai",
    startYear: "Tahun mulai",
    endMonth: "Bulan selesai",
    endYear: "Tahun selesai",
    allMonths: "12 Bulan",
    last12Months: "12 Bulan",
    last6Months: "6 Bulan",
    last3Months: "3 Bulan",
    dailyInMonth: "Harian",
    vehicleHealthTitle: "Dashboard Kesehatan Kendaraan",
    healthScore: "Skor Kesehatan",
    fuelLiters: "Liter BBM",
    fuelType: "Jenis BBM",
    vehicleConditionNotes: "Catatan Kondisi Kendaraan",
    fuelEfficiencyTrend: "Trend KM/Liter",
    fuelDate: "Tanggal Isi BBM",
    fuelPrice: "Harga BBM",
    totalFuelCost: "Total Biaya BBM",
    mostEfficientVehicles: "Kendaraan Paling Efisien",
    leastEfficientVehicles: "Kendaraan Paling Boros",
    fuelTransactions: "Detail Transaksi BBM",
    baselineConsumption: "Rata-rata Historis",
    currentMonthConsumption: "Bulan Ini",
    oneMonthConsumption: "1 Bulan Terakhir",
    threeMonthConsumption: "3 Bulan",
    sixMonthConsumption: "6 Bulan",
    fuelCostMonth: "Biaya BBM Bulan Ini",
    fuelConsumptionLiters: "Konsumsi BBM",
    fuelAlert: "Konsumsi BBM kendaraan ini turun dibanding rata-rata historis. Perlu pengecekan.",
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
    delete: "Hapus",
    save: "Simpan",
    cancel: "Batal",
    cancelBooking: "Batalkan Booking",
    confirmCancelBooking: "Batalkan booking ini?",
    approve: "Setujui",
    reject: "Tolak",
    processing: "Memproses...",
    approvalSuccessful: "Persetujuan berhasil",
    rejectSuccessful: "Request berhasil ditolak",
    failedUpdateRequest: "Gagal memperbarui request",
    networkError: "Gangguan jaringan",
    assign: "Tugaskan",
    gaNote: "Catatan GA",
    leaderNote: "Catatan",
    review: "Review",
    userReviewsTitle: "Ulasan User",
    userReviewsSubtitle: "Monitoring rating dan komentar perjalanan dari pengguna.",
    reviewedAt: "Tanggal Review",
    followUp: "Tindak Lanjut",
    proof: "Bukti",
    uploadFollowUpProof: "Unggah Bukti Tindak Lanjut",
    downloadFollowUpProof: "Unduh Bukti Tindak Lanjut",
    pdfOnly: "PDF",
    noUserReviews: "Belum ada ulasan user.",
    sendReview: "Kirim Review",
    rating: "Rating",
    kmStart: "KM Awal",
    kmEnd: "KM Akhir",
    fuel: "BBM",
    toll: "Tol",
    startTrip: "Mulai Perjalanan",
    finishTrip: "Selesai",
    availableDrivers: "Driver Tersedia",
    assignedDrivers: "Driver Ditugaskan",
    dailySchedule: "Jadwal Harian",
    monthlySchedule: "Jadwal Bulanan",
    noSchedule: "Tidak ada jadwal.",
    noAvailableDrivers: "Tidak ada driver tersedia untuk tanggal ini.",
    noAssignedDrivers: "Tidak ada driver ditugaskan untuk tanggal ini.",
    noAvailableVehicles: "Tidak ada kendaraan tersedia untuk tanggal ini.",
    noAssignedVehicles: "Tidak ada kendaraan ditugaskan untuk tanggal ini.",
    action: "Aksi",
    position: "Jabatan",
    phone: "No Telp",
    role: "Peran",
    roleUser: "User",
    roleLeader: "Pimpinan",
    roleGaAdmin: "GA Admin",
    roleDriver: "Driver",
    roleSuperAdmin: "Super Admin",
    vehicleStatusAvailable: "Tersedia",
    vehicleStatusMaintenance: "Perawatan",
    vehicleStatusAssigned: "Ditugaskan",
    fuelStatusPlaceholder: "Penuh / 1/2 / Rendah",
    driverScheduleSearchPlaceholder: "Driver, kendaraan, tujuan...",
    mapPlaceholder: "https://maps.google.com/...",
    notificationFallback: "Notifikasi",
    status: "Status",
    date: "Tanggal",
    file: "File",
    odometer: "Odometer",
    noData: "Tidak ada data.",
    noPositionData: "Belum ada data jabatan",
    noDepartmentData: "Belum ada data departemen",
    supervisor: "Pimpinan",
    employeeDb: "Database Karyawan",
    confirmDeleteEmployee: "Hapus karyawan ini dari database?",
    confirmDeleteVehicle: "Hapus kendaraan ini?",
    confirmDeleteAllTrips: "Hapus semua riwayat perjalanan?",
    deleteAllTrips: "Hapus Semua Riwayat",
    scoreboardTitle: "Papan Skor Performa GA",
    overallScore: "Skor GA",
    totalCompletedTrips: "Trip Selesai",
    avgRating: "Rata-rata Rating",
    level: "Level",
    rank: "Peringkat",
    noRatingYet: "Belum ada rating",
    exportEmployees: "Ekspor Karyawan",
    downloadTemplate: "Unduh Template",
    importEmployees: "Impor Karyawan",
    chooseFile: "Pilih File",
    availableVehicles: "Kendaraan Tersedia",
    assignedVehicles: "Kendaraan Ditugaskan",
    prevMonth: "Bulan Sebelumnya",
    nextMonth: "Bulan Berikutnya",
    addOther: "Tambahkan lainnya +",
    selectPosition: "Pilih Jabatan",
    selectDepartment: "Pilih Departemen",
    requiredReviewWarning: "perjalanan selesai belum direview. Booking baru akan diblokir jika mencapai 3 perjalanan.",
    editedAt: "Terakhir diedit",
    p2hCatEngine: "Pemeriksaan Mesin & Cairan",
    p2hCatTires: "Pemeriksaan Ban & Kaki-kaki",
    p2hCatBrakes: "Pemeriksaan Rem & Kemudi",
    p2hCatElectrical: "Pemeriksaan Lampu & Kelistrikan",
    p2hCatSafety: "Pemeriksaan Safety Equipment",
    p2hCatBody: "Pemeriksaan Body & Interior",
    p2hCatCleanliness: "Kebersihan Kendaraan",
    p2hCatOperational: "Kesiapan Operasional",
    p2hItemEngineOil: "Oli mesin",
    p2hItemCoolant: "Air radiator/coolant",
    p2hItemBrakeFluid: "Minyak rem",
    p2hItemPowerSteering: "Minyak power steering",
    p2hItemWiperFluid: "Air wiper",
    p2hItemBattery: "Kondisi aki/battery",
    p2hItemNoLeak: "Tidak ada kebocoran oli/cairan",
    p2hItemTirePressure: "Tekanan ban",
    p2hItemTireTread: "Kondisi tapak ban",
    p2hItemSpareTire: "Ban cadangan",
    p2hItemWheelNuts: "Baut roda",
    p2hItemSuspension: "Suspensi/shockbreaker",
    p2hItemNoFootNoise: "Tidak ada bunyi abnormal pada kaki-kaki",
    p2hItemMainBrake: "Rem utama",
    p2hItemParkingBrake: "Rem tangan/parking brake",
    p2hItemSteering: "Setir/kemudi normal",
    p2hItemBrakePedal: "Pedal rem normal",
    p2hItemNoBrakeVibration: "Tidak ada getaran abnormal saat pengereman",
    p2hItemHeadlamp: "Lampu utama",
    p2hItemTurnSignal: "Lampu sein",
    p2hItemBrakeLight: "Lampu rem",
    p2hItemReverseLight: "Lampu mundur",
    p2hItemHorn: "Klakson",
    p2hItemWiper: "Wiper",
    p2hItemDashboardPanel: "Panel indikator dashboard",
    p2hItemAc: "AC kendaraan",
    p2hItemFireExtinguisher: "APAR",
    p2hItemFirstAid: "Kotak P3K",
    p2hItemTriangle: "Segitiga pengaman",
    p2hItemJack: "Dongkrak",
    p2hItemWheelWrench: "Kunci roda",
    p2hItemSeatbelt: "Sabuk pengaman",
    p2hItemVehicleDocs: "Dokumen kendaraan/STNK",
    p2hItemBody: "Body kendaraan",
    p2hItemMirror: "Spion",
    p2hItemGlass: "Kaca depan/samping/belakang",
    p2hItemDoorLock: "Pintu dan central lock",
    p2hItemSeat: "Jok/kursi",
    p2hItemDashboard: "Dashboard",
    p2hItemTrunk: "Bagasi",
    p2hItemExteriorClean: "Eksterior bersih",
    p2hItemInteriorClean: "Interior bersih",
    p2hItemCarpetClean: "Karpet bersih",
    p2hItemNoTrash: "Tidak ada sampah",
    p2hItemNoOdor: "Tidak ada bau tidak sedap",
    p2hItemTrunkClean: "Bagasi bersih",
    p2hItemFuelEnough: "BBM cukup",
    p2hItemKmInput: "KM awal diinput",
    p2hItemReady: "Kendaraan siap jalan",
    p2hItemNoAbnormal: "Tidak ada suara/indikasi abnormal",
    p2hItemDriverStatement: "Driver menyatakan kendaraan layak digunakan",
  },
  en: {
    logout: "Logout",
    appEyebrow: "Fleet & Vehicle Management",
    count: "Count",
    vehicleDocumentNotifications: "Vehicle document notifications",
    navDashboard: "Dashboard",
    navDriverScheduleDashboard: "Driver Schedule Dashboard",
    navBooking: "Booking",
    navHistory: "My History",
    navApproval: "Approval",
    navGa: "GA Control",
    navVehicles: "Vehicle Management",
    navMaintenance: "Preventive Maintenance",
    navUserReviews: "User Reviews",
    navEmployees: "Employee",
    navBackupRestore: "Backup & Restore",
    navDriver: "Driver Page",
    navP2hChecklist: "P2H Checklist",
    navP2hReport: "P2H Report",
    navGuide: "Guide & Technical",
    navDataManagement: "Data Management",
    p2hChecklistTitle: "P2H Checklist",
    p2hChecklistSubtitle: "Daily vehicle inspection and checking by drivers.",
    p2hReportTitle: "P2H Report",
    p2hReportSubtitle: "Daily vehicle inspection summary, analytics, and follow-up.",
    p2hPerformanceTitle: "Daily Inspection / P2H Performance Chart",
    p2hMissingDriverAlert: "You have not submitted today's P2H Checklist. Please inspect the vehicle and submit the report.",
    p2hMissingGaAlert: "Attention: Some drivers have not submitted P2H today by the 09:00 deadline.",
    p2hDate: "P2H Date",
    p2hCondition: "Vehicle Condition",
    p2hFuelStatus: "Fuel Status",
    p2hKmStart: "Today Start KM",
    p2hGeneralNote: "General Note",
    p2hDamageNote: "Damage Note",
    p2hRecommendation: "Follow-up Recommendation",
    p2hUpload: "Upload damage photo",
    submitP2h: "Save P2H",
    confirmSubmitP2h: "Submit today's P2H Checklist?",
    p2hHistoryMine: "My P2H History",
    p2hReportsTable: "P2H Report Table",
    downloadP2hReport: "Download P2H Report",
    followUpStatus: "Follow-up Status",
    p2hStatus: "P2H Status",
    p2hTrendTitle: "P2H Trend",
    p2hNormalVsFollowUp: "Normal vs Follow Up",
    p2hNoChartData: "No chart data yet.",
    p2hNoStatusData: "No status data yet.",
    p2hNoConsistencyData: "No consistency data yet.",
    p2hNoReportPeriod: "No P2H reports for this period yet.",
    p2hNoReport: "No P2H reports yet.",
    p2hOk: "OK",
    p2hNotOk: "Not OK",
    p2hNotApplicable: "Not Applicable",
    p2hNew: "New",
    p2hInProgress: "In Progress",
    p2hDone: "Done",
    p2hInvalid: "Rejected / Invalid",
    p2hTime: "Time",
    p2hNotSubmitted: "Not Submitted",
    p2hVeryConsistent: "Very Consistent",
    p2hConsistent: "Consistent",
    p2hNeedsMonitoring: "Needs Monitoring",
    p2hNotConsistent: "Not Consistent",
    followUpNote: "Follow-up Note",
    followUpAction: "Repair Action",
    followUpDate: "Follow-up Date",
    saveFollowUp: "Save Follow-up",
    p2hChecklistItems: "Inspection checklist",
    p2hOperationalCleanliness: "Cleanliness checklist",
    totalRequiredDays: "Required P2H Days",
    totalP2hReports: "Total P2H Reports",
    avgDriverConsistency: "Average Driver Consistency",
    missingDrivers: "Missing Drivers",
    totalNotOk: "Total Not OK Findings",
    followUpDone: "Follow-up Done",
    followUpPending: "Follow-up Pending",
    driverConsistencyPerformance: "Driver Consistency Performance",
    requiredDays: "Required P2H Days",
    submittedDays: "Submitted P2H Days",
    missingDays: "Missing Days",
    consistency: "Consistency",
    findings: "Not OK Findings",
    manualP2hWorkdays: "Manual Working Days",
    saveWorkdays: "Save Working Days",
    manualWorkdayHint: "Optional. When filled, this value replaces the Monday-Friday minus holiday count for this interval.",
    p2hHolidaysExcluded: "Registered national holidays/joint leave days are excluded.",
    guideTitle: "Guide & Technical",
    backupRestoreTitle: "Backup & Restore Database",
    backupRestoreSubtitle: "Manual application database backup and Super Admin-only restore.",
    backupDatabase: "Backup Database",
    backupHistory: "Backup History",
    latestBackup: "Latest Backup",
    backupFile: "Backup File",
    backupSize: "File Size",
    backupDate: "Backup Date",
    downloadBackup: "Download Backup",
    restoreBackup: "Restore Backup",
    deleteBackup: "Delete Backup",
    confirmRestoreBackup: "Restore database from this backup? Current data will be replaced.",
    confirmDeleteBackup: "Permanently delete this backup file?",
    noBackupHistory: "No database backup yet.",
    dataManagementTitle: "Data Management",
    dataManagementSubtitle: "Manage data size, operational archive, and safe low-priority cleanup.",
    databaseSize: "Database Size",
    masterData: "Master Data",
    transactionData: "Transaction Data",
    temporaryData: "Temporary Data",
    archivedData: "Archived Data",
    retentionRules: "Retention Rules",
    archiveOldData: "Archive Old Data",
    archiveCutoffDate: "Archive before date",
    deleteTestingData: "Delete Testing Data",
    deleteOldLogs: "Delete Old Logs",
    logCutoffDate: "Delete logs before date",
    testingCutoffDate: "Delete testing until date",
    dataManagementAudit: "Data Management Audit",
    archiveSummary: "Monthly Archive Summary",
    confirmArchiveData: "Archive old operational data? Master data will not be deleted.",
    confirmDeleteTestingData: "Delete detected testing data? Master data will not be deleted.",
    confirmDeleteOldLogs: "Delete old logs? Master data will not be deleted.",
    protectedData: "Protected",
    noAuditLog: "No audit yet.",
    noArchiveSummary: "No archive summary yet.",
    guideSubtitle: "Search role scope, flows, rules, and system steps.",
    guideSearchLabel: "Search Guide",
    guideSearchPlaceholder: "Search booking, approval, driver, review...",
    guideAskLabel: "Ask Guide",
    guideAskButton: "Ask",
    guideAskPlaceholder: "Example: how do I approve a request?",
    guideAnswerTitle: "Guide Answer",
    guideRelatedTopic: "Related topic",
    guideNoAnswer: "I could not find a suitable answer in the guide yet. Try another keyword such as booking, approval, GA Control, driver, review, maintenance, or schedule.",
    guideAskEmpty: "Please type a question first.",
    downloadGuidePdf: "Download PDF",
    historySubtitle: "Reviews are required for completed trips.",
    filterStartDate: "From Date",
    filterEndDate: "To Date",
    clearFilter: "Reset Filter",
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
    statWaitingTrip: "Waiting Trip",
    statCompleted: "Completed",
    statRejected: "Rejected",
    tripMonitoring: "Trip Monitoring",
    driverSchedule: "Driver Schedule",
    driverScheduleDashboardTitle: "Driver Schedule Dashboard",
    driverScheduleDashboardSubtitle: "Schedule, driver availability, vehicle availability, and open time-slot information.",
    viewDriverScheduleDashboard: "View Driver Schedule Dashboard",
    quickSearch: "Quick Search",
    todaySchedule: "Today's Schedule",
    tomorrowSchedule: "Tomorrow's Schedule",
    emptySlots: "Open Slots",
    noRecommendedSlotInfo: "No recommended slots are available. For needs outside operational hours, please contact GA at least D-2.",
    fullScheduleDrivers: "Full Schedule Drivers",
    almostFullSchedule: "Almost Full",
    fullBooked: "Full Booked",
    departureReminderTitle: "Departure Reminder",
    gaDepartureReminder: "Attention: Driver has not started trip for booking {code} scheduled to depart at {time}. Please follow up.",
    driverDepartureReminder: "You have a trip scheduled at {time}. Please click 'Start Trip' when ready to depart.",
    available: "Available",
    allDrivers: "All Drivers",
    allVehicles: "All Vehicles",
    noDefaultDriver: "No default driver yet",
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
    lastServiceDate: "Last Service Date",
    lastMaintenanceMonth: "Maintenance Reference Date",
    maintenanceKmReference: "Maintenance KM Reference",
    maintenanceMonthReference: "Maintenance Month Interval",
    maintenanceReferenceLink: "Maintenance Reference Link",
    maintenanceDueMonth: "Maintenance Reference Date",
    maintenanceMonthInterval: "Maintenance Month Interval",
    maintenanceTitle: "Vehicle Preventive Maintenance",
    maintenanceSubtitle: "Monitor scheduled vehicle maintenance by KM and maintenance month.",
    maintenanceRealization: "Maintenance Realization Input",
    maintenanceTypeSection: "Select performed maintenance types",
    maintenancePartSection: "Checklist replaced or repaired parts/components",
    customMaintenanceType: "Other maintenance type",
    customPart: "Other / custom part",
    maintenanceHistory: "Maintenance Realization History",
    maintenanceType: "Maintenance Type",
    maintenanceParts: "Part Checklist",
    inputBy: "Input By",
    filterPlateNumber: "Filter License Plate",
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
    driverManagement: "Driver Management",
    addRegisteredDriver: "Add Registered Driver",
    selectRegisteredEmployee: "Select registered employee",
    addDriver: "Add Driver",
    noRegisteredDriverCandidate: "No registered employee can be added as a driver.",
    confirmDeleteDriver: "Remove this driver from Driver Management?",
    defaultVehicle: "Default Vehicle",
    simExpiryDate: "SIM Expiry Date",
    defaultVehicleUnavailable: "Information: the currently available unit differs from the driver's default/recommended vehicle.",
    assignedVehicleRecommendationWarning: "The recommended vehicle has assigned / dedicated status. Please contact the related vehicle user.",
    defaultVehicleMissing: "This driver has no default vehicle.",
    addVehicle: "Add Vehicle",
    vehicleList: "Vehicle List",
    vehicleDocAlerts: "Vehicle Document Alerts",
    notificationsTitle: "Notifications",
    notificationsEmpty: "No notifications.",
    remainingKm: "{km} KM remaining",
    queueSchedule: "Queue Schedule",
    performanceChartTitle: "GA Performance Chart",
    performanceChartSubtitle: "Vehicle request monitoring by period",
    periodScore: "Period Score",
    runningAverage: "Running Average",
    statCanceled: "Cancelled",
    monitoringInterval: "Monitoring Interval:",
    until: "to",
    startMonth: "Start month",
    startYear: "Start year",
    endMonth: "End month",
    endYear: "End year",
    allMonths: "12 Months",
    last12Months: "12 Months",
    last6Months: "6 Months",
    last3Months: "3 Months",
    dailyInMonth: "Daily",
    vehicleHealthTitle: "Vehicle Health Dashboard",
    healthScore: "Health Score",
    fuelLiters: "Fuel Liters",
    fuelType: "Fuel Type",
    vehicleConditionNotes: "Vehicle Condition Notes",
    fuelEfficiencyTrend: "KM/Liter Trend",
    fuelDate: "Fuel Date",
    fuelPrice: "Fuel Price",
    totalFuelCost: "Total Fuel Cost",
    mostEfficientVehicles: "Most Efficient Vehicles",
    leastEfficientVehicles: "Least Efficient Vehicles",
    fuelTransactions: "Fuel Transaction Details",
    baselineConsumption: "Historical Average",
    currentMonthConsumption: "This Month",
    oneMonthConsumption: "Last 1 Month",
    threeMonthConsumption: "3 Months",
    sixMonthConsumption: "6 Months",
    fuelCostMonth: "Fuel Cost This Month",
    fuelConsumptionLiters: "Fuel Consumption",
    fuelAlert: "Fuel consumption is lower than historical average. Inspection is recommended.",
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
    roleUser: "User",
    roleLeader: "Leader",
    roleGaAdmin: "GA Admin",
    roleDriver: "Driver",
    roleSuperAdmin: "Super Admin",
    vehicleStatusAvailable: "Available",
    vehicleStatusMaintenance: "Maintenance",
    vehicleStatusAssigned: "Assigned",
    fuelStatusPlaceholder: "Full / 1/2 / Low",
    driverScheduleSearchPlaceholder: "Driver, vehicle, destination...",
    mapPlaceholder: "https://maps.google.com/...",
    notificationFallback: "Notification",
    status: "Status",
    date: "Date",
    file: "File",
    odometer: "Odometer",
    noData: "No data.",
    noPositionData: "No position data yet",
    noDepartmentData: "No department data yet",
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
    p2hCatEngine: "Engine & Fluid Inspection",
    p2hCatTires: "Tires & Undercarriage Inspection",
    p2hCatBrakes: "Brake & Steering Inspection",
    p2hCatElectrical: "Lighting & Electrical Inspection",
    p2hCatSafety: "Safety Equipment Inspection",
    p2hCatBody: "Body & Interior Inspection",
    p2hCatCleanliness: "Vehicle Cleanliness",
    p2hCatOperational: "Operational Readiness",
    p2hItemEngineOil: "Engine oil",
    p2hItemCoolant: "Radiator/coolant water",
    p2hItemBrakeFluid: "Brake fluid",
    p2hItemPowerSteering: "Power steering fluid",
    p2hItemWiperFluid: "Wiper fluid",
    p2hItemBattery: "Battery condition",
    p2hItemNoLeak: "No oil/fluid leaks",
    p2hItemTirePressure: "Tire pressure",
    p2hItemTireTread: "Tire tread condition",
    p2hItemSpareTire: "Spare tire",
    p2hItemWheelNuts: "Wheel nuts",
    p2hItemSuspension: "Suspension/shockbreaker",
    p2hItemNoFootNoise: "No abnormal undercarriage noise",
    p2hItemMainBrake: "Main brake",
    p2hItemParkingBrake: "Parking brake",
    p2hItemSteering: "Steering normal",
    p2hItemBrakePedal: "Brake pedal normal",
    p2hItemNoBrakeVibration: "No abnormal vibration when braking",
    p2hItemHeadlamp: "Headlights",
    p2hItemTurnSignal: "Turn signals",
    p2hItemBrakeLight: "Brake lights",
    p2hItemReverseLight: "Reverse lights",
    p2hItemHorn: "Horn",
    p2hItemWiper: "Wiper",
    p2hItemDashboardPanel: "Dashboard indicator panel",
    p2hItemAc: "Vehicle AC",
    p2hItemFireExtinguisher: "Fire extinguisher",
    p2hItemFirstAid: "First aid kit",
    p2hItemTriangle: "Safety triangle",
    p2hItemJack: "Jack",
    p2hItemWheelWrench: "Wheel wrench",
    p2hItemSeatbelt: "Seat belts",
    p2hItemVehicleDocs: "Vehicle documents/STNK",
    p2hItemBody: "Vehicle body",
    p2hItemMirror: "Mirrors",
    p2hItemGlass: "Front/side/rear glass",
    p2hItemDoorLock: "Doors and central lock",
    p2hItemSeat: "Seats",
    p2hItemDashboard: "Dashboard",
    p2hItemTrunk: "Trunk",
    p2hItemExteriorClean: "Exterior clean",
    p2hItemInteriorClean: "Interior clean",
    p2hItemCarpetClean: "Carpet clean",
    p2hItemNoTrash: "No trash",
    p2hItemNoOdor: "No bad odor",
    p2hItemTrunkClean: "Trunk clean",
    p2hItemFuelEnough: "Enough fuel",
    p2hItemKmInput: "Start KM entered",
    p2hItemReady: "Vehicle ready to operate",
    p2hItemNoAbnormal: "No abnormal sound/indication",
    p2hItemDriverStatement: "Driver confirms the vehicle is roadworthy",
  },
};

const GUIDE_CONTENT = {
  id: [
    {
      title: "Scope Role User",
      tags: "user booking riwayat review dashboard jadwal",
      points: [
        "Membuat booking kendaraan, melihat riwayat pribadi, dan memberi review setelah perjalanan selesai.",
        "User dapat melihat Dashboard Jadwal Driver sebagai referensi ketersediaan waktu.",
        "Booking baru dapat dibatasi jika masih ada perjalanan aktif atau perjalanan selesai yang belum direview.",
      ],
    },
    {
      title: "Scope Role Pimpinan",
      tags: "pimpinan leader approval persetujuan reject",
      points: [
        "Menerima request yang sesuai routing pimpinan user.",
        "Dapat menyetujui atau menolak request, serta mengisi catatan persetujuan.",
        "Super Admin tetap punya akses penuh, namun notifikasi approval normal hanya diberikan ke pimpinan terkait.",
      ],
    },
    {
      title: "Scope Role GA Admin",
      tags: "ga admin kontrol assignment kendaraan driver maintenance review user",
      points: [
        "Mengelola request yang sudah disetujui, memilih driver, memilih kendaraan, dan memastikan tidak ada konflik jadwal.",
        "Mengelola master kendaraan, manajemen driver, perawatan berkala, dashboard kesehatan kendaraan, dan review user.",
        "Kendaraan maintenance tidak boleh dipakai assignment. Kendaraan assigned/dedicated boleh dipilih, tetapi GA perlu menghubungi pengguna terkait.",
      ],
    },
    {
      title: "Scope Role Driver",
      tags: "driver mulai perjalanan selesai km bbm toll parkir",
      points: [
        "Melihat tugas perjalanan yang ditugaskan.",
        "Menekan Mulai Perjalanan saat siap berangkat, lalu menyelesaikan perjalanan dengan KM akhir, liter BBM, biaya BBM, tol, dan parkir.",
        "KM awal mengikuti KM akhir kendaraan sebelumnya dan tidak boleh lebih rendah dari referensi sistem.",
      ],
    },
    {
      title: "Flow Booking Kendaraan",
      tags: "booking request flow user tanggal maps plat kapasitas",
      points: [
        "User mengisi tujuan, keperluan, tanggal mulai, tanggal selesai, jam berangkat, jam pulang, jumlah penumpang, checklist plat, Google Maps, dan catatan.",
        "Sistem mengecek jadwal bentrok, kapasitas kursi, plat ganjil/genap/bebas, driver, kendaraan, dan buffer operasional.",
        "Jika penuh, user diarahkan melihat Dashboard Jadwal Driver dan menghubungi GA untuk kebutuhan mendesak.",
      ],
    },
    {
      title: "Flow Approval",
      tags: "approval persetujuan pimpinan approve reject pending",
      points: [
        "Request baru masuk ke status Menunggu Persetujuan Pimpinan.",
        "Pimpinan dapat approve atau reject dari menu Persetujuan.",
        "Setelah approve, request masuk ke Kontrol GA untuk assignment driver dan kendaraan.",
      ],
    },
    {
      title: "Flow Kontrol GA",
      tags: "kontrol ga assign rekomendasi default driver kendaraan conflict",
      points: [
        "Sistem memberi rekomendasi kendaraan sesuai kapasitas, plat, jadwal, dan ketersediaan.",
        "Jika driver dipilih, kendaraan default driver akan direkomendasikan bila tersedia, namun GA tetap bisa mengganti manual.",
        "Sistem menolak double booking driver atau kendaraan pada jadwal yang bentrok.",
      ],
    },
    {
      title: "Dashboard Jadwal Driver",
      tags: "dashboard jadwal driver slot kosong available full schedule",
      points: [
        "Menampilkan jadwal hari ini, jadwal besok, driver available, driver full schedule, kendaraan, dan slot kosong.",
        "Slot yang sudah lewat waktu aktual tidak lagi direkomendasikan.",
        "Untuk kebutuhan di luar jam operasional, hubungi GA minimal H-2.",
      ],
    },
    {
      title: "Review User & Tindak Lanjut",
      tags: "review rating tindak lanjut upload pdf bukti",
      points: [
        "User wajib memberi rating dan komentar setelah perjalanan selesai.",
        "GA Admin dan Super Admin dapat melihat semua review, mengisi tindak lanjut, upload bukti PDF, dan export Excel.",
        "Data review disimpan maksimal satu tahun ke belakang sesuai aturan cleanup.",
      ],
    },
    {
      title: "Perawatan & Kesehatan Kendaraan",
      tags: "maintenance stnk kir sim kesehatan bbm km liter",
      points: [
        "Perawatan berkala memonitor KM akhir, tanggal service terakhir, tanggal referensi maintenance, referensi KM, dan link referensi perawatan.",
        "Sistem memberi notifikasi STNK, KIR, SIM driver, dan maintenance mendekati jatuh tempo.",
        "Dashboard kesehatan kendaraan mengacu pada konsumsi BBM satu bulan terakhir dibanding rata-rata historis kendaraan.",
      ],
    },
    {
      title: "Perhitungan Konsistensi P2H",
      tags: "p2h konsistensi driver hari wajib submit tidak submit rumus",
      points: [
        "Hari Wajib P2H dihitung dari hari kerja Senin-Jumat pada interval monitoring yang dipilih, dan hanya sampai tanggal hari ini jika periode melewati masa depan.",
        "Tanggal merah nasional/cuti bersama yang terdaftar di sistem tidak dihitung sebagai Hari Wajib P2H.",
        "Admin GA dan Super Admin dapat mengisi manual jumlah hari kerja bila kalender operasional perusahaan berbeda.",
        "Jumlah Kirim P2H dihitung satu kali per driver per tanggal, walaupun driver mengisi lebih dari satu kendaraan pada hari yang sama.",
        "Rumus konsistensi: Jumlah Kirim P2H / Hari Wajib P2H x 100%. Contoh 2 kirim dari 17 hari wajib = 11,8%.",
        "Kategori: 95-100% Sangat Konsisten, 85-94% Konsisten, 70-84% Perlu Monitoring, dan di bawah 70% Tidak Konsisten.",
      ],
    },
  ],
  en: [
    {
      title: "User Role Scope",
      tags: "user booking history review schedule dashboard",
      points: [
        "Create vehicle bookings, view personal history, and submit reviews after completed trips.",
        "Users can open Driver Schedule Dashboard to check available time slots.",
        "New booking may be limited when active or unreviewed completed trips still exist.",
      ],
    },
    {
      title: "Leader Role Scope",
      tags: "leader approval approve reject",
      points: [
        "Receive requests routed to the requester's leader.",
        "Approve or reject requests and add approval notes.",
        "Super Admin keeps full access, but normal approval notifications go only to the related leader.",
      ],
    },
    {
      title: "GA Admin Role Scope",
      tags: "ga admin assignment vehicle driver maintenance reviews",
      points: [
        "Manage approved requests, assign drivers and vehicles, and prevent schedule conflicts.",
        "Manage vehicle master, driver management, preventive maintenance, vehicle health, and user reviews.",
        "Maintenance vehicles cannot be assigned. Assigned/dedicated vehicles can be selected, but GA should contact the related user.",
      ],
    },
    {
      title: "Driver Role Scope",
      tags: "driver start finish km fuel toll parking",
      points: [
        "View assigned trip tasks.",
        "Start the trip when ready and complete it with end KM, fuel liters, fuel cost, toll, and parking.",
        "Start KM follows the vehicle's previous end KM and cannot be lower than the system reference.",
      ],
    },
    {
      title: "Vehicle Booking Flow",
      tags: "booking request date maps plate capacity",
      points: [
        "User fills destination, purpose, dates, departure/return time, passengers, plate rule, Google Maps, and notes.",
        "System checks schedule conflicts, seat capacity, odd/even/free plate rule, driver, vehicle, and operational buffer.",
        "If full, user is directed to Driver Schedule Dashboard and GA contact for urgent needs.",
      ],
    },
    {
      title: "Approval Flow",
      tags: "approval leader pending approve reject",
      points: [
        "New requests enter Pending Leader Approval status.",
        "Leader can approve or reject from Approval menu.",
        "After approval, request moves to GA Control for driver and vehicle assignment.",
      ],
    },
    {
      title: "GA Control Flow",
      tags: "ga control assign recommendation default driver vehicle conflict",
      points: [
        "System recommends vehicles based on capacity, plate rule, schedule, and availability.",
        "When a driver is selected, the driver's default vehicle is recommended when available, but GA can still change it manually.",
        "System prevents double booking for drivers or vehicles on overlapping schedules.",
      ],
    },
    {
      title: "Driver Schedule Dashboard",
      tags: "driver schedule dashboard empty slots available full",
      points: [
        "Shows today's schedule, tomorrow's schedule, available drivers, full schedule drivers, vehicles, and empty slots.",
        "Past actual-time slots are no longer recommended.",
        "For outside-operational-hour needs, contact GA at least H-2.",
      ],
    },
    {
      title: "User Review & Follow Up",
      tags: "review rating follow up upload pdf proof",
      points: [
        "Users must submit rating and comments after completed trips.",
        "GA Admin and Super Admin can view reviews, fill follow-up notes, upload PDF proof, and export Excel.",
        "Review data is kept for up to one year according to cleanup rules.",
      ],
    },
    {
      title: "Maintenance & Vehicle Health",
      tags: "maintenance stnk kir sim health fuel km liter",
      points: [
        "Preventive maintenance monitors end KM, last service date, maintenance reference date, KM reference, and maintenance reference link.",
        "System notifies STNK, KIR, driver SIM, and maintenance due dates.",
        "Vehicle health dashboard uses last-month fuel consumption compared with the vehicle's historical average.",
      ],
    },
    {
      title: "P2H Consistency Calculation",
      tags: "p2h consistency driver required days submitted missing formula",
      points: [
        "Required P2H Days are counted from weekdays Monday-Friday in the selected monitoring interval, capped at today's date when the period extends into the future.",
        "Registered national holidays/joint leave days are excluded from Required P2H Days.",
        "GA Admin and Super Admin can manually override working days when company operations differ from the calendar.",
        "Submitted P2H Days are counted once per driver per date, even if the driver submits P2H for more than one vehicle on the same day.",
        "Consistency formula: Submitted P2H Days / Required P2H Days x 100%. Example: 2 submissions from 17 required days = 11.8%.",
        "Categories: 95-100% Very Consistent, 85-94% Consistent, 70-84% Needs Monitoring, and below 70% Not Consistent.",
      ],
    },
  ],
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

function roleLabel(role) {
  const labels = {
    user: t("roleUser"),
    pimpinan: t("roleLeader"),
    ga_admin: t("roleGaAdmin"),
    driver: t("roleDriver"),
    super_admin: t("roleSuperAdmin"),
  };
  return labels[role] || role;
}

function roleText(value) {
  return String(value || "").split(",").map((role) => role.trim()).filter(Boolean).map(roleLabel).join(", ");
}

function vehicleStatusLabel(status) {
  const labels = {
    AVAILABLE: t("vehicleStatusAvailable"),
    MAINTENANCE: t("vehicleStatusMaintenance"),
    ASSIGNED: t("vehicleStatusAssigned"),
  };
  return labels[String(status || "").toUpperCase()] || status || "-";
}

function p2hResultLabel(value) {
  const labels = {
    OK: t("p2hOk"),
    "Tidak OK": t("p2hNotOk"),
    "Tidak Berlaku": t("p2hNotApplicable"),
  };
  return labels[value] || value || "-";
}

function p2hStatusLabel(value) {
  const labels = {
    Normal: "Normal",
    "Perlu Follow Up GA": lang === "en" ? "Needs GA Follow-up" : "Perlu Tindak Lanjut GA",
    "Belum Submit": t("p2hNotSubmitted"),
  };
  return labels[value] || value || "-";
}

function p2hFollowLabel(value) {
  const labels = {
    Baru: t("p2hNew"),
    Diproses: t("p2hInProgress"),
    Selesai: t("p2hDone"),
    "Ditolak / Tidak Valid": t("p2hInvalid"),
  };
  return labels[value] || value || "-";
}

function p2hText(value) {
  const labels = {
    "Pemeriksaan Mesin & Cairan": t("p2hCatEngine"),
    "Pemeriksaan Ban & Kaki-kaki": t("p2hCatTires"),
    "Pemeriksaan Rem & Kemudi": t("p2hCatBrakes"),
    "Pemeriksaan Lampu & Kelistrikan": t("p2hCatElectrical"),
    "Pemeriksaan Safety Equipment": t("p2hCatSafety"),
    "Pemeriksaan Body & Interior": t("p2hCatBody"),
    "Kebersihan Kendaraan": t("p2hCatCleanliness"),
    "Kesiapan Operasional": t("p2hCatOperational"),
    "Oli mesin": t("p2hItemEngineOil"),
    "Air radiator/coolant": t("p2hItemCoolant"),
    "Minyak rem": t("p2hItemBrakeFluid"),
    "Minyak power steering": t("p2hItemPowerSteering"),
    "Air wiper": t("p2hItemWiperFluid"),
    "Kondisi aki/battery": t("p2hItemBattery"),
    "Tidak ada kebocoran oli/cairan": t("p2hItemNoLeak"),
    "Tekanan ban": t("p2hItemTirePressure"),
    "Kondisi tapak ban": t("p2hItemTireTread"),
    "Ban cadangan": t("p2hItemSpareTire"),
    "Baut roda": t("p2hItemWheelNuts"),
    "Suspensi/shockbreaker": t("p2hItemSuspension"),
    "Tidak ada bunyi abnormal pada kaki-kaki": t("p2hItemNoFootNoise"),
    "Rem utama": t("p2hItemMainBrake"),
    "Rem tangan/parking brake": t("p2hItemParkingBrake"),
    "Setir/kemudi normal": t("p2hItemSteering"),
    "Pedal rem normal": t("p2hItemBrakePedal"),
    "Tidak ada getaran abnormal saat pengereman": t("p2hItemNoBrakeVibration"),
    "Lampu utama": t("p2hItemHeadlamp"),
    "Lampu sein": t("p2hItemTurnSignal"),
    "Lampu rem": t("p2hItemBrakeLight"),
    "Lampu mundur": t("p2hItemReverseLight"),
    Klakson: t("p2hItemHorn"),
    Wiper: t("p2hItemWiper"),
    "Panel indikator dashboard": t("p2hItemDashboardPanel"),
    "AC kendaraan": t("p2hItemAc"),
    APAR: t("p2hItemFireExtinguisher"),
    "Kotak P3K": t("p2hItemFirstAid"),
    "Segitiga pengaman": t("p2hItemTriangle"),
    Dongkrak: t("p2hItemJack"),
    "Kunci roda": t("p2hItemWheelWrench"),
    "Sabuk pengaman": t("p2hItemSeatbelt"),
    "Dokumen kendaraan/STNK": t("p2hItemVehicleDocs"),
    "Body kendaraan": t("p2hItemBody"),
    Spion: t("p2hItemMirror"),
    "Kaca depan/samping/belakang": t("p2hItemGlass"),
    "Pintu dan central lock": t("p2hItemDoorLock"),
    "Jok/kursi": t("p2hItemSeat"),
    Dashboard: t("p2hItemDashboard"),
    Bagasi: t("p2hItemTrunk"),
    "Eksterior bersih": t("p2hItemExteriorClean"),
    "Interior bersih": t("p2hItemInteriorClean"),
    "Karpet bersih": t("p2hItemCarpetClean"),
    "Tidak ada sampah": t("p2hItemNoTrash"),
    "Tidak ada bau tidak sedap": t("p2hItemNoOdor"),
    "Bagasi bersih": t("p2hItemTrunkClean"),
    "BBM cukup": t("p2hItemFuelEnough"),
    "KM awal diinput": t("p2hItemKmInput"),
    "Kendaraan siap jalan": t("p2hItemReady"),
    "Tidak ada suara/indikasi abnormal": t("p2hItemNoAbnormal"),
    "Driver menyatakan kendaraan layak digunakan": t("p2hItemDriverStatement"),
  };
  return labels[value] || value || "-";
}

function applyTranslations() {
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.placeholder = t(node.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((node) => {
    node.setAttribute("aria-label", t(node.dataset.i18nAria));
  });
  document.querySelectorAll("[data-role-list]").forEach((node) => {
    node.textContent = node.dataset.roleList.split(",").filter(Boolean).map(roleLabel).join(", ");
  });
}

function message(key, replacements = {}) {
  return Object.entries(replacements).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, value), t(key));
}

function activateTab(tabName, options = {}) {
  const clearAlert = options.clearAlert !== false;
  const button = document.querySelector(`.nav-item[data-tab="${tabName}"]`);
  const panel = document.getElementById(tabName);
  if (!button || !panel) return;
  const currentPanel = document.querySelector(".tab-panel.active");
  if (currentPanel?.id === "booking" && tabName !== "booking") {
    clearBookingDraft(true);
  }
  if (clearAlert) document.getElementById("page-alert")?.remove();
  document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
  document.querySelectorAll(".tab-panel").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  panel.classList.add("active");
}

document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => activateTab(button.dataset.tab, { clearAlert: true }));
});

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function parseJsonArray(value) {
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return value ? String(value).split(",").map((item) => item.trim()).filter(Boolean) : [];
  }
}

function rupiah(value) {
  return `Rp ${moneyFormatter.format(Number(value || 0))}`;
}

function formatDate(value) {
  if (!value) return "-";
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  const locale = lang === "en" ? "en-US" : "id-ID";
  return parsed.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
}

function formatDateTime(value) {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  const locale = lang === "en" ? "en-US" : "id-ID";
  return parsed.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function addDaysIso(days) {
  const date = new Date(`${todayIso()}T00:00:00`);
  date.setDate(date.getDate() + days);
  return dateIsoLocal(date);
}

function dateIsoLocal(value) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isDateWithinDays(value, days) {
  if (!value) return false;
  return value >= todayIso() && value <= addDaysIso(days);
}

function formatMonthYear(value) {
  if (!value) return "-";
  const parsed = new Date(`${value}-01T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  const locale = lang === "en" ? "en-US" : "id-ID";
  const month = parsed.toLocaleDateString(locale, { month: "long" });
  return `${month.charAt(0).toUpperCase()}${month.slice(1)} - ${parsed.getFullYear()}`;
}

function monthLabel(value) {
  if (!value) return "-";
  const [year, month] = String(value).split("-");
  if (!month) return value;
  return `${monthName(Number(month) - 1).slice(0, 3)} ${year}`;
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

document.addEventListener("keydown", (event) => {
  const form = event.target.closest?.(".p2h-form");
  if (!form || event.key !== "Enter") return;
  const tagName = event.target.tagName;
  if (tagName === "TEXTAREA" || tagName === "BUTTON") return;
  event.preventDefault();
});

document.addEventListener("submit", (event) => {
  event.target.querySelectorAll("[data-money]").forEach((input) => {
    input.value = numericMoney(input.value);
  });
});

function safeRender(name, callback) {
  try {
    callback();
  } catch (error) {
    console.error(`Render failed: ${name}`, error);
  }
}

function renderAllSections() {
  [
    ["stats", renderStats],
    ["departureAlerts", renderDepartureAlerts],
    ["dashboard", renderDashboard],
    ["scoreboard", renderScoreboard],
    ["performanceChart", renderPerformanceChart],
    ["vehicleHealth", renderVehicleHealth],
    ["schedule", renderSchedule],
    ["history", renderHistory],
    ["approval", renderApproval],
    ["ga", renderGa],
    ["driver", renderDriver],
    ["p2hChecklist", renderP2hChecklist],
    ["p2hReport", renderP2hReport],
    ["vehicles", renderVehicles],
    ["driverManagement", renderDriverManagement],
    ["vehicleAlerts", renderVehicleAlerts],
    ["maintenance", renderMaintenance],
    ["userReviews", renderUserReviews],
    ["employees", renderEmployees],
    ["optionManager", renderOptionManager],
    ["driverScheduleDashboard", renderDriverScheduleDashboard],
    ["dataManagement", renderDataManagement],
    ["backupRestore", renderBackupRestore],
    ["guide", renderGuide],
  ].forEach(([name, callback]) => safeRender(name, callback));
}

async function refreshData() {
  const response = await fetch("/api/data");
  appData = await response.json();
  renderAllSections();
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
  if (!form.matches("[data-ajax-form], #approval-list form, #ga-list form, #user-review-list form, #departure-alerts form")) return;
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
  return start === end ? formatDate(start) : `${formatDate(start)} - ${formatDate(end)}`;
}

function itemDateRange(item) {
  return {
    start: item.start_date || item.travel_date || "",
    end: item.end_date || item.travel_date || "",
  };
}

function itemSortTimestamp(item) {
  const value = item.created_at || item.updated_at || item.edited_at || item.start_date || item.travel_date || "";
  const parsed = new Date(value.includes("T") ? value : `${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
}

function filteredHistoryItems() {
  const startFilter = document.getElementById("history-start-filter")?.value || "";
  const endFilter = document.getElementById("history-end-filter")?.value || "";
  return [...(appData.requests || [])]
    .filter((item) => {
      const range = itemDateRange(item);
      if (startFilter && range.end < startFilter) return false;
      if (endFilter && range.start > endFilter) return false;
      return true;
    })
    .sort((a, b) => itemSortTimestamp(b) - itemSortTimestamp(a));
}

function sortedOptions(options) {
  return [...new Set(options || [])].sort((a, b) => a.localeCompare(b, "id", { sensitivity: "base" }));
}

function ensureOptionData() {
  if (!appData) appData = {};
  if (!appData.options) appData.options = {};
  if (!Array.isArray(appData.options.positions)) appData.options.positions = [];
  if (!Array.isArray(appData.options.departments)) appData.options.departments = [];
}

function renderOptionSelects() {
  ensureOptionData();
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

async function addManagedOption(kind) {
  ensureOptionData();
  const input = document.querySelector(`[data-option-input="${kind}"]`);
  const value = input?.value.trim();
  if (!value) return;
  const response = await fetch("/options", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind, value }),
  });
  const result = await response.json();
  if (!result.ok) return window.alert(result.message || "Failed");
  const key = kind === "position" ? "positions" : "departments";
  appData.options[key] = Array.isArray(result.options) ? result.options : sortedOptions([...(appData.options[key] || []), result.value || value]);
  if (input) input.value = "";
  renderOptionSelects();
  renderOptionManager();
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
      ${item.edited_at ? `<p><strong>${t("editedAt")}:</strong> ${escapeHtml(formatDateTime(item.edited_at))}</p>` : ""}
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
  const now = new Date();
  const isFutureTrip = (item) => {
    const startDate = item.start_date || item.travel_date || "";
    const departTime = item.depart_time || "00:00";
    const start = new Date(`${startDate}T${departTime}`);
    return !Number.isNaN(start.getTime()) && start > now;
  };
  const pending = filtered.filter((item) => canonicalStatus(item.status) === "pending_leader_approval").length;
  const waitingTrip = filtered.filter((item) => ["approved", "processing_ga", "assigned"].includes(canonicalStatus(item.status)) && isFutureTrip(item)).length;
  const assigned = filtered.filter((item) => {
    const status = canonicalStatus(item.status);
    if (status === "on_trip") return true;
    if (status === "assigned") return !isFutureTrip(item);
    return false;
  }).length;
  const completed = filtered.filter((item) => ["completed", "reviewed"].includes(canonicalStatus(item.status))).length;
  const rejected = filtered.filter((item) => canonicalStatus(item.status) === "rejected").length;
  document.getElementById("stat-total").textContent = filtered.length;
  document.getElementById("stat-pending").textContent = pending;
  const waitingTarget = document.getElementById("stat-waiting-trip");
  if (waitingTarget) waitingTarget.textContent = waitingTrip;
  document.getElementById("stat-assigned").textContent = assigned;
  document.getElementById("stat-completed").textContent = completed;
  document.getElementById("stat-rejected").textContent = rejected;
  const warning = document.getElementById("review-warning");
  if (stats.review_required > 0) {
    warning.textContent = `${stats.review_required} ${t("requiredReviewWarning")}`;
    warning.classList.remove("hidden");
  } else {
    warning.classList.add("hidden");
  }
}

function allDashboardItems() {
  if (appData.dashboard_requests?.length) return appData.dashboard_requests;
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

function clampMonthRange(start, end, maxMonths = 13) {
  if (start > end) [start, end] = [end, start];
  const maxDiff = Math.max(0, maxMonths - 1);
  if (monthDiff(start, end) > maxDiff) end = shiftMonth(start, maxDiff);
  return { start, end };
}

function initMonthInterval(startValue, endValue, options = {}) {
  const history = appData.performance_history || [];
  if (!history.length) return { start: "", end: "" };
  const availableMonths = new Set(history.map((item) => item.month));
  const currentMonth = new Date().toISOString().slice(0, 7);
  const fallbackMonth = options.defaultCurrent
    ? (availableMonths.has(currentMonth) ? currentMonth : history[history.length - 1].month)
    : history[Math.max(0, history.length - 12)].month;
  let start = startValue && availableMonths.has(startValue) ? startValue : fallbackMonth;
  let end = endValue && availableMonths.has(endValue) ? endValue : (options.defaultCurrent ? start : history[history.length - 1].month);
  return clampMonthRange(start, end, options.maxMonths || 13);
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

function performanceLevel(score, total) {
  if (!total) return "-";
  if (score >= 4.5) return lang === "en" ? "Excellence" : "Sangat Baik";
  if (score >= 3.5) return lang === "en" ? "Good" : "Baik";
  return lang === "en" ? "Poor" : "Kurang";
}

function performanceSeries(months) {
  const sameMonth = performanceStartMonth && performanceEndMonth && performanceStartMonth === performanceEndMonth;
  const basePoints = sameMonth ? (() => {
    const daily = appData.performance_daily_history?.[performanceStartMonth] || [];
    const today = todayIso();
    return daily.filter((item) => item.date <= today || Number(item.completed_trips || 0) > 0).map((item) => ({
      key: item.date,
      label: String(Number((item.date || "").slice(-2))),
      tooltipTitle: formatDate(item.date),
      score: Number(item.average_rating || 0),
      completed: Number(item.completed_trips || 0),
      granularity: "daily",
    }));
  })() : months.map((month) => ({
    key: month.month,
    label: formatMonthYear(month.month).split(" - ")[0].slice(0, 3),
    tooltipTitle: formatMonthYear(month.month),
    score: Number(month.average_rating || 0),
    completed: Number(month.completed_trips || 0),
    granularity: "monthly",
  }));
  let weightedScoreTotal = 0;
  let completedTotal = 0;
  return basePoints.map((point) => {
    const periodScore = Number(point.score || 0);
    const periodCompleted = Number(point.completed || 0);
    if (periodCompleted > 0) {
      weightedScoreTotal += periodScore * periodCompleted;
      completedTotal += periodCompleted;
    }
    const runningScore = completedTotal ? Math.round((weightedScoreTotal / completedTotal) * 100) / 100 : 0;
    return {
      ...point,
      period_score: periodScore,
      score: runningScore,
      cumulative_completed: completedTotal,
    };
  });
}

function renderPerformanceSummary() {
  const target = document.getElementById("performance-chart-summary");
  if (!target) return;
  const completedItems = chartFilteredItems().filter((item) => Number(item.rating || 0) > 0);
  const completed = completedItems.length;
  const average = completed ? Math.round((completedItems.reduce((sum, item) => sum + Number(item.rating || 0), 0) / completed) * 100) / 100 : 0;
  const level = performanceLevel(average, completed);
  const values = [
    { label: t("overallScore"), value: average, tone: "blue" },
    { label: t("avgRating"), value: average, tone: "green" },
    { label: t("totalCompletedTrips"), value: completed, tone: "yellow" },
    { label: t("level"), value: level, tone: completed && average < 3.5 ? "red" : "green" },
  ];
  target.innerHTML = values.map((item) => `
    <article class="mini-stat ${item.tone}">
      <span>${escapeHtml(item.label)}</span>
      <strong>${escapeHtml(item.value)}</strong>
    </article>
  `).join("");
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

function renderDepartureAlerts() {
  const targets = ["departure-alerts", "ga-departure-alerts", "driver-departure-alerts"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  if (!targets.length) return;
  const alerts = appData.departure_alerts || [];
  if (!alerts.length) {
    targets.forEach((target) => { target.innerHTML = ""; });
    return;
  }
  const roles = appData.roles || [];
  const meNik = appData.me?.nik || "";
  const markup = alerts.map((item) => {
    const isDriverAlert = roles.includes("driver") && item.driver_nik === meNik && !roles.includes("ga_admin") && !roles.includes("super_admin") && !roles.includes("admin");
    const alertMessage = isDriverAlert
      ? message("driverDepartureReminder", { time: item.depart_time })
      : message("gaDepartureReminder", { code: item.request_code, time: item.depart_time });
    return `
      <article class="departure-alert ${isDriverAlert ? "driver" : "ga"}">
        <div>
          <strong>${t("departureReminderTitle")}</strong>
          <p>${escapeHtml(alertMessage)}</p>
          <div class="departure-alert-meta">
            <span>${escapeHtml(item.request_code)}</span>
            <span>${escapeHtml(item.full_name)}</span>
            <span>${escapeHtml(item.destination)}</span>
            <span>${escapeHtml(item.depart_time)}</span>
            <span>${escapeHtml(item.driver_name)}</span>
            <span>${escapeHtml(item.plate_number)} ${escapeHtml(item.vehicle_name || "")}</span>
            <span>${escapeHtml(item.status_label || item.status)}</span>
          </div>
        </div>
        ${isDriverAlert ? `
          <form method="post" action="/requests/${item.id}/driver">
            <input type="hidden" name="action" value="start">
            <input type="hidden" name="km_start" value="${escapeHtml(item.minimum_km || 0)}">
            <button class="button primary" type="submit">${t("startTrip")}</button>
          </form>
        ` : ""}
      </article>
    `;
  }).join("");
  targets.forEach((target) => { target.innerHTML = markup; });
}

function renderScoreboard() {
  const target = document.getElementById("scoreboard-list");
  if (!target) return;
  const completed = chartFilteredItems().filter((item) => Number(item.rating || 0) > 0);
  const average = completed.length ? Math.round((completed.reduce((sum, item) => sum + Number(item.rating || 0), 0) / completed.length) * 100) / 100 : 0;
  const level = performanceLevel(average, completed.length);
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
      const driverLevel = total ? performanceLevel(driverAverage, total) : t("noRatingYet");
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
  const canvas = document.getElementById("performance-chart-canvas");
  const startMonthFilter = document.getElementById("performance-start-month-filter");
  const startYearFilter = document.getElementById("performance-start-year-filter");
  const endMonthFilter = document.getElementById("performance-end-month-filter");
  const endYearFilter = document.getElementById("performance-end-year-filter");
  if (!target || !canvas || !startMonthFilter || !startYearFilter || !endMonthFilter || !endYearFilter) return;
  selectedChartMonths();
  populateIntervalControls("performance", performanceStartMonth, performanceEndMonth);
  const months = selectedChartMonths();
  const points = performanceSeries(months.length ? months : [{ month: new Date().toISOString().slice(0, 7) }]);
  renderPerformanceSummary();
  const labels = points.map((item) => item.label);
  const values = points.map((item) => item.score);
  target.innerHTML = "";
  if (window.Chart) {
    target.classList.add("hidden");
    canvas.classList.remove("hidden");
    if (performanceChartInstance) performanceChartInstance.destroy();
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 0, 260);
    gradient.addColorStop(0, "#2563eb");
    gradient.addColorStop(1, "#93c5fd");
    const valueLabelPlugin = {
      id: "valueLabel",
      afterDatasetsDraw(chart) {
        const { ctx: chartCtx } = chart;
        chartCtx.save();
        chartCtx.fillStyle = "#0f172a";
        chartCtx.font = "700 11px DM Sans, sans-serif";
        chartCtx.textAlign = "center";
        chart.getDatasetMeta(0).data.forEach((bar, index) => {
          chartCtx.fillText(values[index], bar.x, Math.max(16, bar.y - 8));
        });
        chartCtx.restore();
      },
    };
    performanceChartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: t("overallScore"),
          data: values,
          backgroundColor: gradient,
          borderColor: "#1d4ed8",
          borderWidth: 1,
          borderRadius: 8,
          borderSkipped: false,
          barThickness: points.length > 16 ? 18 : 34,
          maxBarThickness: points.length > 16 ? 24 : 42,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 650, easing: "easeOutQuart" },
        layout: { padding: { top: 22, right: 12, bottom: 0, left: 4 } },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#0f172a",
            titleColor: "#fff",
            bodyColor: "#e2e8f0",
            padding: 12,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              title(items) {
                const point = points[items[0].dataIndex];
                return point.tooltipTitle;
              },
              label(item) {
                const point = points[item.dataIndex];
                return [
                  `${t("runningAverage")}: ${point.score}`,
                  `${t("periodScore")}: ${point.period_score}`,
                  `${t("totalCompletedTrips")}: ${point.completed}`,
                  `${t("statCompleted")}: ${point.cumulative_completed}`,
                ];
              },
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "#64748b", font: { size: 11, weight: "600" } },
            border: { display: false },
          },
          y: {
            beginAtZero: true,
            suggestedMax: Math.max(5, ...values) + 0.5,
            ticks: { stepSize: 1, color: "#94a3b8", font: { size: 11 } },
            grid: { color: "rgba(148, 163, 184, 0.18)", drawBorder: false },
            border: { display: false },
          },
        },
      },
      plugins: [valueLabelPlugin],
    });
  } else {
    canvas.classList.add("hidden");
    target.classList.remove("hidden");
    if (performanceChartInstance) {
      performanceChartInstance.destroy();
      performanceChartInstance = null;
    }
    const width = 720;
    const height = 250;
    const maxValue = 5;
    const gap = 12;
    const barWidth = Math.max(16, (width - 72 - gap * (points.length - 1)) / points.length);
    target.innerHTML = `
      <svg class="performance-svg" viewBox="0 0 ${width} ${height}" role="img">
        ${points.map((item, index) => {
          const value = Number(item.score || 0);
          const barHeight = (value / maxValue) * (height - 82);
          const x = 36 + index * (barWidth + gap);
          const y = height - 38 - barHeight;
          return `<rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="8" fill="#2563eb"><title>${escapeHtml(item.tooltipTitle)}: ${escapeHtml(t("runningAverage"))} ${escapeHtml(value)} / ${escapeHtml(item.cumulative_completed)} ${escapeHtml(t("totalCompletedTrips"))}</title></rect><text class="bar-value" x="${x + barWidth / 2}" y="${Math.max(16, y - 8)}" text-anchor="middle">${escapeHtml(value)}</text><text x="${x + barWidth / 2}" y="${height - 10}" text-anchor="middle">${escapeHtml(item.label)}</text>`;
        }).join("")}
      </svg>
    `;
  }
  renderStats();
  renderScoreboard();
  renderDashboard();
}

function renderVehicleHealth() {
  const target = document.getElementById("vehicle-health-list");
  if (!target) return;
  const items = appData.vehicle_health || [];
  if (!items.length) {
    target.innerHTML = empty(t("emptyVehicle"));
    return;
  }
  const efficient = [...items].sort((a, b) => Number(b.km_per_liter_1mo || b.baseline_km_per_liter || 0) - Number(a.km_per_liter_1mo || a.baseline_km_per_liter || 0)).slice(0, 5);
  const inefficient = [...items].sort((a, b) => Number(a.km_per_liter_1mo || a.baseline_km_per_liter || 9999) - Number(b.km_per_liter_1mo || b.baseline_km_per_liter || 9999)).slice(0, 5);
  const alerts = items.filter((item) => item.alert);
  const transactions = items.flatMap((item) => item.transactions || []).sort((a, b) => String(b.fuel_date || "").localeCompare(String(a.fuel_date || ""))).slice(0, 12);
  const rankList = (rankItems) => rankItems.map((item, index) => `
    <li><strong>${index + 1}. ${escapeHtml(item.plate_number)}</strong><span>${escapeHtml(item.vehicle_name)} · ${escapeHtml(item.km_per_liter_1mo || item.baseline_km_per_liter || 0)} KM/L</span></li>
  `).join("");
  target.innerHTML = `
    <div class="health-grid">${items.map((item) => `
      <article class="health-card ${escapeHtml(item.status_class || "")}">
        <div class="health-card-head">
          <span>${escapeHtml(item.plate_number)} - ${escapeHtml(item.vehicle_name)}</span>
          <b>${escapeHtml(item.status)}</b>
        </div>
        <strong>${escapeHtml(item.score)}%</strong>
        <small>${t("baselineConsumption")}: ${escapeHtml(item.baseline_km_per_liter || 0)} KM/L</small>
        <small>${t("oneMonthConsumption")}: ${escapeHtml(item.km_per_liter_1mo || 0)} KM/L · ${t("baselineConsumption")}: ${escapeHtml(item.baseline_km_per_liter || 0)} KM/L</small>
        <small>${t("threeMonthConsumption")}: ${escapeHtml(item.km_per_liter_3mo || 0)} KM/L · ${t("sixMonthConsumption")}: ${escapeHtml(item.km_per_liter_6mo || 0)} KM/L</small>
        <small>${t("fuelConsumptionLiters")} ${t("oneMonthConsumption")}: ${escapeHtml(item.fuel_liters_1mo || 0)} ${t("fuelLiters")}</small>
        <small>${t("fuelCostMonth")}: ${rupiah(item.fuel_cost_month)}</small>
        ${item.alert ? `<div class="alert warning compact-alert">${escapeHtml(item.alert_message || t("fuelAlert"))}</div>` : ""}
      </article>
    `).join("")}</div>
    <div class="health-dashboard-grid">
      <section class="health-panel wide"><h4>${t("notificationsTitle")}</h4>${alerts.length ? alerts.map((item) => `<div class="alert warning compact-alert"><strong>${escapeHtml(item.plate_number)}</strong> ${escapeHtml(item.alert_message || t("fuelAlert"))}</div>`).join("") : empty(t("notificationsEmpty"))}</section>
      <section class="health-panel wide">
        <h4>${t("fuelTransactions")}</h4>
        <table class="review-table">
          <thead><tr><th>${t("plateNumber")}</th><th>${t("vehicleName")}</th><th>${t("fuelDate")}</th><th>${t("odometer")}</th><th>KM/L</th><th>${t("fuelLiters")}</th><th>${t("fuelType")}</th><th>${t("fuelPrice")}</th><th>${t("totalFuelCost")}</th><th>${t("driver")}</th><th>${t("destination")}</th><th>${t("notes")}</th></tr></thead>
          <tbody>${transactions.length ? transactions.map((item) => `<tr><td>${escapeHtml(item.plate_number)}</td><td>${escapeHtml(item.vehicle_name)}</td><td>${formatDate(item.fuel_date)}</td><td>${escapeHtml(item.odometer)}</td><td>${escapeHtml(item.km_per_liter || "-")}</td><td>${escapeHtml(item.fuel_liters)}</td><td>${escapeHtml(item.fuel_type || "-")}</td><td>${rupiah(item.fuel_price)}</td><td>${rupiah(item.cost_fuel)}</td><td>${escapeHtml(item.driver_name || "-")}</td><td>${escapeHtml(item.destination || "-")}</td><td>${escapeHtml(item.vehicle_condition_notes || "-")}</td></tr>`).join("") : `<tr><td colspan="12">${t("noSchedule")}</td></tr>`}</tbody>
        </table>
      </section>
    </div>
  `;
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

function selectedScheduleDate() {
  return document.getElementById("driver-schedule-date-filter")?.value || todayIso();
}

function tripTouchesDate(item, date) {
  return (item.start_date || item.travel_date) <= date && date <= (item.end_date || item.travel_date);
}

function tripDateTime(item, date, time) {
  return new Date(`${date}T${time || "00:00"}`);
}

function tripOverlapsSlot(item, date, slotStart, slotEnd) {
  const startDate = item.start_date || item.travel_date;
  const endDate = item.end_date || item.travel_date;
  const hasAssignedResource = !!(item.driver_id || item.vehicle_id);
  const bufferMs = hasAssignedResource ? 2 * 60 * 60 * 1000 : 0;
  const itemStart = new Date(tripDateTime(item, startDate, item.depart_time).getTime() - bufferMs);
  const itemEnd = new Date(tripDateTime(item, endDate, item.return_time).getTime() + bufferMs);
  return itemStart < slotEnd && itemEnd > slotStart && tripTouchesDate(item, date);
}

function scheduleToneForBusyCount(count) {
  if (count >= 4) return "full";
  if (count >= 2) return "almost";
  return "available";
}

function renderDriverScheduleDashboard() {
  const target = document.getElementById("driver-schedule-dashboard-content");
  const dateInput = document.getElementById("driver-schedule-date-filter");
  const driverFilter = document.getElementById("driver-schedule-driver-filter");
  const vehicleFilter = document.getElementById("driver-schedule-vehicle-filter");
  const searchInput = document.getElementById("driver-schedule-search");
  if (!target || !dateInput || !driverFilter || !vehicleFilter || !searchInput) return;

  dateInput.min = todayIso();
  if (!dateInput.value) dateInput.value = todayIso();
  if (dateInput.value < todayIso()) dateInput.value = todayIso();
  const selectedDate = dateInput.value;
  const selectedDriver = driverFilter.value || "";
  const selectedVehicle = vehicleFilter.value || "";
  const query = (searchInput.value || "").trim().toLowerCase();
  const drivers = appData.schedule?.drivers || [];
  const vehicles = appData.schedule?.vehicles || [];
  const trips = (appData.schedule?.monthly || []).filter((item) => tripTouchesDate(item, selectedDate));
  const tomorrow = new Date(`${selectedDate}T00:00:00`);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowIso = tomorrow.toISOString().slice(0, 10);
  const tomorrowTrips = (appData.schedule?.monthly || []).filter((item) => tripTouchesDate(item, tomorrowIso));
  const vehicleMap = new Map(vehicles.map((vehicle) => [Number(vehicle.id), vehicle]));

  driverFilter.innerHTML = `<option value="">${t("allDrivers")}</option>${drivers.map((driver) => `<option value="${driver.id}" ${String(driver.id) === String(selectedDriver) ? "selected" : ""}>${escapeHtml(driver.driver_name)}</option>`).join("")}`;
  vehicleFilter.innerHTML = `<option value="">${t("allVehicles")}</option>${vehicles.map((vehicle) => `<option value="${vehicle.id}" ${String(vehicle.id) === String(selectedVehicle) ? "selected" : ""}>${escapeHtml(vehicle.plate_number)} - ${escapeHtml(vehicle.vehicle_name)}</option>`).join("")}`;

  const slotStarts = ["08:00", "10:00", "12:00", "14:00", "16:00"];
  const availableSlotStarts = slotStarts;
  const rows = drivers.map((driver) => {
    const defaultVehicle = vehicleMap.get(Number(driver.default_vehicle_id));
    const driverTrips = trips.filter((trip) => Number(trip.driver_id) === Number(driver.id));
    const busySlots = availableSlotStarts.filter((slot) => {
      const slotStart = tripDateTime({}, selectedDate, slot);
      const slotEnd = new Date(slotStart.getTime() + 2 * 60 * 60 * 1000);
      return driverTrips.some((trip) => tripOverlapsSlot(trip, selectedDate, slotStart, slotEnd));
    });
    const emptySlots = availableSlotStarts.filter((slot) => !busySlots.includes(slot)).map((slot) => `${slot}-${String(Number(slot.slice(0, 2)) + 2).padStart(2, "0")}:00`);
    const tone = scheduleToneForBusyCount(busySlots.length);
    const vehicleText = driverTrips.map((trip) => `${trip.plate_number || "-"} ${trip.vehicle_name || ""}`.trim()).filter(Boolean).join(", ") || (defaultVehicle ? `${defaultVehicle.plate_number} - ${defaultVehicle.vehicle_name}` : "-");
    return { driver, driverTrips, emptySlots, busySlots, tone, vehicleText };
  }).filter((row) => {
    if (selectedDriver && String(row.driver.id) !== String(selectedDriver)) return false;
    if (selectedVehicle && !row.driverTrips.some((trip) => String(trip.vehicle_id) === String(selectedVehicle)) && String(row.driver.default_vehicle_id || "") !== String(selectedVehicle)) return false;
    if (!query) return true;
    const text = [row.driver.driver_name, row.vehicleText, row.driverTrips.map((trip) => `${trip.destination} ${trip.status}`).join(" ")].join(" ").toLowerCase();
    return text.includes(query);
  });
  const defaultVehicleIds = new Set(drivers.map((driver) => Number(driver.default_vehicle_id)).filter(Boolean));
  const standaloneVehicleRows = vehicles
    .filter((vehicle) => !defaultVehicleIds.has(Number(vehicle.id)))
    .map((vehicle) => {
      const vehicleTrips = trips.filter((trip) => Number(trip.vehicle_id) === Number(vehicle.id));
      const busySlots = availableSlotStarts.filter((slot) => {
        const slotStart = tripDateTime({}, selectedDate, slot);
        const slotEnd = new Date(slotStart.getTime() + 2 * 60 * 60 * 1000);
        return vehicleTrips.some((trip) => tripOverlapsSlot(trip, selectedDate, slotStart, slotEnd));
      });
      const emptySlots = availableSlotStarts.filter((slot) => !busySlots.includes(slot)).map((slot) => `${slot}-${String(Number(slot.slice(0, 2)) + 2).padStart(2, "0")}:00`);
      const tone = vehicle.status === "MAINTENANCE" ? "full" : scheduleToneForBusyCount(busySlots.length);
      return {
        vehicle,
        vehicleTrips,
        emptySlots: vehicle.status === "MAINTENANCE" ? [] : emptySlots,
        busySlots,
        tone,
        vehicleText: `${vehicle.plate_number} - ${vehicle.vehicle_name}`,
      };
    })
    .filter((row) => {
      if (selectedDriver) return false;
      if (selectedVehicle && String(row.vehicle.id) !== String(selectedVehicle)) return false;
      if (!query) return true;
      const text = [row.vehicleText, row.vehicle.vehicle_type, row.vehicle.status, row.vehicleTrips.map((trip) => `${trip.destination} ${trip.status}`).join(" ")].join(" ").toLowerCase();
      return text.includes(query);
    });
  const displayRows = [...rows, ...standaloneVehicleRows];
  const availableDrivers = rows.filter((row) => row.tone === "available");
  const fullDrivers = rows.filter((row) => row.tone === "full");
  const hasRecommendedSlots = displayRows.some((row) => row.emptySlots.length > 0);
  const scheduleRows = displayRows.map((row) => `
    <tr>
      <td><strong>${escapeHtml(row.driver?.driver_name || t("noDefaultDriver"))}</strong></td>
      <td>${escapeHtml(row.vehicleText)}</td>
      <td>${(row.driverTrips || row.vehicleTrips || []).length ? (row.driverTrips || row.vehicleTrips || []).map((trip) => `<span class="schedule-time-chip">${escapeHtml(trip.depart_time)}-${escapeHtml(trip.return_time)}</span>`).join("") : "-"}</td>
      <td>${(row.driverTrips || row.vehicleTrips || []).length ? (row.driverTrips || row.vehicleTrips || []).map((trip) => badge(trip.status)).join(" ") : `<span class="schedule-status ${row.vehicle?.status === "MAINTENANCE" ? "full" : "available"}">${row.vehicle?.status === "MAINTENANCE" ? vehicleStatusLabel("MAINTENANCE") : t("available")}</span>`}</td>
      <td>${row.emptySlots.length ? row.emptySlots.map((slot) => `<span class="schedule-slot">${escapeHtml(slot)}</span>`).join("") : "-"}</td>
      <td><span class="schedule-status ${row.tone}">${row.tone === "full" ? t("fullBooked") : row.tone === "almost" ? t("almostFullSchedule") : t("available")}</span></td>
    </tr>
  `).join("");
  target.innerHTML = `
    <div class="schedule-overview-grid">
      <article class="schedule-overview-card available"><span>${t("availableDrivers")}</span><strong>${availableDrivers.length}</strong></article>
      <article class="schedule-overview-card full"><span>${t("fullScheduleDrivers")}</span><strong>${fullDrivers.length}</strong></article>
      <article class="schedule-overview-card"><span>${t("todaySchedule")}</span><strong>${trips.length}</strong></article>
      <article class="schedule-overview-card"><span>${t("tomorrowSchedule")}</span><strong>${tomorrowTrips.length}</strong></article>
    </div>
    <div class="table-wrap">
      ${hasRecommendedSlots ? "" : `<div class="alert warning compact-alert schedule-slot-info">${t("noRecommendedSlotInfo")}</div>`}
      <table class="driver-schedule-table">
        <thead><tr><th>${t("driver")}</th><th>${t("vehicle")}</th><th>${t("schedule")}</th><th>${t("vehicleStatus")}</th><th>${t("emptySlots")}</th><th>${t("status")}</th></tr></thead>
        <tbody>${scheduleRows || `<tr><td colspan="6">${scheduleEmpty("noSchedule")}</td></tr>`}</tbody>
      </table>
    </div>
  `;
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
    <div class="table-wrap"><h4>${t("dailySchedule")}</h4><table><tbody>${assignedTrips.length ? assignedTrips.map((item) => `<tr><td>${escapeHtml(dateRange(item))}</td><td>${escapeHtml(item.depart_time)}-${escapeHtml(item.return_time)}</td><td>${escapeHtml(item.driver_name || "-")}</td><td>${escapeHtml(item.plate_number || "-")}</td><td>${escapeHtml(item.destination)}</td></tr>`).join("") : `<tr><td colspan="5">${scheduleEmpty("noSchedule")}</td></tr>`}</tbody></table></div>
    <div class="table-wrap"><h4>${t("queueSchedule")}</h4><table><tbody>${queueTrips.length ? queueTrips.map((item) => `<tr><td>${escapeHtml(dateRange(item))}</td><td>${escapeHtml(item.depart_time)}-${escapeHtml(item.return_time)}</td><td>${escapeHtml(item.full_name || "-")}</td><td>${escapeHtml(item.destination)}</td><td>${badge(item.status)}</td></tr>`).join("") : `<tr><td colspan="5">${scheduleEmpty("noSchedule")}</td></tr>`}</tbody></table></div>
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
  const weekdayLabels = lang === "en" ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] : ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
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
      ${counts.total ? `<span class="calendar-schedule-badge">${counts.total}</span><span class="calendar-schedule-lines">${counts.assigned ? `<small class="assigned-dot">${counts.assigned} ${t("statAssigned")}</small>` : ""}${counts.queue ? `<small class="queue-dot">${counts.queue} ${t("queueSchedule")}</small>` : ""}</span>` : ""}
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
  const pagination = document.getElementById("history-pagination");
  if (!list) return;
  const items = filteredHistoryItems();
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  if (historyPage > totalPages) historyPage = totalPages;
  const pageItems = items.slice((historyPage - 1) * pageSize, historyPage * pageSize);
  list.innerHTML = pageItems.length ? pageItems.map((item) => {
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
  if (!pagination) return;
  pagination.innerHTML = items.length > pageSize ? Array.from({ length: totalPages }, (_, index) => {
    const page = index + 1;
    return `<button class="button small ${page === historyPage ? "primary" : "secondary"}" type="button" data-history-page="${page}">${page}</button>`;
  }).join("") : "";
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
    const availableDrivers = item.availability?.drivers || appData.drivers || [];
    const availableVehicles = item.availability?.vehicles || [];
    const recommendedVehicleId = item.vehicle_id || item.availability?.recommended_vehicle_id || item.availability?.default_vehicle_id || availableVehicles[0]?.id || "";
    const selectedVehicleId = recommendedVehicleId || "";
    const matchedDriver = availableDrivers.find((driver) => Number(driver.default_vehicle_id) === Number(selectedVehicleId));
    const selectedDriverId = item.driver_id || item.availability?.recommended_driver_id || matchedDriver?.id || availableDrivers[0]?.id || "";
    const selectedDriver = availableDrivers.find((driver) => Number(driver.id) === Number(selectedDriverId));
    const defaultVehicleId = selectedDriver?.default_vehicle_id || item.availability?.default_vehicle_id || "";
    const defaultVehicleAvailable = !!defaultVehicleId && availableVehicles.some((vehicle) => Number(vehicle.id) === Number(defaultVehicleId));
    const sortedVehicles = [
      ...availableVehicles.filter((vehicle) => Number(vehicle.id) === Number(selectedVehicleId)),
      ...availableVehicles.filter((vehicle) => Number(vehicle.id) !== Number(selectedVehicleId)),
    ];
    const driverOptions = availableDrivers.map((driver) => `<option value="${driver.id}" data-default-vehicle="${escapeHtml(driver.default_vehicle_id || "")}" ${Number(driver.id) === Number(selectedDriverId) ? "selected" : ""}>${escapeHtml(driver.driver_name)} - ${escapeHtml(driver.status)}</option>`).join("");
    const vehicleOptions = sortedVehicles.map((vehicle) => {
      const defaultDriver = availableDrivers.find((driver) => Number(driver.default_vehicle_id) === Number(vehicle.id));
      return `<option value="${vehicle.id}" data-default-driver="${escapeHtml(defaultDriver?.id || "")}" ${Number(vehicle.id) === Number(selectedVehicleId) ? "selected" : ""}>${escapeHtml(vehicle.plate_number)} - ${escapeHtml(vehicle.vehicle_name)} - ${escapeHtml(vehicle.vehicle_type || "-")}</option>`;
    }).join("");
    const defaultVehicleWarning = selectedDriver
      ? assignmentWarningHtml(defaultVehicleId, defaultVehicleAvailable, selectedVehicleId)
      : "";
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
          ${canEditAssignment ? `<label>${t("driver")}<select name="driver_id" data-assignment-driver>${driverOptions}</select></label>
          <label>${t("vehicle")}<select name="vehicle_id" data-assignment-vehicle>${vehicleOptions}</select></label>
          <div class="span-2" data-default-vehicle-message>${defaultVehicleWarning}</div>` : ""}
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
        <label>${t("driver")}<select name="driver_id" data-assignment-driver required>${driverOptions}</select></label>
        <label>${t("vehicle")}<select name="vehicle_id" data-assignment-vehicle required>${vehicleOptions}</select></label>
        <label>${t("gaNote")}<input name="ga_note"></label>
        <button class="button primary" type="submit">${t("assign")}</button>
        <div class="span-2" data-default-vehicle-message>${defaultVehicleWarning}</div>
      </form>
      ${vehicleOptions ? "" : `<div class="alert warning">${t("noAvailableByRule")}</div>`}` : "";
    return tripCard(item, assignActions + editForm + rejectForm);
  }).join("") : empty(t("emptyGa"));
}

function vehicleById(vehicleId) {
  return (appData.vehicles || []).find((item) => Number(item.id) === Number(vehicleId));
}

function defaultVehicleWarningMessage(defaultVehicleId, isAvailable) {
  const vehicle = (appData.vehicles || []).find((item) => Number(item.id) === Number(defaultVehicleId));
  if (!defaultVehicleId) return "";
  if (vehicle?.status === "ASSIGNED" && isAvailable) return "";
  if (isAvailable) return "";
  return t("defaultVehicleUnavailable");
}

function assignedVehicleWarningMessage(vehicleId) {
  return vehicleById(vehicleId)?.status === "ASSIGNED" ? t("assignedVehicleRecommendationWarning") : "";
}

function assignmentWarningHtml(defaultVehicleId, isDefaultAvailable, selectedVehicleId) {
  const messages = [];
  if (!defaultVehicleId) messages.push(t("defaultVehicleMissing"));
  else {
    const defaultMessage = defaultVehicleWarningMessage(defaultVehicleId, isDefaultAvailable);
    if (defaultMessage) messages.push(defaultMessage);
  }
  const assignedMessage = assignedVehicleWarningMessage(selectedVehicleId);
  if (assignedMessage && !messages.includes(assignedMessage)) messages.push(assignedMessage);
  return messages.map((message) => `<div class="alert warning default-vehicle-warning">${escapeHtml(message)}</div>`).join("");
}

function updateDefaultVehicleSelection(driverSelect) {
  const form = driverSelect.closest("form");
  if (!form) return;
  const vehicleSelect = form.querySelector("[data-assignment-vehicle]");
  const message = form.querySelector("[data-default-vehicle-message]");
  const selectedOption = driverSelect.selectedOptions[0];
  const defaultVehicleId = selectedOption?.dataset.defaultVehicle || "";
  if (!vehicleSelect) return;
  if (!defaultVehicleId) {
    if (message) message.innerHTML = `<div class="alert warning default-vehicle-warning">${t("defaultVehicleMissing")}</div>`;
    return;
  }
  const option = Array.from(vehicleSelect.options).find((item) => item.value === defaultVehicleId);
  if (option) {
    vehicleSelect.value = defaultVehicleId;
    if (message) {
      message.innerHTML = assignmentWarningHtml(defaultVehicleId, true, defaultVehicleId);
    }
  } else if (message) {
    message.innerHTML = assignmentWarningHtml(defaultVehicleId, false, vehicleSelect.value);
  }
}

function updateDefaultDriverSelection(vehicleSelect) {
  const form = vehicleSelect.closest("form");
  if (!form) return;
  const driverSelect = form.querySelector("[data-assignment-driver]");
  const message = form.querySelector("[data-default-vehicle-message]");
  const selectedOption = vehicleSelect.selectedOptions[0];
  const defaultDriverId = selectedOption?.dataset.defaultDriver || "";
  if (!driverSelect || !defaultDriverId) return;
  const option = Array.from(driverSelect.options).find((item) => item.value === defaultDriverId);
  if (option) {
    driverSelect.value = defaultDriverId;
    if (message) {
      const defaultVehicleId = option.dataset.defaultVehicle || "";
      const isDefaultAvailable = !!defaultVehicleId && Array.from(vehicleSelect.options).some((item) => item.value === defaultVehicleId);
      message.innerHTML = assignmentWarningHtml(defaultVehicleId, isDefaultAvailable, vehicleSelect.value);
    }
  }
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
    if (status === "on_trip") actions = `<form class="inline-form driver-finish" method="post" action="/requests/${item.id}/driver"><label>${t("kmEnd")}<input name="km_end" type="number" min="0" required></label><label>${t("fuelLiters")}<input name="fuel_liters" type="number" min="0" step="0.01"></label><label>${t("fuelType")}<input name="fuel_type" placeholder="Pertalite / Pertamax / Solar"></label><label>${t("fuel")}<input name="cost_fuel" data-money inputmode="numeric"></label><label>${t("toll")}<input name="cost_toll" data-money inputmode="numeric"></label><label>${t("parking")}<input name="cost_parking" data-money inputmode="numeric"></label><label class="span-2">${t("vehicleConditionNotes")}<textarea name="vehicle_condition_notes"></textarea></label><button class="button primary" name="action" value="finish" type="submit">${t("finishTrip")}</button></form>`;
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
    <button class="notification-item ${alert.expired ? "expired" : ""}" type="button" data-notification-tab="${escapeHtml(alert.tab || "dashboard")}">
      <div>
        <strong>${escapeHtml(alert.title || alert.document || t("notificationFallback"))}${alert.plate_number ? " - " + escapeHtml(alert.plate_number) : ""}</strong>
        <span>${escapeHtml(alert.message || alert.vehicle_name || "-")}</span>
      </div>
      <div class="notification-date">
        <strong>${alert.expiry_date && String(alert.expiry_date).includes("-") ? formatDate(alert.expiry_date) : escapeHtml(alert.expiry_date || "")}</strong>
        <span>${alert.days_left !== undefined ? escapeHtml(expiryText(alert)) : escapeHtml(alert.tab || "")}</span>
      </div>
    </button>
  `).join("") : `<div class="notification-empty">${t("notificationsEmpty")}</div>`;
}

function p2hStatusBadge(status) {
  const cls = status === "Normal" ? "success" : status === "Perlu Follow Up GA" ? "danger" : "pending";
  return `<span class="badge ${cls}">${escapeHtml(p2hStatusLabel(status))}</span>`;
}

function p2hFollowBadge(status) {
  const value = status || "-";
  const cls = value === "Selesai" ? "success" : value === "Baru" ? "danger" : value === "Diproses" ? "assigned" : "pending";
  return `<span class="badge ${cls}">${escapeHtml(p2hFollowLabel(value))}</span>`;
}

function renderP2hChecklist() {
  const target = document.getElementById("p2h-checklist-content");
  if (!target) return;
  const alertsTarget = document.getElementById("p2h-driver-alerts");
  const alerts = appData.p2h_alerts || [];
  if (alertsTarget) alertsTarget.innerHTML = alerts.length ? `<div class="departure-alert driver-alert">${t("p2hMissingDriverAlert")}</div>` : "";
  const vehicles = appData.p2h_vehicle_options || [];
  const reports = appData.p2h_my_reports || [];
  if (!vehicles.length) {
    target.innerHTML = empty(t("noAvailableByRule"));
    return;
  }
  const vehicleOptions = vehicles.map((vehicle, index) => `<option value="${vehicle.id}" ${index === 0 ? "selected" : ""}>${escapeHtml(vehicle.plate_number)} - ${escapeHtml(vehicle.vehicle_name)} - ${escapeHtml(vehicle.vehicle_type || "-")}</option>`).join("");
  const checklistHtml = Object.entries(appData.p2h_checklist || {}).map(([category, items], index) => `
    <details class="p2h-category" ${index < 2 ? "open" : ""}>
        <summary>${escapeHtml(p2hText(category))}</summary>
      <div class="p2h-check-grid">
        ${items.map((item) => {
          const name = `p2h__${category}__${item}`;
          return `<div class="p2h-check-item">
            <strong>${escapeHtml(p2hText(item))}</strong>
            <select name="${escapeHtml(name)}"><option value="OK">${t("p2hOk")}</option><option value="Tidak OK">${t("p2hNotOk")}</option><option value="Tidak Berlaku">${t("p2hNotApplicable")}</option></select>
            <input name="${escapeHtml(name)}__note" placeholder="${t("leaderNote")}">
          </div>`;
        }).join("")}
      </div>
    </details>`).join("");
  const historyRows = reports.slice(0, 10).map((report) => `<tr><td>${formatDate(report.report_date)}</td><td>${escapeHtml(report.submit_time || "-")}</td><td>${escapeHtml(report.plate_number || "-")}</td><td>${escapeHtml(report.odometer_start || 0)}</td><td>${p2hStatusBadge(report.status_p2h)}</td><td>${escapeHtml(report.not_ok_count || 0)}</td></tr>`).join("");
  target.innerHTML = `
    <form class="panel p2h-form" method="post" action="/p2h" enctype="multipart/form-data" data-ajax-form data-confirm-key="confirmSubmitP2h">
      <div class="form-grid compact">
        <label><span>${t("p2hDate")}</span><input name="report_date" type="date" value="${todayIso()}" max="${todayIso()}" required></label>
        <label><span>${t("vehicle")}</span><select name="vehicle_id" required>${vehicleOptions}</select></label>
        <label><span>${t("p2hKmStart")}</span><input name="odometer_start" type="number" min="0" required></label>
        <label><span>${t("p2hFuelStatus")}</span><input name="fuel_status" placeholder="${t("fuelStatusPlaceholder")}"></label>
        <label class="span-2"><span>${t("p2hGeneralNote")}</span><textarea name="general_note" rows="2"></textarea></label>
        <label><span>${t("p2hDamageNote")}</span><textarea name="damage_note" rows="2"></textarea></label>
        <label><span>${t("p2hRecommendation")}</span><textarea name="recommendation" rows="2"></textarea></label>
        <label class="span-2"><span>${t("p2hUpload")}</span><input name="damage_photo" type="file" accept=".jpg,.jpeg,.png,.webp,.pdf"></label>
      </div>
      <div class="p2h-checklist">${checklistHtml}</div>
      <button class="button primary" type="submit">${t("submitP2h")}</button>
    </form>
    <div class="panel"><h3>${t("p2hHistoryMine")}</h3><div class="table-wrap"><table class="compact-table"><thead><tr><th>${t("date")}</th><th>${t("p2hTime")}</th><th>${t("vehicle")}</th><th>${t("p2hKmStart")}</th><th>${t("status")}</th><th>${t("findings")}</th></tr></thead><tbody>${historyRows || `<tr><td colspan="6">${t("notificationsEmpty")}</td></tr>`}</tbody></table></div></div>`;
}

function p2hFilterValues() {
  const startMonth = document.getElementById("p2h-start-month-filter")?.value ?? "";
  const startYear = document.getElementById("p2h-start-year-filter")?.value || "";
  const endMonth = document.getElementById("p2h-end-month-filter")?.value ?? "";
  const endYear = document.getElementById("p2h-end-year-filter")?.value || "";
  if (startYear && startMonth !== "") p2hStartMonth = composeMonthValue(startYear, startMonth);
  if (endYear && endMonth !== "") p2hEndMonth = composeMonthValue(endYear, endMonth);
  if (p2hStartMonth && p2hEndMonth) {
    const range = clampMonthRange(p2hStartMonth, p2hEndMonth, 12);
    p2hStartMonth = range.start;
    p2hEndMonth = range.end;
    populateIntervalControls("p2h", p2hStartMonth, p2hEndMonth);
  }
  const form = document.querySelector(".p2h-workday-form");
  if (form) {
    form.elements.start_month.value = p2hStartMonth;
    form.elements.end_month.value = p2hEndMonth;
    const manual = p2hWorkdayOverride(p2hStartMonth, p2hEndMonth);
    form.elements.workdays.value = manual ?? "";
  }
  return { start: p2hStartMonth, end: p2hEndMonth };
}

function p2hWorkdayOverride(start, end) {
  const item = (appData.p2h_workday_overrides || []).find((override) => override.start_month === start && override.end_month === end);
  return item ? Number(item.workdays || 0) : null;
}

function p2hHolidaySet(start, end) {
  const holidaySet = new Set();
  (appData.p2h_holidays || []).forEach((holiday) => {
    const value = holiday.holiday_date || holiday.date || "";
    if (value && value >= start && value <= end) holidaySet.add(value);
  });
  return holidaySet;
}

function p2hFilteredReports() {
  const { start, end } = p2hFilterValues();
  const driverId = document.getElementById("p2h-driver-filter")?.value || "";
  const vehicleId = document.getElementById("p2h-vehicle-filter")?.value || "";
  const status = document.getElementById("p2h-status-filter")?.value || "";
  const follow = document.getElementById("p2h-follow-filter")?.value || "";
  const search = (document.getElementById("p2h-search-filter")?.value || "").toLowerCase();
  return (appData.p2h_reports || []).filter((report) => {
    const month = (report.report_date || "").slice(0, 7);
    const haystack = `${report.driver_name} ${report.plate_number} ${report.vehicle_name} ${report.damage_note}`.toLowerCase();
    return (!start || month >= start) && (!end || month <= end) && (!driverId || String(report.driver_id) === driverId) && (!vehicleId || String(report.vehicle_id) === vehicleId) && (!status || report.status_p2h === status) && (!follow || (report.follow_up_status || "") === follow) && (!search || haystack.includes(search));
  });
}

function renderP2hReport() {
  const target = document.getElementById("p2h-report-content");
  if (!target) return;
  const alertsTarget = document.getElementById("p2h-ga-alerts");
  const alerts = appData.p2h_alerts || [];
  if (alertsTarget) alertsTarget.innerHTML = alerts.length ? `<div class="departure-alert ga-alert"><strong>${t("p2hMissingGaAlert")}</strong>${alerts.map((item) => `<span>${escapeHtml(item.driver_name)} - ${escapeHtml(item.plate_number)} - ${escapeHtml(p2hStatusLabel(item.status))} (${item.deadline})</span>`).join("")}</div>` : "";
  const initRange = initMonthInterval(p2hStartMonth, p2hEndMonth, { defaultCurrent: true, maxMonths: 12 });
  p2hStartMonth = initRange.start;
  p2hEndMonth = initRange.end;
  const drivers = appData.drivers || [];
  const vehicles = appData.vehicles || [];
  const manualWorkdays = p2hWorkdayOverride(p2hStartMonth, p2hEndMonth);
  target.innerHTML = `
    <div class="panel p2h-analytics-panel">
      <div class="p2h-panel-head"><h3>${t("p2hPerformanceTitle")}</h3></div>
      <div class="p2h-filter-bar">
        <span class="filter-label">${t("monitoringInterval")}</span>
        <span class="select-wrap month-select"><select id="p2h-start-month-filter"></select></span>
        <span class="select-wrap year-select"><select id="p2h-start-year-filter"></select></span>
        <span>${t("until")}</span>
        <span class="select-wrap month-select"><select id="p2h-end-month-filter"></select></span>
        <span class="select-wrap year-select"><select id="p2h-end-year-filter"></select></span>
        <select id="p2h-driver-filter"><option value="">${t("allDrivers")}</option>${drivers.map((driver) => `<option value="${driver.id}">${escapeHtml(driver.driver_name)}</option>`).join("")}</select>
        <select id="p2h-vehicle-filter"><option value="">${t("allVehicles")}</option>${vehicles.map((vehicle) => `<option value="${vehicle.id}">${escapeHtml(vehicle.plate_number)} - ${escapeHtml(vehicle.vehicle_name)}</option>`).join("")}</select>
        <select id="p2h-status-filter"><option value="">${t("p2hStatus")}</option><option value="Normal">${p2hStatusLabel("Normal")}</option><option value="Perlu Follow Up GA">${p2hStatusLabel("Perlu Follow Up GA")}</option></select>
        <select id="p2h-follow-filter"><option value="">${t("followUpStatus")}</option><option value="Baru">${t("p2hNew")}</option><option value="Diproses">${t("p2hInProgress")}</option><option value="Selesai">${t("p2hDone")}</option><option value="Ditolak / Tidak Valid">${t("p2hInvalid")}</option></select>
        <input id="p2h-search-filter" type="search" placeholder="${t("quickSearch")}">
      </div>
      <form class="p2h-workday-form" method="post" action="/p2h/workdays" data-ajax-form>
        <input type="hidden" name="start_month" value="${escapeHtml(p2hStartMonth)}">
        <input type="hidden" name="end_month" value="${escapeHtml(p2hEndMonth)}">
        <label>${t("manualP2hWorkdays")}<input name="workdays" type="number" min="0" max="366" value="${manualWorkdays ?? ""}" placeholder="${t("requiredDays")}"></label>
        <button class="button secondary small" type="submit">${t("saveWorkdays")}</button>
        <small>${t("manualWorkdayHint")} ${t("p2hHolidaysExcluded")}</small>
      </form>
      <div id="p2h-summary" class="p2h-summary-grid"></div>
      <div class="p2h-chart-grid">
        <div class="p2h-chart-card"><h4>${t("p2hTrendTitle")}</h4><canvas id="p2h-trend-chart"></canvas><p class="p2h-chart-empty">${t("p2hNoChartData")}</p></div>
        <div class="p2h-chart-card"><h4>${t("p2hNormalVsFollowUp")}</h4><canvas id="p2h-status-chart"></canvas><p class="p2h-chart-empty">${t("p2hNoStatusData")}</p></div>
        <div class="p2h-chart-card wide"><h4>${t("driverConsistencyPerformance")}</h4><canvas id="p2h-consistency-chart"></canvas><p class="p2h-chart-empty">${t("p2hNoConsistencyData")}</p></div>
      </div>
    </div>
    <div class="panel"><h3>${t("driverConsistencyPerformance")}</h3><div id="p2h-driver-performance" class="table-wrap"></div></div>
    <div class="panel"><h3>${t("p2hReportsTable")}</h3><div id="p2h-report-table" class="table-wrap"></div></div>`;
  populateIntervalControls("p2h", p2hStartMonth, p2hEndMonth);
  renderP2hReportData();
}

function renderP2hReportData() {
  const reports = p2hFilteredReports();
  const performance = buildP2hPerformanceFromReports(reports);
  const summary = performance.summary || {};
  const exportLink = document.getElementById("p2h-export-link");
  if (exportLink) {
    const params = new URLSearchParams({
      start: p2hStartMonth,
      end: p2hEndMonth,
      driver_id: document.getElementById("p2h-driver-filter")?.value || "",
      vehicle_id: document.getElementById("p2h-vehicle-filter")?.value || "",
      status_p2h: document.getElementById("p2h-status-filter")?.value || "",
      follow_up_status: document.getElementById("p2h-follow-filter")?.value || "",
    });
    exportLink.href = `/export/p2h.xlsx?${params.toString()}`;
  }
  const summaryTarget = document.getElementById("p2h-summary");
  if (summaryTarget) {
    const cards = [[t("totalRequiredDays"), summary.required_days || 0], [t("totalP2hReports"), reports.length], [t("avgDriverConsistency"), `${summary.average_consistency || 0}%`], [t("missingDrivers"), summary.missing_drivers_today || 0], [t("totalNotOk"), reports.reduce((sum, item) => sum + Number(item.not_ok_count || 0), 0)], [t("followUpPending"), reports.filter((item) => item.status_p2h === "Perlu Follow Up GA" && item.follow_up_status !== "Selesai").length]];
    summaryTarget.innerHTML = cards.map(([label, value]) => `<article><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></article>`).join("");
  }
  try {
    renderP2hCharts(performance, reports);
  } catch (error) {
    console.error("P2H chart render failed", error);
    renderP2hChartFallback(performance, reports);
  }
  const driverTarget = document.getElementById("p2h-driver-performance");
  if (driverTarget) {
    const rows = (performance.driver_performance || []).map((item) => `<tr><td>${escapeHtml(item.driver_name)}</td><td>${escapeHtml(item.default_vehicle)}</td><td>${item.required_days}</td><td>${item.submitted_days}</td><td>${item.missing_days}</td><td>${item.consistency}%</td><td>${item.not_ok_count}</td><td>${p2hFollowBadge(item.status)}</td></tr>`).join("");
    driverTarget.innerHTML = `<table class="compact-table"><thead><tr><th>${t("driver")}</th><th>${t("defaultVehicle")}</th><th>${t("requiredDays")}</th><th>${t("submittedDays")}</th><th>${t("missingDays")}</th><th>${t("consistency")}</th><th>${t("findings")}</th><th>${t("status")}</th></tr></thead><tbody>${rows}</tbody></table>`;
  }
  const tableTarget = document.getElementById("p2h-report-table");
  if (tableTarget) {
    const rows = reports.slice(0, 100).map((item) => `<tr><td>${formatDate(item.report_date)}<br><small>${escapeHtml(item.submit_time || "-")}</small></td><td>${escapeHtml(item.driver_name)}</td><td>${escapeHtml(item.plate_number)}<br><small>${escapeHtml(item.vehicle_name)} - ${escapeHtml(item.vehicle_type || "-")}</small></td><td>${escapeHtml(item.odometer_start || 0)}</td><td>${p2hStatusBadge(item.status_p2h)}<br><small>${escapeHtml(item.not_ok_count || 0)} ${t("findings")}</small></td><td>${escapeHtml(item.damage_note || "-")}</td><td><form class="p2h-follow-form" method="post" action="/p2h/${item.id}/follow-up" data-ajax-form><select name="follow_up_status"><option value="Baru" ${item.follow_up_status === "Baru" ? "selected" : ""}>${t("p2hNew")}</option><option value="Diproses" ${item.follow_up_status === "Diproses" ? "selected" : ""}>${t("p2hInProgress")}</option><option value="Selesai" ${item.follow_up_status === "Selesai" ? "selected" : ""}>${t("p2hDone")}</option><option value="Ditolak / Tidak Valid" ${item.follow_up_status === "Ditolak / Tidak Valid" ? "selected" : ""}>${t("p2hInvalid")}</option></select><input name="follow_up_note" value="${escapeHtml(item.follow_up_note || "")}" placeholder="${t("followUpNote")}"><input name="follow_up_action" value="${escapeHtml(item.follow_up_action || "")}" placeholder="${t("followUpAction")}"><input name="follow_up_date" type="date" value="${escapeHtml(item.follow_up_date || todayIso())}"><button class="button secondary small" type="submit">${t("save")}</button></form>${item.attachment_path ? `<a href="/p2h/${item.id}/attachment" target="_blank" rel="noopener">${t("file")}</a>` : ""}</td></tr>`).join("");
    tableTarget.innerHTML = `<table class="compact-table p2h-report-table"><thead><tr><th>${t("date")}</th><th>${t("driver")}</th><th>${t("vehicle")}</th><th>${t("p2hKmStart")}</th><th>${t("status")}</th><th>${t("p2hDamageNote")}</th><th>${t("followUpStatus")}</th></tr></thead><tbody>${rows || `<tr><td colspan="7">${t("notificationsEmpty")}</td></tr>`}</tbody></table>`;
  }
}

function buildP2hPerformanceFromReports(reports) {
  const start = p2hStartMonth || new Date().toISOString().slice(0, 7);
  const end = p2hEndMonth || start;
  const startDate = new Date(`${start}-01T00:00:00`);
  const endDate = new Date(`${end}-01T00:00:00`);
  endDate.setMonth(endDate.getMonth() + 1);
  endDate.setDate(0);
  const today = new Date(todayIso() + "T00:00:00");
  const cappedEnd = endDate > today ? today : endDate;
  const manualWorkdays = p2hWorkdayOverride(start, end);
  let requiredDays = manualWorkdays;
  if (requiredDays === null) {
    requiredDays = 0;
    const holidays = p2hHolidaySet(dateIsoLocal(startDate), dateIsoLocal(cappedEnd));
    for (let cursor = new Date(startDate); cursor <= cappedEnd; cursor.setDate(cursor.getDate() + 1)) {
      const day = dateIsoLocal(cursor);
      if (cursor.getDay() !== 0 && cursor.getDay() !== 6 && !holidays.has(day)) requiredDays += 1;
    }
  }
  const activeDrivers = appData.drivers || [];
  const reportDatesByDriver = new Map();
  const notOkByDriver = new Map();
  reports.forEach((report) => {
    if (!reportDatesByDriver.has(report.driver_id)) reportDatesByDriver.set(report.driver_id, new Set());
    reportDatesByDriver.get(report.driver_id).add(report.report_date);
    notOkByDriver.set(report.driver_id, (notOkByDriver.get(report.driver_id) || 0) + Number(report.not_ok_count || 0));
  });
  const consistencyLabel = (value) => {
    if (lang === "en") return value >= 95 ? "Very Consistent" : value >= 85 ? "Consistent" : value >= 70 ? "Needs Monitoring" : "Not Consistent";
    return value >= 95 ? t("p2hVeryConsistent") : value >= 85 ? t("p2hConsistent") : value >= 70 ? t("p2hNeedsMonitoring") : t("p2hNotConsistent");
  };
  const driverPerformance = activeDrivers.map((driver) => {
    const submitted = reportDatesByDriver.get(driver.id)?.size || 0;
    const consistency = requiredDays ? Math.round((submitted / requiredDays) * 1000) / 10 : 0;
    const defaultVehicle = (appData.vehicles || []).find((vehicle) => Number(vehicle.id) === Number(driver.default_vehicle_id));
    return {
      driver_name: driver.driver_name,
      default_vehicle: defaultVehicle ? `${defaultVehicle.plate_number} - ${defaultVehicle.vehicle_name}` : "-",
      required_days: requiredDays,
      submitted_days: submitted,
      missing_days: Math.max(requiredDays - submitted, 0),
      consistency,
      not_ok_count: notOkByDriver.get(driver.id) || 0,
      status: consistencyLabel(consistency),
    };
  }).sort((a, b) => b.consistency - a.consistency);
  const trend = [];
  for (let month = start; month <= end; month = shiftMonth(month, 1)) {
    const monthReports = reports.filter((report) => (report.report_date || "").slice(0, 7) === month);
    trend.push({
      month,
      total: monthReports.length,
      normal: monthReports.filter((report) => report.status_p2h === "Normal").length,
      follow_up: monthReports.filter((report) => report.status_p2h === "Perlu Follow Up GA").length,
      not_ok: monthReports.reduce((sum, report) => sum + Number(report.not_ok_count || 0), 0),
    });
    if (month === end) break;
  }
  return {
    summary: {
      required_days: requiredDays,
      total_reports: reports.length,
      average_consistency: driverPerformance.length ? Math.round(driverPerformance.reduce((sum, item) => sum + item.consistency, 0) / driverPerformance.length * 10) / 10 : 0,
      missing_drivers_today: appData.p2h_alerts?.length || 0,
    },
    trend,
    driver_performance: driverPerformance,
  };
}

function renderP2hCharts(performance, reports) {
  if (p2hTrendChartInstance) p2hTrendChartInstance.destroy();
  if (p2hStatusChartInstance) p2hStatusChartInstance.destroy();
  if (p2hConsistencyChartInstance) p2hConsistencyChartInstance.destroy();
  Array.from(document.querySelectorAll("#p2h-report .p2h-chart-empty")).forEach((item) => {
    item.classList.toggle("hidden", Boolean(window.Chart));
  });
  const trend = performance.trend || [];
  if (!window.Chart) {
    renderP2hChartFallback(performance, reports);
    return;
  }
  const trendCtx = document.getElementById("p2h-trend-chart");
  if (trendCtx) p2hTrendChartInstance = new Chart(trendCtx, { type: "bar", data: { labels: trend.map((item) => monthLabel(item.month)), datasets: [{ label: "P2H", data: trend.map((item) => item.total), backgroundColor: "rgba(37,99,235,.85)", borderRadius: 8, maxBarThickness: 34 }, { label: t("p2hNotOk"), data: trend.map((item) => item.not_ok), backgroundColor: "rgba(239,68,68,.85)", borderRadius: 8, maxBarThickness: 34 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } }, scales: { y: { beginAtZero: true, grid: { color: "#e5e7eb" } } } } });
  const statusCtx = document.getElementById("p2h-status-chart");
  if (statusCtx) p2hStatusChartInstance = new Chart(statusCtx, { type: "doughnut", data: { labels: [p2hStatusLabel("Normal"), p2hStatusLabel("Perlu Follow Up GA")], datasets: [{ data: [reports.filter((item) => item.status_p2h === "Normal").length, reports.filter((item) => item.status_p2h === "Perlu Follow Up GA").length], backgroundColor: ["rgba(16,185,129,.85)", "rgba(239,68,68,.85)"] }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } } });
  const consistencyCtx = document.getElementById("p2h-consistency-chart");
  if (consistencyCtx) {
    const drivers = (performance.driver_performance || []).slice(0, 10);
    p2hConsistencyChartInstance = new Chart(consistencyCtx, { type: "bar", data: { labels: drivers.map((item) => item.driver_name), datasets: [{ label: `% ${t("consistency")}`, data: drivers.map((item) => item.consistency), backgroundColor: "rgba(16,185,129,.85)", borderRadius: 8, maxBarThickness: 28 }] }, options: { indexAxis: "y", responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, max: 100 } } } });
  }
}

function renderP2hChartFallback(performance, reports) {
  const trend = performance.trend || [];
  const cards = Array.from(document.querySelectorAll("#p2h-report .p2h-chart-card"));
  const trendCard = document.getElementById("p2h-trend-chart")?.closest(".p2h-chart-card") || cards[0];
  const statusCard = document.getElementById("p2h-status-chart")?.closest(".p2h-chart-card") || cards[1];
  const consistencyCard = document.getElementById("p2h-consistency-chart")?.closest(".p2h-chart-card") || cards[2];
  if (trendCard) {
    const max = Math.max(1, ...trend.map((item) => item.total || 0));
    trendCard.innerHTML = `<h4>${t("p2hTrendTitle")}</h4><div class="p2h-fallback-bars">${trend.map((item) => `<div><span>${monthLabel(item.month)}</span><strong style="height:${Math.max(6, (item.total || 0) / max * 120)}px"></strong><em>${item.total || 0}</em></div>`).join("")}</div>${reports.length ? "" : `<p class="muted-center">${t("p2hNoReportPeriod")}</p>`}`;
  }
  if (statusCard) {
    const normal = reports.filter((item) => item.status_p2h === "Normal").length;
    const follow = reports.filter((item) => item.status_p2h === "Perlu Follow Up GA").length;
    statusCard.innerHTML = `<h4>${t("p2hNormalVsFollowUp")}</h4><div class="p2h-status-fallback"><span class="ok">${p2hStatusLabel("Normal")} <strong>${normal}</strong></span><span class="bad">${p2hStatusLabel("Perlu Follow Up GA")} <strong>${follow}</strong></span></div>${reports.length ? "" : `<p class="muted-center">${t("p2hNoReport")}</p>`}`;
  }
  if (consistencyCard) {
    const drivers = (performance.driver_performance || []).slice(0, 10);
    consistencyCard.innerHTML = `<h4>${t("driverConsistencyPerformance")}</h4><div class="p2h-consistency-fallback">${drivers.map((item) => `<div><span>${escapeHtml(item.driver_name)}</span><strong><i style="width:${Math.min(100, item.consistency || 0)}%"></i></strong><em>${item.consistency || 0}%</em></div>`).join("")}</div>`;
  }
}

function renderDataManagement() {
  const target = document.getElementById("data-management-content");
  if (!target) return;
  const data = appData.data_management || {};
  const db = data.database || {};
  const retention = data.retention || {};
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const tableRows = (items) => (items || []).map((item) => `
    <tr>
      <td><strong>${escapeHtml(item.label || item.table)}</strong><small>${escapeHtml(item.table || "")}</small></td>
      <td>${item.exists ? moneyFormatter.format(item.count || 0) : "-"}</td>
      <td>${moneyFormatter.format(item.archived_count || 0)}</td>
      <td>${item.protected ? `<span class="status-pill safe">${t("protectedData")}</span>` : `<span class="status-pill muted">Archive</span>`}</td>
    </tr>`).join("");
  const summaries = data.summaries || [];
  const audit = data.audit || [];
  target.innerHTML = `
    <div class="data-management-grid">
      <article class="panel data-management-card"><span>${t("databaseSize")}</span><strong>${escapeHtml(db.size_label || "-")}</strong><small>${moneyFormatter.format(db.size_bytes || 0)} bytes</small></article>
      <article class="panel data-management-card"><span>${t("retentionRules")}</span><strong>${retention.archive_after_days || 365} hari</strong><small>Log ${retention.error_logs_days || 30} hari / Notifikasi ${retention.notifications_days || 60} hari</small></article>
    </div>
    <div class="panel">
      <div class="data-actions-grid">
        <form method="post" action="/data-management/archive" data-ajax-form data-confirm-key="confirmArchiveData">
          <input type="hidden" name="confirm" value="yes">
          <label><span>${t("archiveCutoffDate")}</span><input type="date" name="cutoff_date" value="${dateIsoLocal(oneYearAgo)}"></label>
          <button class="button primary" type="submit">${t("archiveOldData")}</button>
        </form>
        <form method="post" action="/data-management/delete-testing" data-ajax-form data-confirm-key="confirmDeleteTestingData">
          <input type="hidden" name="confirm" value="yes">
          <label><span>${t("testingCutoffDate")}</span><input type="date" name="before_date" value="${todayIso()}"></label>
          <button class="button danger" type="submit">${t("deleteTestingData")}</button>
        </form>
        <form method="post" action="/data-management/delete-old-logs" data-ajax-form data-confirm-key="confirmDeleteOldLogs">
          <input type="hidden" name="confirm" value="yes">
          <label><span>${t("logCutoffDate")}</span><input type="date" name="cutoff_date" value="${dateIsoLocal(thirtyDaysAgo)}"></label>
          <button class="button secondary" type="submit">${t("deleteOldLogs")}</button>
        </form>
      </div>
    </div>
    <div class="panel"><h3>${t("masterData")}</h3><div class="table-wrap"><table class="compact-table"><thead><tr><th>Data</th><th>${t("count")}</th><th>${t("archivedData")}</th><th>Status</th></tr></thead><tbody>${tableRows(data.master)}</tbody></table></div></div>
    <div class="panel"><h3>${t("transactionData")}</h3><div class="table-wrap"><table class="compact-table"><thead><tr><th>Data</th><th>${t("count")}</th><th>${t("archivedData")}</th><th>Status</th></tr></thead><tbody>${tableRows(data.transaction)}</tbody></table></div></div>
    <div class="panel"><h3>${t("temporaryData")}</h3><div class="table-wrap"><table class="compact-table"><thead><tr><th>Data</th><th>${t("count")}</th><th>${t("archivedData")}</th><th>Status</th></tr></thead><tbody>${tableRows(data.temporary)}</tbody></table></div></div>
    <div class="panel"><h3>${t("archiveSummary")}</h3><div class="table-wrap"><table class="compact-table"><thead><tr><th>Module</th><th>Bulan</th><th>${t("count")}</th><th>Archived</th></tr></thead><tbody>${summaries.map((item) => `<tr><td>${escapeHtml(item.module)}</td><td>${formatMonthYear(item.summary_month)}</td><td>${moneyFormatter.format(item.total_count || 0)}</td><td>${formatDateTime(item.archived_at)}</td></tr>`).join("") || `<tr><td colspan="4">${t("noArchiveSummary")}</td></tr>`}</tbody></table></div></div>
    <div class="panel"><h3>${t("dataManagementAudit")}</h3><div class="table-wrap"><table class="compact-table"><thead><tr><th>Waktu</th><th>User</th><th>Aksi</th><th>Module</th><th>${t("count")}</th></tr></thead><tbody>${audit.map((item) => `<tr><td>${formatDateTime(item.created_at)}</td><td>${escapeHtml(item.actor_nik)}</td><td>${escapeHtml(item.action)}</td><td>${escapeHtml(item.target_module || "-")}</td><td>${moneyFormatter.format(item.affected_rows || 0)}</td></tr>`).join("") || `<tr><td colspan="5">${t("noAuditLog")}</td></tr>`}</tbody></table></div></div>`;
}

function renderBackupRestore() {
  const target = document.getElementById("backup-restore-content");
  if (!target) return;
  const backups = appData.backup_history || [];
  const latest = backups[0];
  const rows = backups.map((backup) => `
    <tr>
      <td><strong>${escapeHtml(backup.filename)}</strong></td>
      <td>${formatDateTime(backup.created_at)}</td>
      <td>${escapeHtml(backup.size_label || "-")}</td>
      <td>
        <div class="row-actions">
          <a class="button secondary small" href="/backups/${encodeURIComponent(backup.filename)}/download">${t("downloadBackup")}</a>
          ${appData.can_restore_backup ? `<form method="post" action="/backups/${encodeURIComponent(backup.filename)}/restore" data-ajax-form data-confirm-key="confirmRestoreBackup"><button class="button danger small" type="submit">${t("restoreBackup")}</button></form>` : ""}
          ${appData.can_restore_backup ? `<form method="post" action="/backups/${encodeURIComponent(backup.filename)}/delete" data-ajax-form data-confirm-key="confirmDeleteBackup"><button class="button danger small" type="submit">${t("deleteBackup")}</button></form>` : ""}
        </div>
      </td>
    </tr>`).join("");
  target.innerHTML = `
    <div class="backup-summary-grid">
      <article><span>${t("latestBackup")}</span><strong>${latest ? formatDateTime(latest.created_at) : "-"}</strong></article>
      <article><span>${t("backupFile")}</span><strong>${latest ? escapeHtml(latest.filename) : "-"}</strong></article>
      <article><span>${t("backupSize")}</span><strong>${latest ? escapeHtml(latest.size_label) : "-"}</strong></article>
    </div>
    <div class="panel">
      <h3>${t("backupHistory")}</h3>
      <div class="table-wrap">
        <table class="compact-table">
          <thead><tr><th>${t("backupFile")}</th><th>${t("backupDate")}</th><th>${t("backupSize")}</th><th>${t("action")}</th></tr></thead>
          <tbody>${rows || `<tr><td colspan="4">${t("noBackupHistory")}</td></tr>`}</tbody>
        </table>
      </div>
    </div>`;
}

function renderVehicles() {
  const target = document.getElementById("vehicle-list");
  if (!target) return;
  const vehicles = appData.vehicles || [];
  const vehicleForms = vehicles.map((vehicle) => `<form id="vehicle-form-${vehicle.id}" method="post" action="/vehicles/${vehicle.id}/update"></form>`).join("");
  const vehicleStatusBadge = (status) => `<span class="vehicle-status-badge ${String(status || "").toLowerCase()}">${escapeHtml(vehicleStatusLabel(status))}</span>`;
  const documentClass = (value) => isDateWithinDays(value, 30) ? "vehicle-document-warning" : "";
  const documentTitle = (value, label) => isDateWithinDays(value, 30) ? `${label} ${lang === "en" ? "needs renewal within 1 month" : "perlu perpanjangan dalam 1 bulan"}` : "";
  target.innerHTML = vehicles.length ? `${vehicleForms}<table class="vehicle-table compact-table"><thead><tr><th>${t("vehicleName")}</th><th>${t("plateNumber")}</th><th>${t("vehicleType")}</th><th>${t("capacity")}</th><th>${t("stnkDate")}</th><th>${t("kirDate")}</th><th>${t("vehicleStatus")}</th><th>${t("action")}</th></tr></thead><tbody>${vehicles.map((vehicle) => `
    <tr>
        <td><input form="vehicle-form-${vehicle.id}" name="vehicle_name" value="${escapeHtml(vehicle.vehicle_name)}" required></td>
        <td><input form="vehicle-form-${vehicle.id}" name="plate_number" value="${escapeHtml(vehicle.plate_number)}" required></td>
        <td><input form="vehicle-form-${vehicle.id}" name="vehicle_type" value="${escapeHtml(vehicle.vehicle_type || "")}" required></td>
        <td><input form="vehicle-form-${vehicle.id}" name="capacity" type="number" min="1" value="${escapeHtml(vehicle.capacity)}" required></td>
        <td class="${documentClass(vehicle.stnk_expiry_date)}" title="${escapeHtml(documentTitle(vehicle.stnk_expiry_date, "STNK"))}"><input form="vehicle-form-${vehicle.id}" name="stnk_expiry_date" type="date" value="${escapeHtml(vehicle.stnk_expiry_date || "")}">${documentClass(vehicle.stnk_expiry_date) ? `<small>${t("vehicleDocumentNotifications")}</small>` : ""}</td>
        <td class="${documentClass(vehicle.kir_expiry_date)}" title="${escapeHtml(documentTitle(vehicle.kir_expiry_date, "KIR"))}"><input form="vehicle-form-${vehicle.id}" name="kir_expiry_date" type="date" value="${escapeHtml(vehicle.kir_expiry_date || "")}">${documentClass(vehicle.kir_expiry_date) ? `<small>${t("vehicleDocumentNotifications")}</small>` : ""}</td>
        <td><select form="vehicle-form-${vehicle.id}" name="status"><option value="AVAILABLE" ${vehicle.status === "AVAILABLE" ? "selected" : ""}>${t("vehicleStatusAvailable")}</option><option value="MAINTENANCE" ${vehicle.status === "MAINTENANCE" ? "selected" : ""}>${t("vehicleStatusMaintenance")}</option><option value="ASSIGNED" ${vehicle.status === "ASSIGNED" ? "selected" : ""}>${t("vehicleStatusAssigned")}</option></select>${vehicleStatusBadge(vehicle.status)}</td>
        <td><div class="row-actions"><button class="button secondary small" form="vehicle-form-${vehicle.id}" type="submit">${t("save")}</button>
      <form class="inline-delete" method="post" action="/vehicles/${vehicle.id}/delete" onsubmit="return confirm('${t("confirmDeleteVehicle")}')"><button class="button danger small" type="submit">${t("delete")}</button></form></div></td>
    </tr>`).join("")}</tbody></table>` : empty(t("emptyVehicle"));
}

function renderDriverManagement() {
  const target = document.getElementById("driver-management-list");
  if (!target) return;
  const drivers = appData.drivers || [];
  const employees = appData.employees || [];
  const vehicles = appData.vehicles || [];
  const activeDriverNiks = new Set(drivers.map((driver) => String(driver.nik || "")));
  const driverCandidates = employees.filter((employee) => employee.active !== 0 && !activeDriverNiks.has(String(employee.nik || "")));
  const addDriverForm = driverCandidates.length ? `
    <form class="driver-add-form" method="post" action="/drivers/add-registered">
      <label>
        <span>${t("addRegisteredDriver")}</span>
        <select name="nik" required>
          <option value="">${t("selectRegisteredEmployee")}</option>
          ${driverCandidates.map((employee) => `<option value="${escapeHtml(employee.nik)}">${escapeHtml(employee.full_name)} - ${escapeHtml(employee.position || "-")} - ${escapeHtml(employee.department || "-")}</option>`).join("")}
        </select>
      </label>
      <button class="button primary small" type="submit">${t("addDriver")}</button>
    </form>` : `<div class="driver-add-empty">${t("noRegisteredDriverCandidate")}</div>`;
  const vehicleOptions = (selectedId) => `<option value="">-</option>${vehicles.map((vehicle) => `<option value="${vehicle.id}" ${Number(vehicle.id) === Number(selectedId) ? "selected" : ""}>${escapeHtml(vehicle.plate_number)} - ${escapeHtml(vehicle.vehicle_name)} - ${escapeHtml(vehicle.vehicle_type || "-")}</option>`).join("")}`;
  const forms = drivers.map((driver) => `<form id="driver-default-form-${driver.id}" method="post" action="/drivers/${driver.id}/default-vehicle"></form>`).join("");
  const deleteForms = drivers.map((driver) => `<form id="driver-delete-form-${driver.id}" method="post" action="/drivers/${driver.id}/delete" onsubmit="return confirm('${t("confirmDeleteDriver")}')"></form>`).join("");
  const driverTable = drivers.length ? `${forms}${deleteForms}<table><thead><tr><th>${t("driver")}</th><th>${t("phone")}</th><th>${t("simExpiryDate")}</th><th>${t("defaultVehicle")}</th><th>${t("action")}</th></tr></thead><tbody>${drivers.map((driver) => `
    <tr>
      <td>${escapeHtml(driver.driver_name)}</td>
      <td>${escapeHtml(driver.phone || "-")}</td>
      <td><input form="driver-default-form-${driver.id}" name="sim_expiry_date" type="date" value="${escapeHtml(driver.sim_expiry_date || "")}"></td>
      <td><select form="driver-default-form-${driver.id}" name="default_vehicle_id">${vehicleOptions(driver.default_vehicle_id)}</select></td>
      <td><div class="row-actions"><button class="button secondary small" form="driver-default-form-${driver.id}" type="submit">${t("save")}</button><button class="button danger small" form="driver-delete-form-${driver.id}" type="submit">${t("delete")}</button></div></td>
    </tr>
  `).join("")}</tbody></table>` : empty(t("emptyDriver"));
  target.innerHTML = `${addDriverForm}${driverTable}`;
}

function renderMaintenance() {
  const target = document.getElementById("maintenance-list");
  if (!target) return;
  const vehicles = appData.maintenance_vehicles || [];
  const canEditKm = !!appData.can_edit_vehicle_km;
  const canDeleteHistory = !!appData.can_delete_maintenance_history;
  const selectedHistoryVehicle = document.getElementById("maintenance-history-vehicle-filter")?.value || "";
  const maintenanceForms = vehicles.map((vehicle) => `<form id="maintenance-form-${vehicle.id}" method="post" action="/vehicles/${vehicle.id}/maintenance"></form>`).join("");
  const checkboxGroup = (name, options) => `<div class="maintenance-check-grid">${(options || []).map((option) => `
    <label><input form="maintenance-form-__ID__" type="checkbox" name="${name}" value="${escapeHtml(option)}"> ${escapeHtml(option)}</label>
  `).join("")}</div>`;
  const historyItems = (appData.maintenance_history || []).filter((item) => !selectedHistoryVehicle || String(item.vehicle_id) === selectedHistoryVehicle);
  const historyVehicleOptions = vehicles.map((vehicle) => `<option value="${vehicle.id}" ${String(vehicle.id) === selectedHistoryVehicle ? "selected" : ""}>${escapeHtml(vehicle.plate_number)} - ${escapeHtml(vehicle.vehicle_name)}</option>`).join("");
  const historyRows = historyItems.map((item) => {
    const types = parseJsonArray(item.maintenance_types);
    const parts = parseJsonArray(item.parts);
    return `
      <tr>
        <td>${formatDate((item.service_date || item.created_at || "").slice(0, 10))}</td>
        <td>${escapeHtml(item.plate_number || "-")} ${escapeHtml(item.vehicle_name || "")}</td>
        <td>${escapeHtml(item.km_at_service || 0)}</td>
        <td>${escapeHtml([...types, item.custom_maintenance_type].filter(Boolean).join(", ") || "-")}</td>
        <td>${escapeHtml([...parts, item.custom_part].filter(Boolean).join(", ") || "-")}</td>
        <td>${escapeHtml(item.created_by_name || item.created_by || "-")}</td>
        <td>${canDeleteHistory ? `<form class="inline-delete" method="post" action="/maintenance-history/${item.id}/delete" onsubmit="return confirm('${t("confirmDeleteVehicle")}')"><button class="button danger small" type="submit">${t("delete")}</button></form>` : "-"}</td>
      </tr>`;
  }).join("");
  target.innerHTML = vehicles.length ? `${maintenanceForms}<table class="maintenance-table compact-table"><thead><tr><th>${t("plateNumber")}</th><th>${t("vehicleName")}</th><th>${t("vehicleType")}</th><th>${t("currentKm")}</th><th>${t("lastServiceDate")}</th><th>${t("lastMaintenanceMonth")}</th><th>${t("maintenanceKmReference")}</th><th>${t("maintenanceReferenceLink")}</th><th>${t("action")}</th></tr></thead><tbody>${vehicles.map((vehicle) => `
    <tr>
      <td>${escapeHtml(vehicle.plate_number)}</td>
      <td>${escapeHtml(vehicle.vehicle_name)}</td>
      <td>${escapeHtml(vehicle.vehicle_type || "-")}</td>
      <td><input form="maintenance-form-${vehicle.id}" name="current_km" type="number" min="0" value="${escapeHtml(vehicle.current_km || 0)}" ${canEditKm ? "" : "readonly"}></td>
      <td><input form="maintenance-form-${vehicle.id}" name="last_service_date" type="date" value="${escapeHtml(vehicle.last_service_date || "")}"></td>
      <td><input form="maintenance-form-${vehicle.id}" name="last_maintenance_date" type="date" value="${escapeHtml(vehicle.last_maintenance_date || (vehicle.last_maintenance_month ? vehicle.last_maintenance_month + "-01" : ""))}"></td>
      <td><input form="maintenance-form-${vehicle.id}" name="maintenance_km_interval" type="number" min="1" value="${escapeHtml(vehicle.maintenance_km_interval || 10000)}"></td>
      <td><div class="reference-cell"><input form="maintenance-form-${vehicle.id}" name="maintenance_reference_url" type="url" value="${escapeHtml(vehicle.maintenance_reference_url || "")}">${vehicle.maintenance_reference_url ? `<a href="${escapeHtml(vehicle.maintenance_reference_url)}" target="_blank" rel="noopener">${t("openReference")}</a>` : ""}</div></td>
      <td><button class="button secondary small" form="maintenance-form-${vehicle.id}" type="submit">${t("save")}</button></td>
    </tr>
    <tr class="maintenance-realization-row">
      <td colspan="9">
        <details class="maintenance-realization">
          <summary>${t("maintenanceRealization")}</summary>
          <div class="maintenance-realization-grid">
            <section>
              <h4>${t("maintenanceTypeSection")}</h4>
              ${checkboxGroup("maintenance_types", appData.maintenance_type_options).replaceAll("maintenance-form-__ID__", `maintenance-form-${vehicle.id}`)}
              <input form="maintenance-form-${vehicle.id}" name="custom_maintenance_type" placeholder="${escapeHtml(t("customMaintenanceType"))}">
            </section>
            <section>
              <h4>${t("maintenancePartSection")}</h4>
              ${checkboxGroup("maintenance_parts", appData.maintenance_part_options).replaceAll("maintenance-form-__ID__", `maintenance-form-${vehicle.id}`)}
              <input form="maintenance-form-${vehicle.id}" name="custom_part" placeholder="${escapeHtml(t("customPart"))}">
            </section>
          </div>
        </details>
      </td>
    </tr>`).join("")}</tbody></table>
    <div class="maintenance-history-block">
      <div class="maintenance-history-head">
        <h3>${t("maintenanceHistory")}</h3>
        <label><span>${t("filterPlateNumber")}</span><select id="maintenance-history-vehicle-filter"><option value="">${t("allVehicles")}</option>${historyVehicleOptions}</select></label>
      </div>
      <table class="maintenance-history-table compact-table">
        <thead><tr><th>${t("lastServiceDate")}</th><th>${t("vehicle")}</th><th>${t("currentKm")}</th><th>${t("maintenanceType")}</th><th>${t("maintenanceParts")}</th><th>${t("inputBy")}</th><th>${t("action")}</th></tr></thead>
        <tbody>${historyRows || `<tr><td colspan="7">${t("notificationsEmpty")}</td></tr>`}</tbody>
      </table>
    </div>` : empty(t("emptyVehicle"));
}

function renderEmployees() {
  const target = document.getElementById("employee-list");
  if (!target) return;
  const employees = appData.employees || [];
  target.innerHTML = employees.length ? `<table><thead><tr><th>NIK</th><th>${t("name")}</th><th>${t("position")}</th><th>${t("department")}</th><th>${t("supervisor")}</th><th>${t("phone")}</th><th>${t("role")}</th><th>${t("action")}</th></tr></thead><tbody>${employees.map((item) => `
    <tr><td>${escapeHtml(item.nik)}</td><td>${escapeHtml(item.full_name)}</td><td>${escapeHtml(item.position)}</td><td>${escapeHtml(item.department)}</td><td>${escapeHtml(item.supervisor_nik || "-")}</td><td>${escapeHtml(item.phone)}</td><td>${escapeHtml(roleText(item.roles_text) || "-")}</td><td><div class="row-actions"><button class="button secondary small" type="button" data-edit-employee="${escapeHtml(item.nik)}">${t("edit")}</button><form class="inline-delete" method="post" action="/employees/${encodeURIComponent(item.nik)}/delete" onsubmit="return confirm('${t("confirmDeleteEmployee")}')"><button class="button danger small" type="submit">${t("delete")}</button></form></div></td></tr>`).join("")}</tbody></table>` : empty(t("noData"));
}

function renderOptionManager() {
  ensureOptionData();
  const positionTarget = document.getElementById("position-option-list");
  const departmentTarget = document.getElementById("department-option-list");
  if (!positionTarget || !departmentTarget) return;
  const renderChips = (kind, values) => sortedOptions(values).map((value) => `<span class="option-chip">${escapeHtml(value)}<button type="button" title="${t("delete")}" data-delete-option data-kind="${kind}" data-value="${escapeHtml(value)}">x</button></span>`).join("");
  const renderManager = (kind, values, label, emptyText) => {
    const sorted = sortedOptions(values);
    return `
    <div class="option-chip-list">${sorted.length ? renderChips(kind, sorted) : `<span class="option-empty">${escapeHtml(emptyText)}</span>`}</div>
    <div class="option-add-row">
      <input type="text" data-option-input="${kind}" placeholder="${escapeHtml(t("addOther"))} ${escapeHtml(label)}">
      <button class="button secondary small" type="button" data-add-option="${kind}">${escapeHtml(t("addOther"))}</button>
    </div>
  `;
  };
  positionTarget.innerHTML = renderManager("position", appData.options.positions, t("position"), t("noPositionData"));
  departmentTarget.innerHTML = renderManager("department", appData.options.departments, t("department"), t("noDepartmentData"));
}

function renderGuide() {
  const target = document.getElementById("guide-content");
  const search = document.getElementById("guide-search");
  const question = document.getElementById("guide-question");
  if (!target) return;
  if (search) search.placeholder = t("guideSearchPlaceholder");
  if (question) question.placeholder = t("guideAskPlaceholder");
  const query = (search?.value || "").trim().toLowerCase();
  const items = GUIDE_CONTENT[lang] || GUIDE_CONTENT.id;
  const filtered = items.filter((item) => {
    const text = `${item.title} ${item.tags} ${item.points.join(" ")}`.toLowerCase();
    return !query || text.includes(query);
  });
  target.innerHTML = filtered.length ? filtered.map((item) => `
    <article class="guide-card" data-guide-item>
      <h3>${escapeHtml(item.title)}</h3>
      <ul>${item.points.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul>
    </article>
  `).join("") : empty(t("notificationsEmpty"));
}

function guideScore(item, query) {
  const words = query.toLowerCase().split(/\s+/).filter((word) => word.length > 2);
  const title = item.title.toLowerCase();
  const tags = item.tags.toLowerCase();
  const points = item.points.join(" ").toLowerCase();
  return words.reduce((score, word) => {
    if (title.includes(word)) score += 5;
    if (tags.includes(word)) score += 4;
    if (points.includes(word)) score += 2;
    return score;
  }, 0);
}

function answerGuideQuestion() {
  const input = document.getElementById("guide-question");
  const answer = document.getElementById("guide-answer");
  if (!input || !answer) return;
  const query = input.value.trim();
  if (!query) {
    answer.innerHTML = `<div class="alert warning compact-alert">${t("guideAskEmpty")}</div>`;
    return;
  }
  const items = GUIDE_CONTENT[lang] || GUIDE_CONTENT.id;
  const ranked = items
    .map((item) => ({ ...item, score: guideScore(item, query) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);
  if (!ranked.length) {
    answer.innerHTML = `<div class="guide-answer-card"><h3>${t("guideAnswerTitle")}</h3><p>${t("guideNoAnswer")}</p></div>`;
    return;
  }
  const best = ranked[0];
  answer.innerHTML = `
    <div class="guide-answer-card">
      <h3>${t("guideAnswerTitle")}</h3>
      <p><strong>${t("guideRelatedTopic")}:</strong> ${escapeHtml(best.title)}</p>
      <ul>${best.points.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul>
    </div>
  `;
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
  const handleBookingEdit = () => {
    saveBookingDraft();
    enableBookingSubmitAfterConflict();
  };
  form.addEventListener("input", handleBookingEdit);
  form.addEventListener("change", handleBookingEdit);
  form.addEventListener("submit", () => {
    saveBookingDraft();
    sessionStorage.setItem(BOOKING_SUBMITTING_KEY, "1");
  });
}

function enableBookingSubmitAfterConflict() {
  const params = new URLSearchParams(window.location.search);
  if (!params.get("full_booked")) return;
  const button = document.querySelector('#booking form[action="/requests"] button[type="submit"]');
  if (button) button.disabled = false;
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
  if (event.target.matches("#p2h-start-month-filter, #p2h-start-year-filter, #p2h-end-month-filter, #p2h-end-year-filter, #p2h-driver-filter, #p2h-vehicle-filter, #p2h-status-filter, #p2h-follow-filter")) {
    p2hFilterValues();
    renderP2hReportData();
  }
  if (event.target.matches("#history-start-filter, #history-end-filter")) {
    historyPage = 1;
    renderHistory();
  }
  if (event.target.matches("#maintenance-history-vehicle-filter")) {
    renderMaintenance();
  }
  if (event.target.matches("#driver-schedule-date-filter, #driver-schedule-driver-filter, #driver-schedule-vehicle-filter")) {
    renderDriverScheduleDashboard();
  }
  if (event.target.matches(".proof-upload-input")) {
    event.target.closest("form")?.requestSubmit();
  }
  if (event.target.matches("[data-assignment-driver]")) {
    updateDefaultVehicleSelection(event.target);
  }
  if (event.target.matches("[data-assignment-vehicle]")) {
    updateDefaultDriverSelection(event.target);
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

document.addEventListener("input", (event) => {
  if (event.target.matches("#driver-schedule-search")) {
    renderDriverScheduleDashboard();
  }
  if (event.target.matches("#guide-search")) {
    renderGuide();
  }
  if (event.target.matches("#guide-question")) {
    answerGuideQuestion();
  }
  if (event.target.matches("#p2h-search-filter")) {
    renderP2hReportData();
  }
});

document.addEventListener("click", (event) => {
  if (event.target.closest("#guide-ask-button")) {
    answerGuideQuestion();
    return;
  }
  const openTabButton = event.target.closest("[data-open-tab]");
  if (openTabButton) {
    activateTab(openTabButton.dataset.openTab, { clearAlert: true });
    return;
  }
  const editButton = event.target.closest("[data-edit-employee]");
  if (editButton) openEmployeeModal(editButton.dataset.editEmployee);
  const addOptionButton = event.target.closest("[data-add-option]");
  if (addOptionButton) addManagedOption(addOptionButton.dataset.addOption);
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
  const historyPageButton = event.target.closest("[data-history-page]");
  if (historyPageButton) {
    historyPage = Number(historyPageButton.dataset.historyPage || 1);
    renderHistory();
  }
  const historyClearButton = event.target.closest("#history-clear-filter");
  if (historyClearButton) {
    document.getElementById("history-start-filter").value = "";
    document.getElementById("history-end-filter").value = "";
    historyPage = 1;
    renderHistory();
  }
  const notificationItem = event.target.closest("[data-notification-tab]");
  if (notificationItem) {
    activateTab(notificationItem.dataset.notificationTab || "dashboard", { clearAlert: true });
    document.getElementById("vehicle-alert-panel")?.classList.add("hidden");
    return;
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
  const params = new URLSearchParams(window.location.search);
  const response = await fetch("/api/data");
  appData = await response.json();
  lang = appData.language || localStorage.getItem("gaLanguage") || "id";
  applyTranslations();
  renderOptionSelects();
  renderAllSections();
  setupBookingPersistence();
  activateTab(params.get("tab") || "dashboard", { clearAlert: false });
  if (params.get("success")) {
    window.alert(params.get("success"));
    params.delete("success");
    const nextUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
    window.history.replaceState({}, "", nextUrl);
  }
}

init();
