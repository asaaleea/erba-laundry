// daftar-cucian.js — FITUR Layar 3: Daftar Cucian & Status

// ===== LAYAR 3: DAFTAR CUCIAN =====
// fltOrders = saring data | rowActs = tombol aksi per baris | tbl = isi tabel | setStage = ubah tahap + catat riwayat
// Menyaring pesanan sesuai pencarian dan filter
const fltOrders = () => orders.filter(o => {
    const q = flt.q.toLowerCase();
    return (!q || [o.nama, o.wa, o.id].some(s => s.toLowerCase().includes(q))) && (flt.st === '' || (flt.st === 'x' ? o.done : !o.done && o.stage === +flt.st)) && (!flt.pay || payS(o)[0] === flt.pay);
}).sort((a, b) => a.done - b.done || a.due - b.due);

// Tombol aksi di setiap baris tabel (tergantung status pesanan)
function rowActs(o) {
    if (o.done) {
        return '<span class="cap">Selesai diserahkan</span>';
    }
    // Tombol utama (berwarna) di atas selebar kolom, tombol tambahan (garis) di bawahnya 2 kolom
    let utama = '';
    let lain = '';
    if (o.stage < 4) {
        utama += `<button class="btn sm" data-act="next" data-id="${o.id}">Jadikan ${ST[o.stage + 1].toLowerCase()}</button>`;
    }
    // Tombol WA baru muncul setelah cucian Selesai
    if (o.stage === 4) {
        utama += `<button class="btn wa sm" data-act="wa" data-id="${o.id}">${o.ws === 'Gagal' ? 'Kirim ulang WA' : 'Kabari via WA'}</button>`;
    }
    let info = '';
    if (o.ws === 'Terkirim') {
        info = badge('WA terkirim', 'ok', '✓');
    }
    if (o.ws === 'Gagal') {
        info = badge('WA gagal terkirim', 'er', '⚠');
    }
    if (sisa(o) > 0) {
        lain += `<button class="btn o sm" data-act="pay" data-id="${o.id}">Catat bayar</button>`;
    }
    if (o.stage === 4) {
        lain += `<button class="btn o sm" data-act="take" data-id="${o.id}">Tandai diambil</button>`;
    }
    if (o.stage > 0) {
        lain += `<button class="btn o sm" data-act="fix" data-id="${o.id}">Koreksi status</button>`;
    }
    return `<div class="row-acts">${utama}${lain}</div>${info ? `<div class="wa-info">${info}</div>` : ''}`;
}

// Mengisi isi tabel Daftar Cucian
function tbl() {
    const L = fltOrders();
    $('#cnt').textContent = L.length + ' pesanan';
    $('#tb').innerHTML = L.map(o => `<tr>
          <td>
          <div class="b">${o.id}</div>
        <div class="cap">${fd(o.c)}</div></td>
        <td>${esc(o.nama)}
        <div class="cap">${esc(o.wa)}</div></td>
        <td>${SV[o.sv][0]}
        <div class="cap">${String(o.berat).replace('.', ',')} kg</div></td>
        <td>${stB(o)}${o.done ? '' : `<div class="cap">${o.due < 0 && o.stage < 4 ? '<span class="late">⚠ Lewat tenggat</span>' : 'Tenggat ' + (o.due === 0 ? 'hari ini' : fd(o.due))}</div>`}</td>
        <td>${payB(o)}${sisa(o) > 0 ? `<div class="cap">Sisa ${rp(sisa(o))}</div>` : ''}</td>
        <td>${rowActs(o)}</td></tr>`).join('') || '<tr><td colspan="6" class="cap">Tidak ada pesanan yang cocok dengan filter.</td></tr>';
}

// Membuat HTML Layar 3: Daftar Cucian
function vList() {
    return phead('Daftar cucian', '<span id="cnt"></span>', '<a class="btn" href="#pesanan-baru">+ Pesanan baru</a>') +
        `<section class="card">
          <search class="filters" role="search">
            <input id="q" type="text" placeholder="Cari nama, no. WA, atau no. pesanan" aria-label="Cari pesanan" value="${esc(flt.q)}">
        <select id="fs" aria-label="Filter status">
          <option value="">Semua status</option>${ST.map((s, i) => `<option value="${i}" ${flt.st == i && flt.st !== '' ? 'selected' : ''}>${s}</option>`).join('')}
        <option value="x" ${flt.st === 'x' ? 'selected' : ''}>Diserahkan</option></select>
        <select id="fp" aria-label="Filter pembayaran">
          <option value="">Semua pembayaran</option>${['Lunas', 'Dibayar sebagian', 'Belum dibayar'].map(s => `<option ${flt.pay === s ? 'selected' : ''}>${s}</option>`).join('')}</select></search>
        <div class="scroll">
          <table class="tbl-cucian">
            <thead>
              <tr>
                <th>Pesanan</th>
                <th>Pelanggan</th>
                <th>Layanan</th>
                <th>Status &amp; tenggat</th>
                <th>Pembayaran</th>
                <th>Aksi</th></tr></thead>
            <tbody id="tb"></tbody></table></div></section>`;
}

