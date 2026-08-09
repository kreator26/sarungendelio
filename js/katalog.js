/* ════════════════════════════════════════════════════════════
   SARUNG ENDE — Tahap 2: Logika halaman katalog
   Pencarian · filter kategori · filter motif · urutkan · URL share
================================================================ */

const state = { q: '', kat: 'semua', motif: 'semua', sort: 'unggulan' };

const elGrid   = document.getElementById('grid-katalog');
const elInfo   = document.getElementById('info-hasil');
const elKosong = document.getElementById('katalog-kosong');
const elCari   = document.getElementById('cari');
const elSort   = document.getElementById('urutkan');
const elMotif  = document.getElementById('motif');

/* ── Baca parameter URL (mis. ?q=naga&kat=sarung) ── */
function bacaURL() {
  const p = new URLSearchParams(location.search);
  state.q     = p.get('q')     ?? '';
  state.kat   = p.get('kat')   ?? 'semua';
  state.motif = p.get('motif') ?? 'semua';
  state.sort  = p.get('sort')  ?? 'unggulan';
}

/* ── Sinkronkan filter ke URL agar tautan bisa dibagikan ── */
function sinkronURL() {
  const p = new URLSearchParams();
  if (state.q)                  p.set('q', state.q);
  if (state.kat   !== 'semua')    p.set('kat', state.kat);
  if (state.motif !== 'semua')    p.set('motif', state.motif);
  if (state.sort  !== 'unggulan') p.set('sort', state.sort);
  const qs = p.toString();
  history.replaceState(null, '', location.pathname + (qs ? '?' + qs : ''));
}

/* ── Samakan tampilan kontrol dengan state ── */
function setKontrol() {
  elCari.value  = state.q;
  elSort.value  = state.sort;
  elMotif.value = state.motif;
  document.querySelectorAll('.chip-kat').forEach(c =>
    c.classList.toggle('chip-active', c.dataset.kat === state.kat));
}

/* ── Terapkan semua filter + urutan ── */
function hasil() {
  let arr = [...PRODUCTS];
  if (state.kat   !== 'semua') arr = arr.filter(p => p.kat === state.kat);
  if (state.motif !== 'semua') arr = arr.filter(p => p.motifKey === state.motif);
  if (state.q) {
    const q = state.q.toLowerCase();
    arr = arr.filter(p =>
      (p.nama + ' ' + MOTIFS[p.motifKey] + ' ' + LABEL_KAT[p.kat]).toLowerCase().includes(q));
  }
  switch (state.sort) {
    case 'harga-naik':  arr.sort((a, b) => a.harga - b.harga); break;
    case 'harga-turun': arr.sort((a, b) => b.harga - a.harga); break;
    case 'rating':      arr.sort((a, b) => b.rating - a.rating); break;
    case 'terlaris':    arr.sort((a, b) => b.terjual - a.terjual); break;
  }
  return arr;
}

/* ── Render grid + info + empty state ── */
function renderKatalog() {
  const arr = hasil();
  elGrid.innerHTML = arr.map(kartuProduk).join('');
  elInfo.innerHTML = `Menampilkan <b>${arr.length}</b> dari <b>${PRODUCTS.length}</b> produk`;
  elKosong.classList.toggle('hidden', arr.length > 0);
  elGrid.classList.toggle('hidden', arr.length === 0);
  sinkronURL();
}

/* ── Aksi filter (dipanggil dari tombol/chip di HTML) ── */
function pilihKat(kat) { state.kat = kat; setKontrol(); renderKatalog(); }
function resetFilter() {
  state.q = ''; state.kat = 'semua'; state.motif = 'semua'; state.sort = 'unggulan';
  setKontrol(); renderKatalog();
}

/* ── Event listener kontrol ── */
elCari.addEventListener('input',  e => { state.q = e.target.value.trim(); renderKatalog(); });
elSort.addEventListener('change', e => { state.sort  = e.target.value; renderKatalog(); });
elMotif.addEventListener('change', e => { state.motif = e.target.value; renderKatalog(); });

/* ── Inisialisasi ── */
bacaURL();
setKontrol();
renderKatalog();