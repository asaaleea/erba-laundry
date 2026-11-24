// kerangka halaman petugas (sidebar + konten) dan header halaman

// KERANGKA HALAMAN: sidebar + konten
const NAV = [['dashboard', 'Dashboard'], ['pesanan-baru', 'Pesanan Baru'], ['cucian', 'Daftar Cucian'], ['laporan', 'Laporan']];

// Membungkus sebuah layar dengan sidebar menu
function shell(r, view) {
    return `<div class="shell">
          <nav class="side" aria-label="Menu utama">
            <div class="logo"><i>E</i>Erba Laundry</div>${NAV.map(([k, t]) => `<a href="#${k}" ${r === k ? 'aria-current="page"' : ''}>${t}</a>`).join('')}<span class="sp"></span>
        <a href="#cek-status">Halaman pelanggan</a></nav>
        <main class="wrap" id="main">${view}</main></div>`;
}

// Membuat header halaman (judul, keterangan, tombol)
const phead = (t, sub, btns) => `<header class="ph">
          <div>
            <h1>${t}</h1>
        <p class="cap" style="margin:4px 0 0">${sub}</p></div>
        <div class="btns">${btns || ''}</div></header>`;