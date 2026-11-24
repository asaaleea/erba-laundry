// data.js — data pesanan contoh (di memori; hilang saat refresh)

// ===== 3. DATA PESANAN CONTOH (disimpan di memori, hilang saat refresh) =====
// mk() = membuat 1 pesanan lalu memasukkannya ke array orders
let orders = [];

// Membuat SATU pesanan lalu memasukkannya ke array orders
function mk(code, nama, wa, sv, berat, total, bayar, stage, c, due, o = {}) {
    const x = {
        id: 'ERB-' + ymd(c) + '-' + code, nama, wa, alamat: o.alamat || '', ambil: o.alamat ? 'antar' : 'sendiri', sv, berat, total, bayar, stage, done: !!o.done, c, due, ws: o.ws || null, log: []
    };
    x.log.push([fd(c) + ' 08:30', 'Pesanan diterima']);
    for (let i = 0; i <= stage && i < 5; i++) {
        x.log.push([fd(c) + ' ' + pad(9 + i * 2) + ':00', 'Status: ' + ST[i]]);
    }
    if (x.done) {
        x.log.push([fd(c + 1) + ' 15:00', 'Diserahkan ke pelanggan']);
    }
    orders.push(x);
}

mk('K7QX', 'Sari Wulandari', '081234567801', 'cs', 6.5, 52500, 33000, 2, 0, 1);
mk('M3PD', 'Budi Santoso', '081234567802', 'ck', 5, 45000, 45000, 0, 0, 2);
mk('H8LN', 'Dewi Anggraini', '081234567803', 'cs', 4.5, 38000, 0, 1, 0, 1, { alamat: 'Jl. Sigura-gura No. 12, Malang' });
mk('R2TW', 'Agus Prasetyo', '081234567804', 'sp', 4, 51000, 51000, 4, 0, 0);
mk('Q9ZB', 'Rina Marlina', '081234567805', 'cs', 3.5, 33000, 33000, 4, -1, 0, { ws: 'Terkirim' });
mk('T5CV', 'Hendra Gunawan', '081234567806', 'st', 6, 30000, 10000, 3, -1, -1);
mk('L1XD', 'Maya Putri', '081234567807', 'cs', 3.5, 28000, 0, 4, -2, -1, { ws: 'Gagal' });
[[-3, 'A4NE', 40000], [-3, 'B7YF', 62000], [-5, 'C2KG', 36000], [-6, 'D6HJ', 47000], [-8, 'E3MP', 55000], [-9, 'F8RS', 29000]].forEach(([c, k, t], i) => mk(k, ['Nur Hidayah', 'Eko Wahyudi', 'Fitri Amalia', 'Gilang Ramadhan', 'Intan Permata', 'Joko Susilo'][i], '0812345679' + pad(i), ['cs', 'ck', 'sp'][i % 3], t / 8000, t, t, 4, c, c + 2, { done: true }));