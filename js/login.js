/* ════════════════════════════════════════════════════════════
   SARUNG ENDE — Tahap 5: Logika halaman login/daftar
================================================================ */

const params = new URLSearchParams(location.search);
let mode = params.get('mode') === 'daftar' ? 'daftar' : 'masuk';
let peranTerpilih = 'pembeli';

/* ── Ganti tab Masuk / Daftar ── */
function gantiMode(m) {
  mode = m;
  document.getElementById('form-masuk').classList.toggle('hidden', m !== 'masuk');
  document.getElementById('form-daftar').classList.toggle('hidden', m !== 'daftar');
  document.querySelectorAll('.tab-auth').forEach(b => {
    const aktif = b.dataset.mode === m;
    b.classList.toggle('bg-laut', aktif);
    b.classList.toggle('text-ivory', aktif);
    b.classList.toggle('bg-cocoa/10', !aktif);
    b.classList.toggle('text-cocoa', !aktif);
  });
}

/* ── Pilih peran saat daftar ── */
function pilihPeran(r, el) {
  peranTerpilih = r;
  document.querySelectorAll('.peran-chip').forEach(c => c.classList.remove('chip-active'));
  el.classList.add('chip-active');
}

/* ── Submit masuk ── */
function submitMasuk(e) {
  e.preventDefault();
  const email = document.getElementById('m-email').value.trim();
  const pass  = document.getElementById('m-pass').value;
  const hasil = loginUser(email, pass);
  if (!hasil.ok) { showToast('⚠️ ' + hasil.pesan); return; }

  showToast('👋 Selamat datang, ' + hasil.sesi.nama + '!');
    setTimeout(() => {
    /* Arahkan penjual ke dashboard, pembeli ke beranda */
    if (hasil.sesi.peran === 'penjual') {
      location.href = 'dashboard.html';
    } else {
      location.href = 'index.html';
    }
  }, 700);
}

/* ── Submit daftar ── */
function submitDaftar(e) {
  e.preventDefault();
  const nama  = document.getElementById('d-nama').value.trim();
  const email = document.getElementById('d-email').value.trim();
  const pass  = document.getElementById('d-pass').value;

  if (pass.length < 6) { showToast('⚠️ Kata sandi minimal 6 karakter.'); return; }

  const hasil = daftarUser({ nama, email, pass, peran: peranTerpilih });
  if (!hasil.ok) { showToast('⚠️ ' + hasil.pesan); return; }

  showToast('✅ Pendaftaran berhasil! Silakan masuk.');
  gantiMode('masuk');
  document.getElementById('m-email').value = email;
  document.getElementById('m-pass').value  = '';
}

/* ── Isi otomatis akun demo ── */
function isiDemo(peran) {
  gantiMode('masuk');
  document.getElementById('m-email').value = peran === 'penjual' ? 'demo@penjual.id' : 'demo@pembeli.id';
  document.getElementById('m-pass').value  = peran === 'penjual' ? 'penjual123' : 'pembeli123';
  showToast('✍️ Akun demo terisi — klik Masuk.');
}

/* ── Inisialisasi ── */
gantiMode(mode);