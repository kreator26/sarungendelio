/* ════════════════════════════════════════════════════════════
   SARUNG ENDE — Tahap 6: Logika Dashboard Penjual
================================================================ */

/* ── Proteksi Halaman: Hanya untuk Penjual ── */
const user = currentUser();
if (!user || user.peran !== 'penjual') {
  alert('⛔ Akses Ditolak. Halaman ini khusus untuk Penjual.');
  location.href = 'login.html?mode=masuk';
} else {
  // Isi data user di sidebar
  document.getElementById('user-name').textContent = user.nama;
  document.getElementById('user-email').textContent = user.email;
  document.getElementById('user-avatar').textContent = user.nama.charAt(0).toUpperCase();
}

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

renderPesanan();