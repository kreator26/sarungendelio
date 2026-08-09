/* ════════════════════════════════════════════════════════════
   SARUNG ENDE — Tahap 8: Mesin Pesanan & Halaman Kelola
   (Updated: WaitForAuth untuk stabilitas Firebase)
================================================================ */

const ORDERS_KEY = 'sarung-ende-orders';
const STATUS = {
  menunggu: { label: 'Menunggu Konfirmasi', warna: 'bg-emas/15 text-emas-dark',      ikon: 'fa-clock' },
  dikemas:  { label: 'Sedang Dikemas',      warna: 'bg-mengkudu/10 text-mengkudu',   ikon: 'fa-box' },
  dikirim:  { label: 'Dalam Pengiriman',    warna: 'bg-laut/10 text-laut',           ikon: 'fa-truck' },
  selesai:  { label: 'Selesai',             warna: 'bg-green-100 text-green-700',    ikon: 'fa-check-circle' },
  batal:    { label: 'Dibatalkan',          warna: 'bg-red-100 text-red-600',        ikon: 'fa-xmark-circle' }
};

let orders = [];
try { orders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || []; } catch(e) { orders = []; }

/* ── Seed dummy data agar UI hidup saat pertama kali dibuka ── */
function seedOrders() {
  if (orders.length > 0) return;
  const today = new Date();
  const daysAgo = n => { const d = new Date(today); d.setDate(d.getDate()-n); return d.toISOString(); };
  orders = [
    { id:'INV-1024', tanggal: daysAgo(0), pembeli:{nama:'Budi Santoso',  hp:'081234567890', alamat:'Jl. Merdeka 10, Jakarta'}, items:[{produkId:1, nama:'Sarung Tenun Ende Premium', qty:1, harga:350000}], total:350000, status:'menunggu', resi:'', catatan:'Mohon cepat, untuk acara Jumat.' },
    { id:'INV-1023', tanggal: daysAgo(1), pembeli:{nama:'Siti Aminah',   hp:'082198765432', alamat:'Jl. Sudirman 55, Surabaya'}, items:[{produkId:2, nama:'Sarung Ikat Indigo Biru', qty:2, harga:275000}], total:550000, status:'dikirim', resi:'JX1234567890', catatan:'' },
    { id:'INV-1022', tanggal: daysAgo(3), pembeli:{nama:'Andi Pratama',  hp:'085612349876', alamat:'Jl. Malioboro 22, Yogyakarta'}, items:[{produkId:5, nama:'Selendang Lawe Nila', qty:1, harga:150000}], total:150000, status:'selesai', resi:'JP9988776655', catatan:'' },
    { id:'INV-1021', tanggal: daysAgo(5), pembeli:{nama:'Dewi Lestari',  hp:'081399887766', alamat:'Jl. Asia Afrika 8, Bandung'}, items:[{produkId:3, nama:'Sarung Sutra Emas Marun', qty:1, harga:425000},{produkId:6, nama:'Kemeja Tenun Ende', qty:1, harga:310000}], total:735000, status:'dikemas', resi:'', catatan:'Kado ulang tahun' },
    { id:'INV-1020', tanggal: daysAgo(7), pembeli:{nama:'Rudi Hartono',  hp:'087855667788', alamat:'Jl. Gatot Subroto 12, Medan'}, items:[{produkId:4, nama:'Kain Ikat Mata Manuk', qty:3, harga:195000}], total:585000, status:'selesai', resi:'SI1122334455', catatan:'' }
  ];
  simpanOrders();
}

function simpanOrders() { localStorage.setItem(ORDERS_KEY, JSON.stringify(orders)); }

function formatTanggal(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' });
}

/* ── State filter ── */
let filterStatus = 'semua';
let filterQ = '';

function applyFilter(arr) {
  let out = [...arr];
  if (filterStatus !== 'semua') out = out.filter(o => o.status === filterStatus);
  if (filterQ) {
    const q = filterQ.toLowerCase();
    out = out.filter(o =>
      o.id.toLowerCase().includes(q) ||
      o.pembeli.nama.toLowerCase().includes(q) ||
      o.items.some(i => i.nama.toLowerCase().includes(q)));
  }
  return out.sort((a,b) => new Date(b.tanggal) - new Date(a.tanggal));
}

/* ── Hitung jumlah per status (untuk badge di chip) ── */
function updateCounts() {
  const c = { semua: orders.length, menunggu:0, dikemas:0, dikirim:0, selesai:0 };
  orders.forEach(o => { if (c[o.status] !== undefined) c[o.status]++; });
  Object.keys(c).forEach(k => {
    const el = document.getElementById('cnt-'+k);
    if (el) el.textContent = c[k];
  });
}

