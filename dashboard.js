// dashboard.js — FITUR Layar 1: Dashboard

// ===== LAYAR 1: DASHBOARD (vDash membuat HTML-nya) =====
// Membuat HTML Layar 1: Dashboard
function vDash() {
    const live = orders.filter(o => !o.done);
    const td = orders.filter(o => o.c === 0);
    const om = td.reduce((s, o) => s + o.total, 0);
    const cnt = i => live.filter(o => o.stage === i).length;
    const due = [...live].filter(o => o.stage < 4).sort((a, b) => a.due - b.due).slice(0, 4);
    const rdy = live.filter(o => o.stage === 4);
    const li = (o, r) => `<div class="li">
          <div>
            <div class="b">${esc(o.nama)}</div>
        <div class="cap">${SV[o.sv][0]} · ${o.id}</div></div>
        <div class="r">${r}</div></div>`;
    return phead('Halo, Erba', new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }), `<a class="btn" href="#pesanan-baru">+ Pesanan baru</a>
        <a class="btn o" href="#cucian" data-act="go" data-f="">Daftar cucian</a>`) +
        `<div class="grid g2" style="margin-bottom:24px">
          <section class="card stat">
            <div class="cap">Omzet hari ini</div>
            <h2>${rp(om)}</h2></section>
        <section class="card">
          <div class="cap">Pesanan masuk hari ini</div>
          <h2>${td.length} pesanan</h2></section></div>
        <section class="card" style="margin-bottom:24px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <h3>Jalur cucian</h3>
            <a href="#cucian" data-act="go" data-f="">Lihat semua</a></div>
          <div class="track">${ST.map((s, i) => `<button class="stg ${i === 4 ? 'ok' : ''}" data-act="go" data-f="${i}" aria-label="${s}: ${cnt(i)} cucian"><b>${cnt(i)}</b>${i === 4 ? '✓ ' : ''}${s}</button>`).join('')}</div></section>
        <div class="grid g2">
          <article class="card">
            <h3>Tenggat terdekat</h3>${due.map(o => li(o, o.due < 0 ? '<span class="late">⚠ Lewat tenggat</span>' : `<span class="cap">${o.due === 0 ? 'Hari ini' : fd(o.due)}</span>`) + '').join('') || '<p class="cap">Tidak ada cucian dalam proses.</p>'}</article>
        <article class="card">
          <h3>Siap diserahkan</h3>${rdy.map(o => li(o, payB(o))).join('') || '<p class="cap">Belum ada cucian yang selesai.</p>'}</article></div>`;
}

// ----- Aksi tombol untuk fitur ini (didaftarkan ke objek A di shared.js) -----
// go = klik jalur tahap / "Lihat semua": pasang filter lalu pindah ke Daftar Cucian
Object.assign(A, {
    go: (d) => {
        flt = { q: '', st: d.f ?? '', pay: '' };
    }
});`    `