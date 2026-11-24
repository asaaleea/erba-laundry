//LAYAR 2: PESANAN BARU
// vForm = HTML formulir | calc/upRb = hitung & tampilkan rincian biaya | bindForm = validasi, isi otomatis, simpan | showNota = dialog nota
// Membuat HTML Layar 2: formulir pesanan baru
function vForm() {
    return phead('Pesanan baru', 'Catat sekali, biaya terhitung otomatis.') + (saved ? '' : '') +
        `<form id="fm" novalidate class="grid g8" style="align-items:start">
          <div class="grid">
            <section class="card">
              <h3>Pelanggan</h3>
              <div class="fld">
                <label for="f-wa">No. WhatsApp *</label>
                <input id="f-wa" type="tel" placeholder="0812-3456-7801" autocomplete="off">
                <p class="hint" id="h-wa">Pelanggan lama dikenali otomatis</p>
                <p class="err" id="e-wa" hidden></p></div>
              <div class="fld">
                <label for="f-nama">Nama pelanggan *</label>
                <input id="f-nama" type="text">
                <p class="err" id="e-nama" hidden></p></div>
              <div class="fld">
                <label id="l-amb">Pengambilan *</label>
                <div class="seg" role="radiogroup" aria-labelledby="l-amb">
                  <label>
                  <input type="radio" name="ambil" value="sendiri" checked><span>Ambil sendiri</span></label>
                  <label>
                  <input type="radio" name="ambil" value="antar"><span>Diantar (+${rp(ANTAR)})</span></label></div></div>
        <div class="fld" id="w-alamat" hidden>
          <label for="f-alamat">Alamat antar *</label>
          <textarea id="f-alamat"></textarea>
          <p class="err" id="e-alamat" hidden></p></div></section>
        <section class="card">
          <h3>Layanan</h3>
          <div class="cols">
            <div class="fld">
              <label for="f-sv">Jenis layanan *</label>
              <select id="f-sv">${Object.entries(SV).map(([k, v]) => `<option value="${k}">${v[0]} · ${rp(v[1])}/kg</option>`).join('')}</select></div>
        <div class="fld">
          <label for="f-berat">Berat (kg) *</label>
          <input id="f-berat" type="text" inputmode="decimal" placeholder="3,5">
          <p class="err" id="e-berat" hidden></p></div></div></section>
        <section class="card">
          <h3>Pembayaran</h3>
          <div class="fld">
            <label id="l-bay">Waktu pembayaran *</label>
            <div class="seg" role="radiogroup" aria-labelledby="l-bay">
              <label>
              <input type="radio" name="waktu" value="ambil" checked><span>Bayar saat pengambilan</span></label>
              <label>
              <input type="radio" name="waktu" value="awal"><span>Bayar di awal</span></label></div></div>
          <div class="cols" id="w-bayar" hidden>
            <div class="fld">
              <label for="f-nom">Nominal bayar (Rp) *</label>
              <input id="f-nom" type="text" inputmode="numeric">
              <p class="err" id="e-nom" hidden></p></div>
            <div class="fld">
              <label for="f-met">Metode</label>
              <select id="f-met">
                <option>Tunai</option>
                <option>QRIS</option>
                <option>Transfer</option></select></div></div></section></div>
        <aside class="card" style="position:sticky;top:16px">
          <h3>Rincian biaya</h3>
          <div id="rb"></div>
          <button class="btn full" id="sv" type="submit" style="margin-top:16px">Simpan pesanan</button></aside></form>`;
}

const num = v => parseFloat(String(v).replace(/\./g, '').replace(',', '.'));

const numB = v => parseFloat(String(v).replace(',', '.'));

// Menghitung subtotal, ongkos antar, dan total dari isian formulir
function calc() {
    const b = numB($('#f-berat').value);
    const p = SV[$('#f-sv').value][1];
    const ad = document.querySelector('[name=ambil]:checked').value === 'antar';
    const sub = b > 0 ? b * p : 0;
    return { b, sub, ad: ad ? ANTAR : 0, total: sub + (ad ? ANTAR : 0) };
}

// Menampilkan rincian biaya di panel samping
function upRb() {
    const c = calc();
    $('#rb').innerHTML = `<div class="rb"><span>${SV[$('#f-sv').value][0]} × ${c.b > 0 ? c.b.toString().replace('.', ',') : 0} kg</span><span>${rp(c.sub)}</span></div>
        <div class="rb"><span>Ongkos antar</span><span>${rp(c.ad)}</span></div>
        <div class="rb t"><span>Total</span><span>${rp(c.total)}</span></div>`;
}

// Menampilkan / menghapus pesan error di bawah satu kolom
const setErr = (k, m) => {
    const e = $('#e-' + k);
    const f = e.closest('.fld');
    e.hidden = !m;
    e.textContent = m ? '⚠ ' + m : '';
    f.classList.toggle('bad', !!m);
    return !m;
};

