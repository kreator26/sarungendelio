/* ════════════════════════════════════════════════════════════
   SARUNG ENDE — Logika aplikasi (Tahap 1: Homepage)
   [TAHAP 9] Array PRODUCTS akan diganti query Firestore:
             db.collection('products')
================================================================ */

const PRODUCTS = [
  { id: 1, nama: 'Sarung Tenun Ende Premium', motif: 'Motif Naga & Kuda',   kat: 'sarung',    harga: 350000, rating: 4.9, terjual: 128, img: 'img/produk-lipat.jpg', badge: 'Best Seller' },
  { id: 2, nama: 'Sarung Ikat Indigo Biru',   motif: 'Motif Bunga (Wela)',  kat: 'sarung',    harga: 275000, rating: 4.8, terjual: 96,  img: 'img/produk-biru.jpg',  badge: '' },
  { id: 3, nama: 'Sarung Sutra Emas Marun',   motif: 'Motif Kupu-Kupu',     kat: 'sarung',    harga: 425000, rating: 5.0, terjual: 54,  img: 'img/produk-marun.jpg', badge: 'Premium' },
  { id: 4, nama: 'Kain Ikat Mata Manuk',      motif: 'Motif Mata Manuk',    kat: 'kain',      harga: 195000, rating: 4.7, terjual: 73,  img: 'img/hero.jpg',         badge: '' },
  { id: 5, nama: 'Selendang Lawe Nila',       motif: 'Motif Geometris Lio', kat: 'selendang', harga: 150000, rating: 4.8, terjual: 61,  img: 'img/produk-biru.jpg',  badge: '' },
  { id: 6, nama: 'Kemeja Tenun Ende',         motif: 'Patchwork Motif Naga',kat: 'kemeja',    harga: 310000, rating: 4.9, terjual: 40,  img: 'img/produk-marun.jpg', badge: 'Baru' }
];

const LABEL_KAT = {
  sarung:    'Sarung Tenun',
  kain:      'Kain Ikat',
  selendang: 'Selendang & Lawe',
  kemeja:    'Kemeja Tenun'
};

/* ── Render grid katalog unggulan ── */
function renderProducts(filter = 'semua') {
  const data = filter === 'semua' ? PRODUCTS : PRODUCTS.filter(p => p.kat === filter);

  document.getElementById('grid-produk').innerHTML = data.map(p => `
    <div class="bg-white rounded-2xl shadow-card overflow-hidden group flex flex-col">
      <button onclick="openDetail(${p.id})" class="relative overflow-hidden">
        <img src="${p.img}" alt="${p.nama}" class="h-60 w-full object-cover group-hover:scale-105 transition duration-500">
        ${p.badge ? `<span class="absolute top-3 left-3 bg-mengkudu text-ivory text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">${p.badge}</span>` : ''}
      </button>
      <div class="p-5 flex flex-col gap-1 flex-1">
        <span class="text-[10px] font-extrabold uppercase tracking-widest text-emas-dark">${LABEL_KAT[p.kat]}</span>
        <button onclick="openDetail(${p.id})" class="text-left font-bold leading-snug hover:text-mengkudu transition">${p.nama}</button>
        <p class="text-xs text-cocoa/55">${p.motif}</p>
        <p class="text-xs text-cocoa/55"><i class="fa-solid fa-star text-emas"></i> ${p.rating} · ${p.terjual} terjual</p>
        <div class="mt-auto pt-4 flex items-center justify-between">
          <span class="font-extrabold text-laut-dark">Rp ${p.harga.toLocaleString('id-ID')}</span>
          <button onclick="addToCart(${p.id})" title="Tambah ke keranjang"
                  class="h-9 w-9 rounded-full bg-laut text-ivory hover:bg-mengkudu transition">
            <i class="fa-solid fa-plus text-sm"></i>
          </button>
        </div>
      </div>
    </div>`).join('');
}

/* ── Filter kategori (dipakai chip filter & kartu kategori) ── */
function filterKat(kat, chip) {
  if (chip) {
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('chip-active'));
    chip.classList.add('chip-active');
  } else {
    // Dipanggil dari kartu kategori: scroll ke katalog & aktifkan chip yang cocok
    document.getElementById('katalog').scrollIntoView();
    document.querySelectorAll('.chip').forEach(c => {
      c.classList.toggle('chip-active', c.textContent.trim().toLowerCase().includes(kat) || (kat === 'semua' && c.textContent.trim() === 'Semua'));
    });
  }
  renderProducts(kat);
}

/* ── [TAHAP 3] Halaman detail produk ── */
function openDetail(id) {
  showToast('📄 Halaman detail produk — Tahap 3');
}

/* ── [TAHAP 4] Keranjang belanja sesungguhnya (localStorage + Firestore) ── */
let cartCount = 0;
function addToCart(id) {
  cartCount++;
  document.getElementById('cart-count').textContent = cartCount;
  const p = PRODUCTS.find(x => x.id === id);
  showToast('✓ ' + p.nama + ' masuk keranjang');
}

/* ── Notifikasi toast ── */
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.remove('opacity-0', 'translate-y-4');
  t.classList.add('opacity-100', 'translate-y-0');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    t.classList.add('opacity-0', 'translate-y-4');
    t.classList.remove('opacity-100', 'translate-y-0');
  }, 2300);
}

/* ── Inisialisasi saat halaman dimuat ── */
renderProducts();