/* ── Render daftar pesanan ── */
function renderList() {
  const list   = document.getElementById('list-pesanan-full');
  const kosong = document.getElementById('pesanan-kosong');
  if (!list) return;
  const data   = applyFilter(orders);

  if (!data.length) {
    list.innerHTML = '';
    kosong.classList.remove('hidden');
    return;
  }
  kosong.classList.add('hidden');

  list.innerHTML = data.map(o => {
    const st = STATUS[o.status];
    const itemSummary = o.items.map(i => `${i.nama} ×${i.qty}`).join(', ');
    return `
    <div class="bg-white rounded-2xl shadow-card p-5 hover:shadow-lg transition">
      <div class="flex flex-col md:flex-row md:items-center gap-4">
        <div class="flex-1 min-w-0">
          <div class="flex flex-wrap items-center gap-2 mb-1">
            <span class="font-mono font-bold text-laut-dark">${o.id}</span>
            <span class="text-xs ${st.warna} px-2 py-0.5 rounded-full font-bold">
              <i class="fa-solid ${st.ikon} mr-1"></i>${st.label}
            </span>
            <span class="text-xs text-cocoa/50">${formatTanggal(o.tanggal)}</span>
          </div>
          <p class="font-bold">${o.pembeli.nama} <span class="text-cocoa/50 font-normal text-sm">· ${o.pembeli.hp}</span></p>
          <p class="text-xs text-cocoa/60 truncate mt-0.5">${itemSummary}</p>
        </div>
        <div class="text-left md:text-right md:w-48 shrink-0">
          <p class="font-extrabold text-laut-dark text-lg">${formatRupiah(o.total)}</p>
          <div class="flex gap-2 mt-2">
            <button onclick="bukaModal('${o.id}')" class="flex-1 text-xs font-bold border border-cocoa/15 rounded-full px-3 py-1.5 hover:border-emas transition">Detail</button>
            <button onclick="hapusPesanan('${o.id}')" class="text-xs font-bold text-mengkudu px-3 py-1.5 hover:underline"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
      </div>
    </div>`;
  }).join('');
}

/* ── Modal Detail ── */
function bukaModal(id) {
  const o = orders.find(x => x.id === id);
  if (!o) return;
  const st = STATUS[o.status];

  const statusFlow = ['menunggu','dikemas','dikirim','selesai'];
  const idx = statusFlow.indexOf(o.status);
  const nextStatus = idx < statusFlow.length-1 ? statusFlow[idx+1] : null;
  const nextLabel  = nextStatus ? (nextStatus==='dikemas'?'Mulai Kemas':nextStatus==='dikirim'?'Kirim Barang':'Tandai Selesai') : null;

  document.getElementById('modal-body').innerHTML = `
    <div class="flex justify-between items-start mb-5">
      <div>
        <p class="font-mono font-bold text-laut-dark text-lg">${o.id}</p>
        <p class="text-xs text-cocoa/50">${formatTanggal(o.tanggal)}</p>
      </div>
      <span class="text-xs ${st.warna} px-3 py-1 rounded-full font-bold">
        <i class="fa-solid ${st.ikon} mr-1"></i>${st.label}
      </span>
    </div>

    <div class="grid md:grid-cols-2 gap-6">
      <div>
        <h4 class="text-xs font-bold uppercase tracking-wider text-cocoa/50 mb-2">Pembeli</h4>
        <p class="font-bold">${o.pembeli.nama}</p>
        <p class="text-sm text-cocoa/70"><i class="fa-solid fa-phone w-4 text-emas"></i> ${o.pembeli.hp}</p>
        <p class="text-sm text-cocoa/70 mt-1"><i class="fa-solid fa-location-dot w-4 text-emas"></i> ${o.pembeli.alamat}</p>

        ${o.catatan ? `<h4 class="text-xs font-bold uppercase tracking-wider text-cocoa/50 mb-2 mt-4">Catatan Pembeli</h4><p class="text-sm bg-sand/50 p-3 rounded-lg italic">"${o.catatan}"</p>` : ''}
      </div>

      <div>
        <h4 class="text-xs font-bold uppercase tracking-wider text-cocoa/50 mb-2">Item Pesanan</h4>
        <ul class="space-y-2">
          ${o.items.map(i => `
            <li class="flex justify-between text-sm pb-2 border-b border-cocoa/5">
              <span>${i.nama} <span class="text-cocoa/50">×${i.qty}</span></span>
              <span class="font-bold">${formatRupiah(i.harga*i.qty)}</span>
            </li>`).join('')}
        </ul>
        <div class="flex justify-between mt-3 pt-3 border-t border-cocoa/15 font-extrabold text-laut-dark">
          <span>Total</span><span>${formatRupiah(o.total)}</span>
        </div>
      </div>
    </div>

    ${o.status === 'dikirim' || o.status === 'selesai' ? `
    <div class="mt-5 p-3 bg-sand/50 rounded-lg">
      <p class="text-xs font-bold uppercase tracking-wider text-cocoa/50 mb-1">Nomor Resi</p>
      <p class="font-mono font-bold">${o.resi || '-'}</p>
    </div>` : ''}

    <div class="flex flex-wrap gap-2 mt-6 pt-5 border-t border-cocoa/10">
      ${nextStatus ? `
        <button onclick="updateStatus('${o.id}','${nextStatus}')" class="flex-1 rounded-full bg-emas text-white font-bold py-2.5 hover:bg-emas-dark transition">
          <i class="fa-solid fa-arrow-right mr-1"></i> ${nextLabel}
        </button>` : ''}
      ${o.status === 'dikirim' ? `
        <button onclick="isiResi('${o.id}')" class="rounded-full bg-laut text-ivory font-bold px-5 py-2.5 hover:bg-laut-dark transition">
          <i class="fa-solid fa-pen mr-1"></i> Isi Resi
        </button>` : ''}
      ${o.status === 'menunggu' ? `
        <button onclick="updateStatus('${o.id}','batal')" class="rounded-full border border-mengkudu text-mengkudu font-bold px-5 py-2.5 hover:bg-mengkudu hover:text-ivory transition">
          Tolak Pesanan
        </button>` : ''}
    </div>`;

  document.getElementById('modal-detail').classList.remove('hidden');
  document.getElementById('modal-detail').classList.add('flex');
}