// Memasang validasi, isi otomatis pelanggan lama, dan aksi Simpan
function bindForm() {
    const fm = $('#fm');
    upRb();
    fm.addEventListener('input', e => {
        upRb();
        const k = e.target.id.replace('f-', '');
        if ($('#e-' + k)) {
            setErr(k, '');
        }
    });
    fm.addEventListener('change', () => {
        $('#w-alamat').hidden = document.querySelector('[name=ambil]:checked').value !== 'antar';
        $('#w-bayar').hidden = document.querySelector('[name=waktu]:checked').value !== 'awal';
        upRb();
    });
    $('#f-wa').addEventListener('blur', () => {
        const v = $('#f-wa').value;
        if (!v) {
            return;
        }
        if (!validWa(v)) {
            setErr('wa', 'Nomor WhatsApp tidak valid. Contoh: 0812-3456-7801');
            return;
        }
        const c = cust(normWa(v));
        if (c) {
            if (!$('#f-nama').value || $('#f-nama').dataset.auto) {
                $('#f-nama').value = c.nama;
                $('#f-nama').dataset.auto = 1;
            }
            $('#h-wa').textContent = '✓ Pelanggan lama dikenali otomatis';
            if (c.alamat && !$('#f-alamat').value) {
                $('#f-alamat').value = c.alamat;
            }
        }
        else {
            $('#h-wa').textContent = 'Pelanggan baru. Isi nama untuk melanjutkan.';
        }
    });
    $('#f-nama').addEventListener('input', e => delete e.target.dataset.auto);
    fm.addEventListener('submit', e => {
        e.preventDefault();
        const ad = document.querySelector('[name=ambil]:checked').value === 'antar';
        const aw = document.querySelector('[name=waktu]:checked').value === 'awal';
        const c = calc();
        const chk = [['wa', validWa($('#f-wa').value), 'Nomor WhatsApp tidak valid. Contoh: 0812-3456-7801'], ['nama', $('#f-nama').value.trim(), 'Nama pelanggan wajib diisi'], ['alamat', !ad || $('#f-alamat').value.trim(), 'Alamat wajib diisi untuk pesanan diantar'], ['berat', c.b > 0, 'Berat harus lebih dari 0 kg']];
        let nom = 0;
        if (aw) {
            nom = num($('#f-nom').value);
            chk.push(['nom', nom > 0 && nom <= c.total, nom > c.total ? `Nominal melebihi total tagihan (${rp(c.total)})` : 'Nominal bayar wajib diisi']);
        }
        let first = null;
        chk.forEach(([k, ok, m]) => {
            if (!setErr(k, ok ? '' : m) && !first) {
                first = k;
            }
        });
        if (first) {
            $('#f-' + first).focus();
            return;
        }
        const b = $('#sv');
        b.disabled = true;
        b.innerHTML = '<span class="spin"></span>Menyimpan…';
        setTimeout(() => {
            const code = Math.random().toString(36).slice(2, 6).toUpperCase();
            const sv = $('#f-sv').value;
            mk(code, $('#f-nama').value.trim(), normWa($('#f-wa').value), sv, c.b, c.total, aw ? nom : 0, 0, 0, sv === 'sp' ? 3 : 2, { alamat: ad ? $('#f-alamat').value.trim() : '' });
            const o = orders.pop();
            orders.push(o);
            if (aw) {
                o.metode = $('#f-met').value;
            }
            showNota(o, true);
            route();
        }, 600);
    });
}

const notaB = (o, x) => `${x ? '<div class="banner">✓ Pesanan tersimpan</div>' : ''}
        <div class="card" style="box-shadow:none">
          <div class="b">${o.id}</div>
        <div class="cap">${fd(o.c, { day: 'numeric', month: 'long', year: 'numeric' })} · ${esc(o.nama)} · ${esc(o.wa)}</div>
        <div style="margin:12px 0">${SV[o.sv][0]} · ${String(o.berat).replace('.', ',')} kg${o.ambil === 'antar' ? ' · Diantar' : ''}</div>
        <div class="rb t"><span>Total</span><span>${rp(o.total)}</span></div>
        <div class="rb"><span>Dibayar</span><span>${rp(o.bayar)}</span></div>
        <div class="rb"><span>Sisa tagihan</span><span>${rp(sisa(o))}</span></div>
        <div class="cap">Perkiraan selesai ${fd(o.due)}</div></div>`;

// Menampilkan dialog nota digital
function showNota(o, fresh) {
    ask({
        title: fresh ? 'Nota digital' : 'Nota transaksi', body: notaB(o, fresh), extra: `<button class="btn o" data-act="print">Cetak</button>`, ok: '', cancel: '✕ Tutup'
    });
    $('#dlg .df>div:last-child').insertAdjacentHTML('beforeend', `<a class="btn wa" target="_blank" rel="noopener" href="${waLink(o, `Halo ${o.nama}, pesanan ${o.id} diterima. Total ${rp(o.total)}. Cek status: ${cekUrl()}`)}">Kirim nota via WA</a>${fresh ? '<a class="btn" href="#cucian" data-act="close">Lihat di daftar cucian</a>' : ''}`);
}