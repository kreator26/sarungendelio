/* ════════════════════════════════════════════════════════════
   SARUNG ENDE — Tahap 6: Logika Dashboard Penjual (Updated: WaitForAuth)
================================================================ */

/* ── Data Pesanan Dummy (Nanti dari Firestore) ── */
const PESANAN = [
  { id: 'INV-1024', pembeli: 'Budi Santoso', item: 'Sarung Tenun Premium', total: 350000, status: 'Perlu Dikemas', warna: 'bg-emas text-laut-deep' },
  { id: 'INV-1023', pembeli: 'Siti Aminah', item: 'Kain Ikat Indigo',      total: 275000, status: 'Dikirim',     warna: 'bg-laut text-ivory' },
  { id: 'INV-1022', pembeli: 'Andi Pratama', item: 'Selendang Lawe',       total: 150000, status: 'Selesai',     warna: 'bg-green-100 text-green-800' }
];

/* ── Render List Pesanan ── */
function renderPesanan() {
  const list = document.getElementById('list-pesanan');
  if(!list) return;
  
  list.innerHTML = PESANAN.map(p => `
    <li class="flex justify-between items-center pb-3 border-b border-cocoa/5 last:border-0">
      <div>
        <p class="font-bold text-sm">${p.pembeli}</p>
        <p class="text-xs text-cocoa/50">${p.id} · ${p.item}</p>
      </div>
      <div class="text-right">
        <p class="font-bold text-sm text-laut-dark">${formatRupiah(p.total)}</p>
        <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${p.warna}">${p.status}</span>
      </div>
    </li>
  `).join('');
}

/* ── Render Tabel Produk & Aksi Hapus ── */
function renderTabelProduk() {
  const tbody = document.getElementById('tabel-produk');
  if (!tbody) return;
  
  tbody.innerHTML = PRODUCTS.map(p => `
    <tr class="hover:bg-sand/20 transition">
      <td class="px-4 py-3 flex items-center gap-3">
        <img src="${p.img}" class="h-10 w-10 rounded-lg object-cover">
        <div>
          <p class="font-bold text-sm">${p.nama}</p>
          <p class="text-xs text-cocoa/50">${MOTIFS[p.motifKey]}</p>
        </div>
      </td>
      <td class="px-4 py-3 text-xs">${LABEL_KAT[p.kat]}</td>
      <td class="px-4 py-3 font-bold text-laut-dark">${formatRupiah(p.harga)}</td>
      <td class="px-4 py-3 text-right space-x-3">
        <a href="tambah-produk.html?id=${p.id}" class="text-emas hover:underline font-bold text-xs"><i class="fa-solid fa-pen-to-square"></i> Edit</a>
        <button onclick="konfirmasiHapus(${p.id})" class="text-mengkudu hover:underline font-bold text-xs"><i class="fa-solid fa-trash"></i> Hapus</button>
      </td>
    </tr>
  `).join('');
}

function konfirmasiHapus(id) {
  if (confirm('Yakin ingin menghapus produk ini dari toko?')) {
    hapusProduk(id);
    showToast('🗑️ Produk berhasil dihapus.');
    renderTabelProduk();
    // Update stat produk dinamis
    const statProduk = document.getElementById('stat-produk');
    if (statProduk) statProduk.textContent = PRODUCTS.length;
  }
}

/* ── Proteksi Halaman & Inisialisasi dengan WaitForAuth ── */
waitForAuth(() => {
  const user = currentUser();
  
  // Proteksi: Hanya untuk Penjual
  if (!user || user.peran !== 'penjual') {
    alert('⛔ Akses Ditolak. Halaman ini khusus untuk Penjual.');
    location.href = 'login.html?mode=masuk';
    return;
  }

  // Isi data user di sidebar
  document.getElementById('user-name').textContent = user.nama;
  document.getElementById('user-email').textContent = user.email;
  document.getElementById('user-avatar').textContent = user.nama.charAt(0).toUpperCase();

  // Render data dashboard setelah auth valid
  renderPesanan();
  renderTabelProduk();

  // Update statistik produk dinamis (Card 3)
  const statProduk = document.getElementById('stat-produk');
  if (statProduk) statProduk.textContent = PRODUCTS.length;
});