function tutupModal() {
  document.getElementById('modal-detail').classList.add('hidden');
  document.getElementById('modal-detail').classList.remove('flex');
}

/* ── Ubah status pesanan ── */
function updateStatus(id, statusBaru) {
  const o = orders.find(x => x.id === id);
  if (!o) return;

  if (statusBaru === 'dikirim' && !o.resi) {
    const resi = prompt('Masukkan nomor resi pengiriman:');
    if (!resi) return;
    o.resi = resi.trim();
  }

  o.status = statusBaru;
  simpanOrders();
  updateCounts();
  renderList();
  tutupModal();
  showToast('✅ Status pesanan diperbarui: ' + STATUS[statusBaru].label);
}

function isiResi(id) {
  const o = orders.find(x => x.id === id);
  if (!o) return;
  const resi = prompt('Masukkan / perbarui nomor resi:', o.resi || '');
  if (resi === null) return;
  o.resi = resi.trim();
  simpanOrders();
  bukaModal(id);
  showToast('📝 Nomor resi tersimpan.');
}

function hapusPesanan(id) {
  if (!confirm('Hapus pesanan ini secara permanen?')) return;
  orders = orders.filter(o => o.id !== id);
  simpanOrders();
  updateCounts();
  renderList();
  showToast('🗑️ Pesanan dihapus.');
}

/* ── Input pesanan manual (untuk order dari WA/DM yang belum tercatat) ── */
function tambahPesananManual() {
  const nama  = prompt('Nama pembeli:');
  if (!nama) return;
  const hp    = prompt('No. HP pembeli:', '08');
  if (!hp) return;
  const alamat= prompt('Alamat lengkap:');
  if (!alamat) return;
  const total = parseInt(prompt('Total pembayaran (angka saja, tanpa Rp):', '350000'));
  if (isNaN(total) || total <= 0) { showToast('⚠️ Total tidak valid'); return; }

  const id = 'INV-' + (1000 + orders.length + 1);
  orders.push({
    id, tanggal: new Date().toISOString(),
    pembeli: { nama, hp, alamat },
    items: [{ produkId:0, nama:'(Pesanan Manual)', qty:1, harga:total }],
    total, status:'menunggu', resi:'', catatan:'Input manual oleh penjual'
  });
  simpanOrders();
  updateCounts();
  renderList();
  showToast('✅ Pesanan baru ' + id + ' ditambahkan.');
}

/* ═══════════ INISIALISASI DENGAN WAITFORAUTH ═══════════ */
waitForAuth(() => {
  const user = currentUser();
  
  /* ── Proteksi halaman ── */
  if (!user || user.peran !== 'penjual') {
    alert('⛔ Akses Ditolak. Halaman ini khusus untuk Penjual.');
    location.href = 'login.html?mode=masuk';
    return;
  }
  
  /* ── Isi data user di sidebar ── */
  document.getElementById('user-name').textContent  = user.nama;
  document.getElementById('user-email').textContent = user.email;
  document.getElementById('user-avatar').textContent = user.nama.charAt(0).toUpperCase();

  /* ── Inisialisasi data pesanan ── */
  seedOrders();
  updateCounts();
  renderList();

  /* ── Event listener (di dalam waitForAuth agar DOM sudah siap) ── */
  document.querySelectorAll('.filter-status').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-status').forEach(b => b.classList.remove('chip-active'));
      btn.classList.add('chip-active');
      filterStatus = btn.dataset.status;
      renderList();
    });
  });

  const searchInput = document.getElementById('cari-pesanan');
  if (searchInput) {
    searchInput.addEventListener('input', e => {
      filterQ = e.target.value.trim();
      renderList();
    });
  }

  const modalDetail = document.getElementById('modal-detail');
  if (modalDetail) {
    modalDetail.addEventListener('click', e => {
      if (e.target.id === 'modal-detail') tutupModal();
    });
  }
});
