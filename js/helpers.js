const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const rp = n => 'Rp' + Math.round(n).toLocaleString('id-ID');

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const ST = ['Dicuci', 'Dijemur', 'Disetrika', 'Dilipat', 'Selesai'];

const SV = {
    cs: ['Cuci + Setrika', 8000], ck: ['Cuci Kering', 6000], st: ['Setrika saja', 5000], sp: ['Selimut / Bedcover', 12000]
};

const ANTAR = 5000;

const DAY = 864e5;

const T0 = new Date();

T0.setHours(0, 0, 0, 0);

const dt = o => new Date(T0.getTime() + o * DAY);

const fd = (o, x) => dt(o).toLocaleDateString('id-ID', x || { day: 'numeric', month: 'short' });

const pad = n => String(n).padStart(2, '0');

const iso = o => {
    const d = dt(o);
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
};

const now = () => new Date().toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

const ymd = o => {
    const d = dt(o);
    return String(d.getFullYear()).slice(2) + pad(d.getMonth() + 1) + pad(d.getDate());
};
