/* ════════════════════════════════════════════════════════════
   SARUNG ENDE — Tahap 4: Mesin keranjang + halaman keranjang
   Tersimpan di localStorage agar bertahan meski browser ditutup.
   [TAHAP 9] keranjang akan disinkronkan ke Firestore per pengguna.
================================================================ */

const CART_KEY = 'sarung-ende-cart';
const MAKS_QTY = 10;

let cart = [];
try { cart = JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { cart = []; }

function simpanCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateBadge();
  renderCartPage(); // render ulang bila sedang berada di halaman keranjang
}

function updateBadge() {
  const badge = document.getElementById('cart-count');
  if (!badge) return;
  badge.textContent = cart.reduce((a, c) => a + c.qty, 0);
}

/* ── Dipakai semua halaman (kartu produk & halaman detail) ── */
function addToCart(id, jumlah = 1) {
  const item = cart.find(c => c.id === id);
  if (item) item.qty = Math.min(MAKS_QTY, item.qty + jumlah);
  else cart.push({ id, qty: Math.min(MAKS_QTY, jumlah) });
  simpanCart();
  const p = PRODUCTS.find(x => x.id === id);
  showToast('✓ ' + p.nama + ' masuk keranjang');
}

function setQtyCart(id, qty) {
  if (qty > MAKS_QTY) { showToast('Maks. ' + MAKS_QTY + ' pcs per produk'); return; }
  if (qty <= 0) {
    cart = cart.filter(c => c.id !== id);
    showToast('🗑️ Produk dihapus dari keranjang');
  } else {
    const item = cart.find(c => c.id === id);
    if (item) item.qty = qty;
  }
  simpanCart();
}

function hapusItemCart(id) { setQtyCart(id, 0); }

function isiCart() {
  return cart
    .map(c => ({ qty: c.qty, produk: PRODUCTS.find(p => p.id === c.id) }))
    .filter(x => x.produk);
}

function totalCart() {
  return isiCart().reduce((a, x) => a + x.produk.harga * x.qty, 0);
}

/* ═══════════ HALAMAN KERANJANG (dirender hanya jika elemennya ada) ═══════════ */
function renderCartPage() {
  const wrap = document.getElementById('daftar-cart');
  if (!wrap) return;

  const items     = isiCart();
  const kosong    = document.getElementById('cart-kosong');
  const ringkasan = document.getElementById('ringkasan-cart');

  if (!items.length) {
    wrap.innerHTML = '';
    kosong.classList.remove('hidden');
    ringkasan.classList.add('hidden');
    return;
  }
  kosong.classList.add('hidden');
  ringkasan.classList.remove('hidden');

  wrap.innerHTML = items.map(x => `
    <div class="flex flex-col sm:flex-row sm:items-center gap-4 bg-white rounded-2xl shadow-card p-4">
      <img src="${x.produk.img}" alt="${x.produk.nama}" class="h-20 w-20 rounded-xl object-cover">
      <div class="flex-1 min-w-0">
        <p class="font-bold truncate">${x.produk.nama}</p>
        <p class="text-xs text-cocoa/55 mt-0.5">${MOTIFS[x.produk.motifKey]} · ${formatRupiah(x.produk.harga)}/pcs</p>
        <button onclick="hapusItemCart(${x.produk.id})" class="text-xs font-bold text-mengkudu hover:underline mt-2">
          <i class="fa-solid fa-trash-can mr-1"></i>Hapus
        </button>
      </div>
      <div class="flex items-center gap-2">
        <button onclick="setQtyCart(${x.produk.id}, ${x.qty - 1})" class="h-8 w-8 rounded-full border-2 border-cocoa/20 font-bold hover:bg-cocoa hover:text-ivory transition">−</button>
        <span class="w-6 text-center font-extrabold">${x.qty}</span>
        <button onclick="setQtyCart(${x.produk.id}, ${x.qty + 1})" class="h-8 w-8 rounded-full border-2 border-cocoa/20 font-bold hover:bg-cocoa hover:text-ivory transition">+</button>
      </div>
      <p class="sm:w-28 text-right font-extrabold text-laut-dark">${formatRupiah(x.produk.harga * x.qty)}</p>
    </div>`).join('');

  const totalQty = items.reduce((a, x) => a + x.qty, 0);
  document.getElementById('sum-item').textContent     = totalQty + ' pcs';
  document.getElementById('sum-subtotal').textContent = formatRupiah(totalCart());
  document.getElementById('sum-total').textContent    = formatRupiah(totalCart());
}

/* ── Checkout via WhatsApp (gerbang pembayaran online: tahap lanjut) ── */
function checkoutWA() {
  const items = isiCart();
  if (!items.length) { showToast('🛒 Keranjang masih kosong'); return; }

  const lines = items.map((x, i) =>
    (i + 1) + '. ' + x.produk.nama + ' — ' + x.qty + ' pcs × ' +
    formatRupiah(x.produk.harga) + ' = ' + formatRupiah(x.produk.harga * x.qty)).join('\n');

  const msg = encodeURIComponent(
    'Halo Admin Sarung Ende! Saya ingin memesan:\n' + lines +
    '\n\nTotal: ' + formatRupiah(totalCart()) +
    '\nMohon info ongkir & metode pembayaran (transfer/QRIS). Terima kasih 🙏');
  window.open('https://wa.me/' + WA_NUMBER + '?text=' + msg, '_blank');
}

/* ── Inisialisasi ── */
updateBadge();
renderCartPage();