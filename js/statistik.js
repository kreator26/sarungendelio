/* ════════════════════════════════════════════════════════════
   SARUNG ENDE — Statistik Pengunjung (Versi Tangguh + WaitForAuth)
================================================================ */

// Bungkus semua inisialisasi dalam waitForAuth
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

  // Panggil fungsi muat statistik HANYA SETELAH auth valid
  muatStatistik();
});

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

async function muatStatistik() {
  showToast('⏳ Memuat statistik pengunjung…');
  
  try {
    const snap = await db.collection('kunjungan').get();
    const data = [];
    snap.forEach(d => data.push({ id: d.id, ...d.data() }));

    console.log('📊 Total data kunjungan:', data.length);

    /* ── Kartu ringkasan ── */
    const total   = data.length;
    const unik    = new Set(data.map(x => x.deviceId)).size;
    const hariIni = data.filter(x => x.waktu && sameDay(x.waktu.toDate(), new Date())).length;
    const persenHp = total ? Math.round(data.filter(x => x.perangkat === 'HP').length / total * 100) : 0;

    document.getElementById('st-total').textContent = total;
    document.getElementById('st-unik').textContent  = unik;
    document.getElementById('st-hari').textContent  = hariIni;
    document.getElementById('st-hp').textContent    = persenHp + '%';

    /* ── Grafik 7 hari terakhir ── */
    const days = [];
    for (let i = 6; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); days.push(d); }

    const perHari = days.map(d => ({
      label: d.toLocaleDateString('id-ID', { weekday: 'short' }),
      count: data.filter(x => x.waktu && sameDay(x.waktu.toDate(), d)).length
    }));
    const max = Math.max(1, ...perHari.map(p => p.count));

    document.getElementById('grafik-7hari').innerHTML = perHari.map(p => `
      <div class="flex-1 flex flex-col items-center justify-end gap-1 h-full">
        <span class="text-[10px] font-bold text-cocoa/60">${p.count}</span>
        <div class="w-full rounded-t-lg ${p.count === max && p.count > 0 ? 'bg-emas' : 'bg-laut/40'}"
             style="height:${Math.max(6, (p.count / max) * 140)}px"></div>
        <span class="text-[10px] font-bold">${p.label}</span>
      </div>`).join('');

    /* ── Halaman terpopuler ── */
    const perHalaman = {};
    data.forEach(x => perHalaman[x.halaman] = (perHalaman[x.halaman] || 0) + 1);
    const top = Object.entries(perHalaman).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const maxTop = top.length ? top[0][1] : 1;

    document.getElementById('top-halaman').innerHTML = top.length ? top.map(([h, c]) => `
      <div>
        <div class="flex justify-between text-xs font-bold mb-1">
          <span>${h}</span><span class="text-cocoa/50">${c} kunjungan</span>
        </div>
        <div class="h-2 rounded-full bg-sand">
          <div class="h-2 rounded-full bg-emas" style="width:${(c / maxTop) * 100}%"></div>
        </div>
      </div>`).join('') : '<p class="text-sm text-cocoa/50">Belum ada data. Buka beberapa halaman di toko Anda.</p>';

    /* ── Tabel kunjungan terbaru ── */
    const terbaru = data.filter(x => x.waktu)
      .sort((a, b) => b.waktu.toDate() - a.waktu.toDate()).slice(0, 10);

    document.getElementById('tabel-kunjungan').innerHTML = terbaru.length ? terbaru.map(x => `
      <tr class="border-b border-cocoa/5 last:border-0">
        <td class="py-2 px-3 whitespace-nowrap text-cocoa/60">${x.waktu.toDate().toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
        <td class="py-2 px-3 font-bold">${x.halaman}</td>
        <td class="py-2 px-3">${x.perangkat || '-'}</td>
        <td class="py-2 px-3 text-cocoa/60">${x.sumber || 'Langsung'}</td>
      </tr>`).join('') : '<tr><td colspan="4" class="py-3 px-3 text-cocoa/50 text-center">Belum ada kunjungan tercatat.</td></tr>';

    if (total === 0) {
      showToast('ℹ️ Belum ada data. Buka beberapa halaman toko Anda dulu, lalu muat ulang.');
    } else {
      showToast('✅ ' + total + ' kunjungan berhasil dimuat.');
    }

  } catch (error) {
    console.error('❌ Error memuat statistik:', error);
    showToast('⚠️ Gagal memuat statistik: ' + error.message);
  }
}
