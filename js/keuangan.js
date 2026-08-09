/* ════════════════════════════════════════════════════════════
   SARUNG ENDE — Keuangan Penjual
   Saldo dihitung dari pesanan: selesai = cair, berjalan = tertahan
================================================================ */

const ORDERS_KEY = 'sarung-ende-orders';
const WD_KEY     = 'sarung-ende-withdrawals';

let orders = [];
let withdrawals = [];
try { orders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || []; } catch (e) { orders = []; }
try { withdrawals = JSON.parse(localStorage.getItem(WD_KEY)) || []; } catch (e) { withdrawals = []; }

function simpanWithdrawals() { localStorage.setItem(WD_KEY, JSON.stringify(withdrawals)); }

function formatTanggal(iso) {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

/* ── Hitung semua angka keuangan ── */
function hitung() {
  const selesai  = orders.filter(o => o.status === 'selesai');
  const berjalan = orders.filter(o => ['menunggu', 'dikemas', 'dikirim'].includes(o.status));
  const totalMasuk = selesai.reduce((a, o) => a + o.total, 0);
  const totalWD    = withdrawals.reduce((a, w) => a + w.jumlah, 0);
  return {
    selesai, berjalan, totalMasuk, totalWD,
    saldoTersedia: totalMasuk - totalWD,
    saldoTertahan: berjalan.reduce((a, o) => a + o.total, 0)
  };
}

/* ── Render seluruh halaman ── */
function renderKeuangan() {
  const k = hitung();

  document.getElementById('saldo-tersedia').textContent = formatRupiah(k.saldoTersedia);
  document.getElementById('saldo-tertahan').textContent = formatRupiah(k.saldoTertahan);
  document.getElementById('total-masuk').textContent    = formatRupiah(k.totalMasuk);
  document.getElementById('total-wd').textContent       = formatRupiah(k.totalWD);

  /* Riwayat pemasukan */
  document.getElementById('tabel-masuk').innerHTML = k.selesai.length ? k.selesai
    .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
    .map(o => `
      <tr class="border-b border-cocoa/5 last:border-0">
        <td class="py-2 px-3 font-mono font-bold text-laut-dark">${o.id}</td>
        <td class="py-2 px-3">${o.pembeli.nama}<br><span class="text-xs text-cocoa/50">${formatTanggal(o.tanggal)}</span></td>
        <td class="py-2 px-3 text-right font-bold text-green-700">+ ${formatRupiah(o.total)}</td>
      </tr>`).join('')
    : '<tr><td colspan="3" class="py-3 px-3 text-cocoa/50">Belum ada pemasukan. Selesaikan pesanan pertama Anda!</td></tr>';

  /* Riwayat penarikan */
  document.getElementById('tabel-wd').innerHTML = withdrawals.length ? [...withdrawals]
    .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
    .map(w => `
      <tr class="border-b border-cocoa/5 last:border-0">
        <td class="py-2 px-3 font-mono font-bold">${w.id}</td>
        <td class="py-2 px-3 text-xs">${w.bank}<br><span class="text-cocoa/50">${formatTanggal(w.tanggal)}</span></td>
        <td class="py-2 px-3 text-right font-bold text-mengkudu">- ${formatRupiah(w.jumlah)}</td>
        <td class="py-2 px-3 text-right"><span class="text-[10px] font-bold bg-emas/15 text-emas-dark px-2 py-0.5 rounded-full">${w.status}</span></td>
      </tr>`).join('')
    : '<tr><td colspan="4" class="py-3 px-3 text-cocoa/50">Belum ada penarikan saldo.</td></tr>';

  /* Dana tertahan */
  const labelStatus = { menunggu: 'Menunggu', dikemas: 'Dikemas', dikirim: 'Dikirim' };
  document.getElementById('tabel-tertahan').innerHTML = k.berjalan.length ? k.berjalan
    .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
    .map(o => `
      <tr class="border-b border-cocoa/5 last:border-0">
        <td class="py-2 px-3 font-mono font-bold text-laut-dark">${o.id}</td>
        <td class="py-2 px-3">${o.pembeli.nama}</td>
        <td class="py-2 px-3"><span class="text-[10px] font-bold bg-laut/10 text-laut px-2 py-0.5 rounded-full">${labelStatus[o.status]}</span></td>
        <td class="py-2 px-3 text-right font-bold">${formatRupiah(o.total)}</td>
      </tr>`).join('')
    : '<tr><td colspan="4" class="py-3 px-3 text-cocoa/50">Tidak ada dana tertahan — semua pesanan selesai. 🎉</td></tr>';
}

/* ── Tarik saldo (simulasi pencairan) ── */
function tarikSaldo() {
  const k = hitung();
  if (k.saldoTersedia <= 0) { showToast('⚠️ Saldo tersedia masih kosong.'); return; }

  const jumlah = parseInt(prompt('Jumlah penarikan (Rp):', k.saldoTersedia));
  if (isNaN(jumlah) || jumlah <= 0) { showToast('⚠️ Jumlah tidak valid.'); return; }
  if (jumlah > k.saldoTersedia) { showToast('⚠️ Jumlah melebihi saldo tersedia (' + formatRupiah(k.saldoTersedia) + ').'); return; }

  const bank = prompt('Bank & nomor rekening (cth: BCA 123456789 a.n. Nama Anda):');
  if (!bank) return;

  withdrawals.push({
    id: 'WD-' + (100 + withdrawals.length + 1),
    tanggal: new Date().toISOString(),
    jumlah, bank: bank.trim(), status: 'Diproses'
  });
  simpanWithdrawals();
  renderKeuangan();
  showToast('✅ Permintaan penarikan ' + formatRupiah(jumlah) + ' dikirim. Dana cair 1×24 jam.');
}

/* ── Proteksi & inisialisasi ── */
waitForAuth(() => {
  const user = currentUser();
  if (!user || user.peran !== 'penjual') {
    alert('⛔ Akses Ditolak. Halaman ini khusus untuk Penjual.');
    location.href = 'login.html?mode=masuk';
    return;
  }
  document.getElementById('user-name').textContent  = user.nama;
  document.getElementById('user-email').textContent = user.email;
  document.getElementById('user-avatar').textContent = user.nama.charAt(0).toUpperCase();

  renderKeuangan();
});