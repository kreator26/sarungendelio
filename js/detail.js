/* ════════════════════════════════════════════════════════════
   SARUNG ENDE — Tahap 3: Logika halaman detail produk
   Membaca ?id=… lalu mengisi seluruh konten dari js/data.js
   [TAHAP 9] produk & ulasan diambil dari Firestore
================================================================ */

const WA_NUMBER = '628123456789'; // ← GANTI dengan nomor WhatsApp Anda

const params = new URLSearchParams(location.search);
const id     = parseInt(params.get('id'));
const produk = PRODUCTS.find(p => p.id === id);

let qty = 1;
let motifTerpilih = produk ? produk.motifKey : null;

/* ── Data ulasan statis ([TAHAP 9] dari Firestore) ── */
const ULASAN = [
  { nama: 'Rani W.', kota: 'Jakarta',    rating: 5, teks: 'Kualitas tenunnya autentik dan lembut di kulit. Motifnya terlihat lebih indah secara langsung.' },
  { nama: 'Budi T.', kota: 'Surabaya',   rating: 5, teks: 'Pengiriman cepat, kemasan elegan. Cocok sekali untuk hadiah keluarga.' },
  { nama: 'Dewi M.', kota: 'Yogyakarta', rating: 4, teks: 'Motifnya unik dan tidak pasaran — benar-benar karya seni yang layak dikoleksi.' }
];

/* ── Ikon bintang sesuai rating ── */
function bintang(r) {
  let s = '';
  const full = Math.floor(r), half = (r % 1) >= 0.5;
  for (let i = 0; i < full; i++) s += '<i class="fa-solid fa-star"></i>';
  if (half) s += '<i class="fa-solid fa-star-half-stroke"></i>';
  for (let i = full + (half ? 1 : 0); i < 5; i++) s += '<i class="fa-regular fa-star"></i>';
  return s;
}

/* ── Galeri foto ── */
function setFoto(el, src) {
  document.getElementById('foto-utama').src = src;
  document.querySelectorAll('#galeri-thumb button').forEach(b => b.classList.remove('ring-2', 'ring-emas'));
  el.classList.add('ring-2', 'ring-emas');
}

/* ── Pilihan motif ── */
function pilihMotif(k) {
  motifTerpilih = k;
  document.querySelectorAll('.motif-chip').forEach(c =>
    c.classList.toggle('chip-active', c.dataset.motif === k));
}

/* ── Jumlah barang ── */
function ubahQty(d) {
  qty = Math.min(10, Math.max(1, qty + d));
  document.getElementById('d-qty').textContent = qty;
}

/* ── Tab Deskripsi / Spesifikasi / Ulasan ── */
function showTab(idTab, btn) {
  document.querySelectorAll('.tabpane').forEach(p => p.classList.add('hidden'));
  document.getElementById(idTab).classList.remove('hidden');
  document.querySelectorAll('.tabbtn').forEach(b => {
    b.classList.remove('bg-emas', 'text-white');
    b.classList.add('bg-cocoa/10', 'text-cocoa');
  });
  btn.classList.add('bg-emas', 'text-white');
  btn.classList.remove('bg-cocoa/10', 'text-cocoa');
}

/* ── Keranjang & beli via WhatsApp ── */
function tambahKeranjang() { addToCart(produk.id, qty); }

function beliSekarang() {
  const msg = encodeURIComponent(
    'Halo Admin Sarung Ende! Saya ingin memesan:\n' +
    '• Produk : ' + produk.nama + '\n' +
    '• Motif  : ' + MOTIFS[motifTerpilih] + '\n' +
    '• Jumlah : ' + qty + ' pcs\n' +
    '• Total  : ' + formatRupiah(produk.harga * qty) + '\n' +
    'Mohon info ongkir ke alamat saya. Terima kasih 🙏'
  );
  window.open('https://wa.me/' + WA_NUMBER + '?text=' + msg, '_blank');
}

