/* ════════════════════════════════════════════════════════════
   SARUNG ENDE — Tracker Jangkauan Pengunjung (Firebase)
   Otomatis mencatat setiap page view ke koleksi "kunjungan"
================================================================ */
(function () {
  if (typeof firebase === 'undefined' || typeof db === 'undefined') return;

  /* ID perangkat → untuk menghitung pengunjung unik */
  const DEVICE_KEY = 'sarung-ende-device';
  let deviceId = localStorage.getItem(DEVICE_KEY);
  if (!deviceId) {
    deviceId = 'dev-' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
    localStorage.setItem(DEVICE_KEY, deviceId);
  }

  const halaman = location.pathname.split('/').pop() || 'index.html';

  /* Sumber kunjungan (hanya ambil nama domain) */
  let sumber = 'Langsung';
  if (document.referrer) {
    try { sumber = new URL(document.referrer).hostname; } catch (e) { sumber = document.referrer; }
  }

  db.collection('kunjungan').add({
    deviceId:  deviceId,
    halaman:   halaman,
    waktu:     firebase.firestore.FieldValue.serverTimestamp(),
    perangkat: /Mobi|Android|iPhone/i.test(navigator.userAgent) ? 'HP' : 'Laptop/PC',
    layar:     (screen.width || 0) + 'x' + (screen.height || 0),
    bahasa:    navigator.language || '-',
    sumber:    sumber
  }).then(() => {
    console.log('📊 Kunjungan tercatat:', halaman);
  }).catch(err => {
    console.warn('Gagal mencatat kunjungan:', err);
  });
})();