// Memasang kotak pencarian dan filter
function bindList() {
    tbl();
    $('#q').oninput = e => {
        flt.q = e.target.value;
        tbl();
    };
    $('#fs').onchange = e => {
        flt.st = e.target.value;
        tbl();
    };
    $('#fp').onchange = e => {
        flt.pay = e.target.value;
        tbl();
    };
}

const get = id => orders.find(o => o.id === id);

// Mengubah tahap pesanan dan mencatatnya di riwayat
function setStage(o, n, txt) {
    o.stage = n;
    o.log.push([now(), txt]);
    if (n < 4) {
        o.ws = null;
    }
}

// ----- Aksi tombol untuk fitur ini (didaftarkan ke objek A di shared.js) -----
// next = ubah status | fix = koreksi status | wa = kabari via WhatsApp | pay = catat pembayaran | take = tandai diambil
Object.assign(A, {
    next: d => {
        const o = get(d.id);
        const n = o.stage + 1;
        ask({
            title: `Ubah status ${o.id} menjadi ${ST[n]}?`, body: `<p>${ST[o.stage]} → ${ST[n]}. Perubahan dicatat beserta waktu dan nama petugas di riwayat pesanan.</p>`, ok: 'Ya, ubah status', onOk: () => {
                setStage(o, n, `Status: ${ST[n]} (oleh Petugas)`);
                route();
                toast('Status diperbarui');
            }
        });
    },
    fix: d => {
        const o = get(d.id);
        const p = o.stage - 1;
        ask({
            title: `Koreksi status ${o.id} kembali ke ${ST[p]}?`, body: `<p>Status kembali ke tahap sebelumnya dan tercatat sebagai koreksi beserta alasan Anda.</p>
        <div class="fld" style="margin-top:16px">
          <label for="why">Alasan koreksi *</label>
          <textarea id="why"></textarea></div>`, ok: 'Ya, koreksi status', danger: 1, onOk: () => {
                const w = $('#why').value.trim();
                if (!w) {
                    derr('Alasan koreksi wajib diisi');
                    return false;
                }
                setStage(o, p, `Koreksi ke ${ST[p]}: ${w}`);
                route();
                toast('Status dikoreksi');
            }
        });
    },
    wa: d => {
        const o = get(d.id);
        window.open(waLink(o, waDone(o)), '_blank', 'noopener');
        o.ws = validWa(o.wa) && o.wa !== '081234567807' ? 'Terkirim' : 'Gagal';
        tbl();
        toast(o.ws === 'Terkirim' ? 'Pesan terkirim' : 'Pesan gagal terkirim. Periksa nomor lalu kirim ulang.');
    },
    pay: d => {
        const o = get(d.id);
        ask({
            title: `Catat pembayaran ${o.id}`, body: `<p class="cap">Sisa tagihan ${rp(sisa(o))}</p>
        <div class="cols" style="margin-top:12px">
          <div class="fld">
            <label for="pn">Jumlah (Rp) *</label>
            <input id="pn" type="text" inputmode="numeric" value="${sisa(o)}"></div>
        <div class="fld">
          <label for="pm">Metode</label>
          <select id="pm">
            <option>Tunai</option>
            <option>QRIS</option>
            <option>Transfer</option></select></div></div>`, ok: 'Simpan pembayaran', onOk: () => {
                const n = num($('#pn').value);
                if (!(n > 0)) {
                    derr('Jumlah wajib diisi');
                    return false;
                }
                if (n > sisa(o)) {
                    derr(`Jumlah melebihi sisa tagihan ${rp(sisa(o))}`);
                    return false;
                }
                o.bayar += n;
                o.log.push([now(), `Pembayaran ${rp(n)} (${$('#pm').value})`]);
                tbl();
                toast('Pembayaran dicatat');
            }
        });
    },
    take: d => {
        const o = get(d.id);
        ask({
            title: `Tandai ${o.id} sudah diambil/diantar?`, body: sisa(o) > 0 ? `<p><b style="color:var(--er)">⚠ Masih ada sisa tagihan ${rp(sisa(o))}</b> — tetap tandai sudah diambil?</p>` : '<p>Pesanan dicatat sebagai diserahkan ke pelanggan.</p>', ok: 'Ya, tandai diambil', onOk: () => {
                o.done = true;
                o.log.push([now(), 'Diserahkan ke pelanggan']);
                tbl();
                toast('Pesanan diserahkan');
            }
        });
    }
});