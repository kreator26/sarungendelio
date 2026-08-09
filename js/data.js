/* ════════════════════════════════════════════════════════════
   SARUNG ENDE — Data bersama (dipakai semua halaman)
   [TAHAP 9] Array PRODUCTS diganti query Firestore:
             db.collection('products')
================================================================ */

const LABEL_KAT = {
  sarung:    'Sarung Tenun',
  kain:      'Kain Ikat',
  selendang: 'Selendang & Lawe',
  kemeja:    'Kemeja Tenun'
};

const MOTIFS = {
  'naga':       'Motif Naga',
  'kuda':       'Motif Kuda (Ndara)',
  'mata-manuk': 'Motif Mata Manuk',
  'wela':       'Motif Bunga (Wela)',
  'kupu':       'Motif Kupu-Kupu',
  'geometris':  'Motif Geometris Lio'
};

const PRODUCTS = [
  { id: 1,  nama: 'Sarung Tenun Ende Premium', motifKey: 'naga',       kat: 'sarung',    harga: 350000, rating: 4.9, terjual: 128, img: 'img/produk-lipat.jpg', badge: 'Best Seller' },
  { id: 2,  nama: 'Sarung Ikat Indigo Biru',   motifKey: 'wela',       kat: 'sarung',    harga: 275000, rating: 4.8, terjual: 96,  img: 'img/produk-biru.jpg',  badge: '' },
  { id: 3,  nama: 'Sarung Sutra Emas Marun',   motifKey: 'kupu',       kat: 'sarung',    harga: 425000, rating: 5.0, terjual: 54,  img: 'img/produk-marun.jpg', badge: 'Premium' },
  { id: 4,  nama: 'Kain Ikat Mata Manuk',      motifKey: 'mata-manuk', kat: 'kain',      harga: 195000, rating: 4.7, terjual: 73,  img: 'img/hero.jpg',         badge: '' },
  { id: 5,  nama: 'Selendang Lawe Nila',       motifKey: 'geometris',  kat: 'selendang', harga: 150000, rating: 4.8, terjual: 61,  img: 'img/produk-biru.jpg',  badge: '' },
  { id: 6,  nama: 'Kemeja Tenun Ende',         motifKey: 'naga',       kat: 'kemeja',    harga: 310000, rating: 4.9, terjual: 40,  img: 'img/produk-marun.jpg', badge: 'Baru' },
  { id: 7,  nama: 'Sarung Kuda Ndara',         motifKey: 'kuda',       kat: 'sarung',    harga: 385000, rating: 4.9, terjual: 47,  img: 'img/produk-marun.jpg', badge: '' },
  { id: 8,  nama: 'Kain Ikat Wela Rosa',       motifKey: 'wela',       kat: 'kain',      harga: 225000, rating: 4.6, terjual: 58,  img: 'img/hero.jpg',         badge: '' },
  { id: 9,  nama: 'Selendang Mata Manuk Krem', motifKey: 'mata-manuk', kat: 'selendang', harga: 165000, rating: 4.7, terjual: 33,  img: 'img/produk-lipat.jpg', badge: '' },
  { id: 10, nama: 'Kemeja Tenun Geometris',    motifKey: 'geometris',  kat: 'kemeja',    harga: 295000, rating: 4.8, terjual: 29,  img: 'img/produk-biru.jpg',  badge: '' },
  { id: 11, nama: 'Sarung Naga Laut',          motifKey: 'naga',       kat: 'sarung',    harga: 340000, rating: 4.8, terjual: 66,  img: 'img/produk-biru.jpg',  badge: '' },
  { id: 12, nama: 'Kain Sutra Kupu-Kupu',      motifKey: 'kupu',       kat: 'kain',      harga: 465000, rating: 5.0, terjual: 21,  img: 'img/produk-marun.jpg', badge: 'Premium' }
];

/* ── Utilitas ── */
function formatRupiah(n) { return 'Rp ' + n.toLocaleString('id-ID'); }

/* ── Template kartu produk (dipakai homepage & katalog) ── */
function kartuProduk(p) {
  return `
  <div class="bg-white rounded-2xl shadow-card overflow-hidden group flex flex-col">
    <button onclick="openDetail(${p.id})" class="relative overflow-hidden">
      <img src="${p.img}" alt="${p.nama}" class="h-60 w-full object-cover group-hover:scale-105 transition duration-500">
      ${p.badge ? `<span class="absolute top-3 left-3 bg-mengkudu text-ivory text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">${p.badge}</span>` : ''}
    </button>
    <div class="p-5 flex flex-col gap-1 flex-1">
      <span class="text-[10px] font-extrabold uppercase tracking-widest text-emas-dark">${LABEL_KAT[p.kat]}</span>
      <button onclick="openDetail(${p.id})" class="text-left font-bold leading-snug hover:text-mengkudu transition">${p.nama}</button>
      <p class="text-xs text-cocoa/55">${MOTIFS[p.motifKey]}</p>
      <p class="text-xs text-cocoa/55"><i class="fa-solid fa-star text-emas"></i> ${p.rating} · ${p.terjual} terjual</p>
      <div class="mt-auto pt-4 flex items-center justify-between">
        <span class="font-extrabold text-laut-dark">${formatRupiah(p.harga)}</span>
        <button onclick="addToCart(${p.id})" title="Tambah ke keranjang"
                class="h-9 w-9 rounded-full bg-laut text-ivory hover:bg-mengkudu transition">
          <i class="fa-solid fa-plus text-sm"></i>
        </button>
      </div>
    </div>
  </div>`;
}