/* ── Produk terkait ── */
function renderTerkait() {
  const sekategori = PRODUCTS.filter(p => p.kat === produk.kat && p.id !== produk.id);
  const lainnya    = PRODUCTS.filter(p => p.kat !== produk.kat && p.id !== produk.id);
  document.getElementById('grid-terkait').innerHTML =
    [...sekategori, ...lainnya].slice(0, 4).map(kartuProduk).join('');
}

/* ── Jika id tidak ditemukan ── */
function notFound() {
  document.getElementById('konten-detail').innerHTML = `
    <div class="text-center py-24">
      <i class="fa-solid fa-box-open text-5xl text-cocoa/30"></i>
      <h1 class="font-serif text-2xl font-bold mt-4">Produk tidak ditemukan</h1>
      <p class="text-sm text-cocoa/55 mt-2">Produk yang Anda cari tidak ada atau sudah dihapus.</p>
      <a href="katalog.html" class="inline-block mt-6 rounded-full bg-laut text-ivory text-sm font-bold px-7 py-3 hover:bg-laut-dark transition">Kembali ke Katalog</a>
    </div>`;
  document.getElementById('sec-terkait').classList.add('hidden');
}

/* ── Inisialisasi halaman ── */
function initDetail() {
  if (!produk) { notFound(); return; }

  document.title = produk.nama + ' — Sarung Ende';
  document.getElementById('d-crumb').textContent     = produk.nama;
  document.getElementById('d-kategori').textContent  = LABEL_KAT[produk.kat];
  document.getElementById('d-nama').textContent      = produk.nama;
  document.getElementById('d-rating').innerHTML      = bintang(produk.rating);
  document.getElementById('d-rating-num').textContent = produk.rating + ' · ' + produk.terjual + ' terjual';
  document.getElementById('d-harga').textContent     = formatRupiah(produk.harga);

  /* Galeri: foto produk dulu, lalu foto lain sebagai pelengkap */
  const imgs = [produk.img, ...PRODUCTS.map(x => x.img).filter(u => u !== produk.img)].slice(0, 4);
  document.getElementById('foto-utama').src = imgs[0];
  document.getElementById('galeri-thumb').innerHTML = imgs.map((u, i) => `
    <button onclick="setFoto(this,'${u}')" class="rounded-xl overflow-hidden ${i === 0 ? 'ring-2 ring-emas' : ''}">
      <img src="${u}" alt="Galeri ${i + 1}" class="h-20 w-full object-cover">
    </button>`).join('');

  /* Chip motif */
  document.getElementById('d-motif').innerHTML = Object.entries(MOTIFS).map(([k, v]) => `
    <button data-motif="${k}" onclick="pilihMotif('${k}')"
            class="motif-chip rounded-xl border border-cocoa/15 bg-white px-4 py-2.5 text-xs font-bold ${k === motifTerpilih ? 'chip-active' : ''}">${v}</button>`).join('');

  /* Deskripsi */
  document.getElementById('d-deskripsi').textContent =
    produk.nama + ' ditenun sepenuhnya dengan tangan oleh pengrajin Ende–Lio, Nusa Tenggara Timur, dengan ' +
    MOTIFS[produk.motifKey].toLowerCase() +
    '. Menggunakan benang pilihan dan pewarna alam (nila & akar mengkudu), setiap helainya menyimpan cerita warisan leluhur. Cocok untuk ibadah, acara adat, hadiah, maupun koleksi fashion premium Anda.';

  /* Ulasan */
  document.getElementById('d-ulasan').innerHTML = ULASAN.map(u => `
    <div class="flex gap-3">
      <span class="h-10 w-10 rounded-full bg-laut text-ivory flex items-center justify-center font-bold shrink-0">${u.nama[0]}</span>
      <div>
        <p class="font-bold">${u.nama} — ${u.kota}
          <span class="text-emas ml-1">${'★'.repeat(u.rating)}${'☆'.repeat(5 - u.rating)}</span></p>
        <p class="text-cocoa/70 mt-0.5">${u.teks}</p>
      </div>
    </div>`).join('');

  renderTerkait();
}

initDetail();