// cek-status.js — FITUR Layar 5: Cek Status (pelanggan)

// ===== LAYAR 5: CEK STATUS PELANGGAN (vCek = halaman, showRes = hasil + stepper) =====
// Membuat HTML Layar 5: Cek Status untuk pelanggan
function vCek() {
    return `<div class="pub">
          <header>
            <div class="logo" style="margin:0"><i>E</i>Erba Laundry</div>
            <nav aria-label="Menu publik">
              <a href="#cek-status">Cek status</a>
              <a href="#kontak">Layanan</a>
              <a href="#dashboard">Masuk petugas</a></nav></header>
          <main>
            <h1 style="margin-bottom:8px">Cek status laundry</h1>
            <p class="cap" style="margin:0 0 24px">Masukkan nomor pesanan dari nota dan nomor WhatsApp yang Anda daftarkan.</p>
            <form id="cf" novalidate class="card">
              <div class="fld">
                <label for="c-id">Nomor pesanan</label>
                <input id="c-id" type="text" placeholder="ERB-261120-K7QX" autocomplete="off">
                <p class="err" id="e-id" hidden></p></div>
              <div class="fld">
                <label for="c-wa">Nomor WhatsApp</label>
                <input id="c-wa" type="tel" placeholder="0812-3456-7801">
                <p class="err" id="e-cwa" hidden></p></div>
              <button class="btn full" type="submit">Cek status</button>
              <p class="hint">Contoh untuk dicoba: ${orders[0].id} / ${orders[0].wa}</p></form>
        <section id="res" aria-live="polite" style="margin-top:24px"></section></main>
        <footer id="kontak">
          <div class="b">Erba Laundry</div>
          <div class="cap">Sigura-gura Gang 3 No. 08, Malang · WhatsApp 0812-3456-7800</div>
          <div class="cap">Layanan: ${Object.values(SV).map(v => v[0]).join(', ')}</div></footer></div>`;
}

// Menampilkan hasil cek status: stepper, biaya, riwayat
function showRes(o) {
    const s = o.done ? 5 : o.stage;
    $('#res').innerHTML = `<div class="card">
          <div class="cap">Nomor pesanan</div>
          <h2>${o.id}</h2>
        <ol class="step" aria-label="Tahap pengerjaan">${ST.map((t, i) => `<li class="${i < o.stage || o.done ? 'past' : i === o.stage ? 'now' : ''}" ${i === o.stage && !o.done ? 'aria-current="step"' : ''}><i></i>${t}</li>`).join('')}</ol>
        <p style="text-align:center;margin:16px 0">${o.done ? badge('Sudah diserahkan', 'ok', '✓') : o.stage === 4 ? badge('Selesai, siap diambil', 'ok', '✓') : badge('Sedang ' + ST[o.stage].toLowerCase().replace(/^di/, 'di'))} <span class="cap">· Perkiraan selesai ${fd(o.due, { weekday: 'long', day: 'numeric', month: 'long' })}</span></p></div>
        <div class="grid g2" style="margin-top:16px">
          <div class="card">
            <h3>Rincian biaya</h3>
            <div class="rb"><span>${SV[o.sv][0]} · ${String(o.berat).replace('.', ',')} kg</span><span></span></div>
        <div class="rb"><span>Dibayar</span><span>${rp(o.bayar)}</span></div>
        <div class="rb t"><span>${sisa(o) > 0 ? 'Sisa tagihan' : 'Total'}</span><span>${rp(sisa(o) > 0 ? sisa(o) : o.total)}</span></div>${payB(o)}</div>
        <div class="card">
          <h3>Riwayat pengerjaan</h3>${[...o.log].reverse().map(l => `<div class="li"><span>${esc(l[1])}</span><span class="cap">${l[0]}</span></div>`).join('')}</div></div>`;
}

// Memvalidasi formulir cek status lalu mencari pesanan
function bindCek() {
    $('#cf').onsubmit = e => {
        e.preventDefault();
        const id = $('#c-id').value.trim().toUpperCase();
        const wa = $('#c-wa').value;
        let ok = true;
        const se = (k, m) => {
            const el = $('#e-' + k);
            el.hidden = !m;
            el.textContent = m ? '⚠ ' + m : '';
            el.closest('.fld').classList.toggle('bad', !!m);
        };
        se('id', id ? '' : 'Nomor pesanan wajib diisi');
        se('cwa', wa.trim() ? '' : 'Nomor WhatsApp wajib diisi');
        if (!id || !wa.trim()) {
            $('#res').innerHTML = '';
            return;
        }
        const o = orders.find(x => x.id === id && x.wa === normWa(wa));
        if (!o) {
            $('#res').innerHTML = `<div class="card" style="border-color:var(--er)">
          <div class="b" style="color:var(--er)">⚠ Pesanan tidak ditemukan</div>
          <p class="cap" style="margin:4px 0 0">Periksa nomor pesanan pada nota dan pastikan nomor WhatsApp sama dengan yang didaftarkan.</p></div>`;
            return;
        }
        showRes(o);
    };
}