const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

// Mengubah angka jadi format Rupiah, mis. 52500 -> Rp52.500
const rp = n => 'Rp' + Math.round(n).toLocaleString('id-ID');

// Mengamankan teks dari karakter HTML berbahaya sebelum ditampilkan
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// ===== 2. DATA TETAP: tahap cucian, daftar layanan + harga/kg, ongkos antar =====
const ST = ['Dicuci', 'Dijemur', 'Disetrika', 'Dilipat', 'Selesai'];

const SV = {
    cs: ['Cuci + Setrika', 8000], ck: ['Cuci Kering', 6000], st: ['Setrika saja', 5000], sp: ['Selimut / Bedcover', 12000]
};

const ANTAR = 5000;

const DAY = 864e5;

const T0 = new Date();

T0.setHours(0, 0, 0, 0);

// Mengubah "selisih hari dari hari ini" (0, -1, 1...) menjadi objek tanggal
const dt = o => new Date(T0.getTime() + o * DAY);

// Memformat tanggal dari selisih hari, mis. 21 Nov
const fd = (o, x) => dt(o).toLocaleDateString('id-ID', x || { day: 'numeric', month: 'short' });

const pad = n => String(n).padStart(2, '0');

// Format tanggal YYYY-MM-DD untuk kolom input tanggal
const iso = o => {
    const d = dt(o);
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
};

// Waktu sekarang (dipakai untuk catatan riwayat)
const now = () => new Date().toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

const ymd = o => {
    const d = dt(o);
    return String(d.getFullYear()).slice(2) + pad(d.getMonth() + 1) + pad(d.getDate());
};