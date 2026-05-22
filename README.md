# GA Operations System

Fleet & Vehicle Management web application berbasis Flask + SQLite.

## Cara Menjalankan

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

Buka:

```text
http://127.0.0.1:5000
```

## Contoh Login NIK

- `102145` - User
- `102146` - Pimpinan
- `102147` - GA Admin
- `200145` - Driver
- `900001` - Super Admin GA

## Fitur

- Login cukup menggunakan NIK.
- Master employee, driver, dan vehicle.
- Booking kendaraan.
- Approval pimpinan otomatis berdasarkan data employee.
- Assignment driver dan kendaraan oleh GA.
- Deteksi konflik jadwal driver dan kendaraan.
- Driver mobile page untuk start/finish trip.
- Review wajib setelah perjalanan selesai.
- Blok booking baru jika ada 3 perjalanan selesai belum direview.
- Dashboard monitoring, history, dan export Excel.
