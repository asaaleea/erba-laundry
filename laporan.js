// laporan.js — FITUR Layar 4: Laporan & Riwayat Transaksi

// ===== LAYAR 4: LAPORAN (hitung omzet per hari & per layanan dari data pesanan) =====
// Membuat HTML Layar 4: Laporan (hitung omzet per hari & per layanan)
function vRep() {
    const L = orders.filter(o => o.c >= rep.f && o.c <= rep.t);
    const om = L.reduce((s, o) => s + o.total, 0);
    const by = [];
    for (let c = rep.t; c >= rep.f; c--) {
        const x = L.filter(o => o.c === c);
        if (x.length) {
            by.push([c, x.length, x.reduce((s, o) => s + o.total, 0)]);
        }
    }
    const sv = Object.entries(SV).map(([k, v]) => [v[0], L.filter(o => o.sv === k).reduce((s, o) => s + o.total, 0)]);
    const mx = Math.max(1, ...sv.map(s => s[1]));
    const per = rep.f === rep.t ? 'Hari ini' : fd(rep.f) + ' – ' + fd(rep.t);
    return phead('Laporan & riwayat', 'Periode: ' + per, `<button class="btn o" data-act="csv">Unduh CSV</button>
        <button class="btn o" data-act="print">Cetak</button>`) +
        `<search class="card filters" role="search" style="align-items:end">
          <div>
            <label for="d1">Dari</label>
            <input id="d1" type="date" value="${iso(rep.f)}"></div>
        <div>
          <label for="d2">Sampai</label>
          <input id="d2" type="date" value="${iso(rep.t)}"></div>
        <button class="btn" data-act="range">Tampilkan</button>
        <div class="acts">
          <button class="btn o sm" data-act="per" data-f="0">Hari ini</button>
          <button class="btn o sm" data-act="per" data-f="-6">7 hari</button>
          <button class="btn o sm" data-act="per" data-f="${-(T0.getDate() - 1)}">Bulan ini</button></div></search>
        <div class="grid g2" style="margin:24px 0">
          <section class="card stat">
            <div class="cap">Omzet periode</div>
            <h2>${rp(om)}</h2></section>
        <section class="card">
          <div class="cap">Jumlah transaksi · terbayar</div>
          <h2>${L.length} · ${rp(L.reduce((s, o) => s + o.bayar, 0))}</h2></section></div>
        <div class="grid g7" style="margin-bottom:24px">
          <section class="card">
            <h3>Per hari</h3>
            <div class="scroll">
              <table>
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th class="r">Pesanan</th>
                    <th class="r">Omzet</th></tr></thead>
                <tbody>${by.map(([c, n, t]) => `<tr>
          <td>${fd(c, { weekday: 'short', day: 'numeric', month: 'short' })}</td>
        <td class="r">${n}</td>
        <td class="r">${rp(t)}</td></tr>`).join('') || '<tr><td colspan="3" class="cap">Belum ada transaksi pada periode ini.</td></tr>'}</tbody></table></div></section>
        <aside class="card">
          <h3>Pendapatan per layanan</h3>${sv.map(([n, v]) => `<div class="barrow">
          <div class="rb"><span>${n}</span><span class="b">${rp(v)}</span></div>
        <div class="bar" style="width:${v / mx * 100}%" role="img" aria-label="${n} ${rp(v)}"></div></div>`).join('')}</aside></div>
        <section class="card">
          <h3>Riwayat transaksi</h3>
          <div class="scroll">
            <table>
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Pesanan</th>
                  <th>Pelanggan</th>
                  <th class="r">Total</th>
                  <th>Pembayaran</th>
                  <th></th></tr></thead>
              <tbody>${[...L].sort((a, b) => b.c - a.c).map(o => `<tr>
          <td>${fd(o.c)}</td>
        <td>${o.id}</td>
        <td>${esc(o.nama)}</td>
        <td class="r">${rp(o.total)}</td>
        <td>${payB(o)}</td>
        <td>
        <button class="btn o sm" data-act="nota" data-id="${o.id}">Lihat nota</button></td></tr>`).join('')}</tbody></table></div></section>`;
}

// ----- Aksi tombol untuk fitur ini (didaftarkan ke objek A di shared.js) -----
// nota = lihat nota lama | per = pintasan periode | range = tombol Tampilkan | csv = unduh CSV
Object.assign(A, {
    nota: d => showNota(get(d.id)),
    per: d => {
        rep = { f: +d.f, t: 0 };
        route();
    },
    range: () => {
        const f = Math.round((new Date($('#d1').value + 'T00:00') - T0) / DAY);
        const t = Math.round((new Date($('#d2').value + 'T00:00') - T0) / DAY);
        if (isNaN(f) || isNaN(t) || f > t) {
            toast('Rentang tanggal tidak valid');
            return;
        }
        rep = { f, t };
        route();
    },
    csv: () => {
        const L = orders.filter(o => o.c >= rep.f && o.c <= rep.t);
        const csv = 'Tanggal,Pesanan,Pelanggan,Layanan,Total,Dibayar\n' + L.map(o => [iso(o.c), o.id, '"' + o.nama + '"', SV[o.sv][0], o.total, o.bayar].join(',')).join('\n');
        const a = document.createElement('a');
        a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
        a.download = 'laporan-erba-laundry.csv';
        a.click();
        toast('Laporan CSV diunduh');
    }
});