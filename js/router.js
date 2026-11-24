//  6. ROUTER: pindah layar berdasarkan #hash di URL (#dashboard, #cucian, dst.)

const R = ['dashboard', 'pesanan-baru', 'cucian', 'laporan', 'cek-status'];

// Menampilkan layar sesuai #hash di URL lalu memasang event-nya
function route() {
    const r = R.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'dashboard';
    $('#app').innerHTML = r === 'cek-status' ? vCek() : shell(r, { dashboard: vDash, 'pesanan-baru': vForm, cucian: vList, laporan: vRep }[r]());
    if (r === 'pesanan-baru') {
        bindForm();
    }
    if (r === 'cucian') {
        bindList();
    }
    if (r === 'cek-status') {
        bindCek();
    }
    document.title = 'Erba Laundry';
}

addEventListener('hashchange', () => {
    route();
    scrollTo(0, 0);
});