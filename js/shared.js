// shared.js — dipakai banyak fitur: status bayar, state filter, toast, dialog, aksi klik

// FUNGSI STATUS & PEMBAYARAN
// payS = status bayar (Lunas/Sebagian/Belum), sisa = sisa tagihan, validWa = cek format nomor WA
// Mencari pelanggan lama berdasarkan nomor WhatsApp
const cust = wa => [...orders].reverse().find(o => o.wa === wa);

// Menentukan status bayar: Lunas / Dibayar sebagian / Belum dibayar
const payS = o => o.bayar >= o.total ? ['Lunas', 'ok', '✓'] : o.bayar > 0 ? ['Dibayar sebagian', 'wr', '⚠'] : ['Belum dibayar', 'er', '⚠'];

// Membuat label kecil berwarna (badge) dengan ikon + teks
const badge = (t, k, i) => `<span class="badge ${k || ''}">${i ? i + ' ' : ''}${t}</span>`;

// Badge status pengerjaan (Dicuci ... Selesai / Diserahkan)
const stB = o => o.done ? badge('Diserahkan', 'ok', '✓') : o.stage === 4 ? badge('Selesai', 'ok', '✓') : badge(ST[o.stage]);

// Badge status pembayaran
const payB = o => {
    const p = payS(o);
    return badge(p[0], p[1], p[2]);
};

// Sisa tagihan = total - sudah dibayar
const sisa = o => o.total - o.bayar;

// Merapikan nomor WA jadi format 08xxxxxxxx
const normWa = v => {
    let d = String(v).replace(/\D/g, '');
    if (d.startsWith('62')) {
        d = '0' + d.slice(2);
    }
    return d;
};

// Cek nomor WA valid (10-13 digit, diawali 0)
const validWa = v => /^0\d{9,12}$/.test(normWa(v));

// Membuat tautan WhatsApp (wa.me) dengan isi pesan
const waLink = (o, txt) => 'https://wa.me/62' + normWa(o.wa).slice(1) + '?text=' + encodeURIComponent(txt);

const cekUrl = () => location.href.split('#')[0] + '#cek-status';

const waDone = o => `Halo ${o.nama}, cucian Anda (${o.id}) sudah selesai. Total ${rp(o.total)}, sisa tagihan ${rp(sisa(o))}. Cek status: ${cekUrl()}`;

let flt = { q: '', st: '', pay: '' };

let rep = { f: -6, t: 0 };

let saved = null;

let cekRes = null;

// toast = notifikasi kecil 3 detik; ask = membuka dialog konfirmasi (judul, isi, tombol Batal & OK)
// Menampilkan notifikasi kecil selama 3 detik
function toast(m) {
    const t = $('#toast');
    t.innerHTML = `<div class="toast">${esc(m)}</div>`;
    clearTimeout(toast.h);
    toast.h = setTimeout(() => t.innerHTML = '', 3000);
}


// Membuka dialog konfirmasi (judul, isi, tombol Batal & OK)
function ask({ title, body, ok, danger, cancel = 'Batal', onOk, extra }) {
    const d = $('#dlg');
    d.innerHTML = `<div class="dh">
          <h3 id="dt">${title}</h3>
        <button class="x" data-act="close" aria-label="Tutup">✕</button></div>
        <div>${body}</div>
        <p class="err" id="derr" hidden></p>
        <div class="df">
          <div>${extra || ''}</div>
        <div>
          <button class="btn o" data-act="close">${cancel}</button>${ok ? `<button class="btn ${danger ? 'dg' : ''}" id="dok">${ok}</button>` : ''}</div></div>`;
    d.showModal();
    const b = $('#dok');
    if (b) {
        b.onclick = () => {
            if (onOk() !== false) {
                d.close();
            }
        };
    }
    return d;
}

$('#dlg').addEventListener('click', e => {
    if (e.target.id === 'dlg') {
        e.target.close();
    }
});

// Menampilkan pesan error di dalam dialog
const derr = m => {
    const e = $('#derr');
    e.hidden = !m;
    e.textContent = '⚠ ' + m;
};

// ===== AKSI TOMBOL (dipakai semua fitur) =====
// Tombol HTML berisi data-act="nama". Satu listener klik memanggil fungsi A[nama].
// Setiap fitur menambah aksinya sendiri lewat Object.assign(A, {...}).
const A = { close: () => $('#dlg').close(), print: () => print() };

document.addEventListener('click', e => {
    const b = e.target.closest('[data-act]');
    if (b && A[b.dataset.act]) {
        A[b.dataset.act](b.dataset, b);
    }
});