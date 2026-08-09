/* ════════════════════════════════════════════════════════════
   SARUNG ENDE — Logika global & homepage
   Data produk & kartu kini di js/data.js (dipakai semua halaman)
================================================================ */

/* ── Keranjang sederhana (disempurnakan di Tahap 4) ── */
let cartCount = 0;
function addToCart(id) {
  cartCount++;
  const badge = document.getElementById('cart-count');
  if (badge) badge.textContent = cartCount;
  const p = PRODUCTS.find(x => x.id === id);
  showToast('✓ ' + p.nama + ' masuk keranjang');
}

/* ── Notifikasi toast ── */
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.remove('opacity-0', 'translate-y-4');
  t.classList.add('opacity-100', 'translate-y-0');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    t.classList.add('opacity-0', 'translate-y-4');
    t.classList.remove('opacity-100', 'translate-y-0');
  }, 2300);
}

/* ── [TAHAP 3] Halaman detail produk ── */
function openDetail(id) {
  showToast('📄 Halaman detail produk — Tahap 3');
}

/* ── Homepage: katalog unggulan ── */
function renderProducts(filter = 'semua') {
  const grid = document.getElementById('grid-produk');
  if (!grid) return;
  const data = filter === 'semua' ? PRODUCTS : PRODUCTS.filter(p => p.kat === filter);
  grid.innerHTML = data.map(kartuProduk).join('');
}

/* ── Filter kategori dari kartu & chip homepage ── */
function filterKat(kat, chip) {
  if (chip) {
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('chip-active'));
    chip.classList.add('chip-active');
  } else {
    document.getElementById('katalog')?.scrollIntoView();
    document.querySelectorAll('#katalog .chip').forEach(c => {
      c.classList.toggle('chip-active', c.textContent.trim().toLowerCase().includes(kat) || (kat === 'semua' && c.textContent.trim() === 'Semua'));
    });
  }
  renderProducts(kat);
}

/* ── Inisialisasi homepage ── */
if (document.getElementById('grid-produk')) renderProducts();