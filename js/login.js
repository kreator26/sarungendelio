/* ════════════════════════════════════════════════════════════
   SARUNG ENDE — Tahap 9A: Logika halaman login/daftar (Firebase)
================================================================ */

const params = new URLSearchParams(location.search);
let mode = params.get('mode') === 'daftar' ? 'daftar' : 'masuk';
let peranTerpilih = params.get('peran') === 'penjual' ? 'penjual' : 'pembeli';

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

/* ── Submit masuk (Terhubung ke Firebase) ── */
async function submitMasuk(e) {
  e.preventDefault();
  const email = document.getElementById('m-email').value.trim();
  const pass  = document.getElementById('m-pass').value;
  
  showToast('⏳ Sedang memproses...');
  const hasil = await loginUser(email, pass);
  
  if (!hasil.ok) { 
    showToast('⚠️ ' + hasil.pesan); 
    return; 
  }

  showToast('👋 Login berhasil! Mengalihkan...');
  
  // Tunggu sebentar agar onAuthStateChanged di auth.js sempat membaca data peran dari Firestore
  setTimeout(() => {
    const user = currentUser();
    if (user && user.peran === 'penjual') {
      location.href = 'dashboard.html';
    } else {
      location.href = 'index.html';
    }
  }, 1000);
}

/* ── Submit daftar (Terhubung ke Firebase) ── */
async function submitDaftar(e) {
  e.preventDefault();
  const nama  = document.getElementById('d-nama').value.trim();
  const email = document.getElementById('d-email').value.trim();
  const pass  = document.getElementById('d-pass').value;

  if (pass.length < 6) { showToast('⚠️ Kata sandi minimal 6 karakter.'); return; }

  showToast('⏳ Mendaftarkan akun ke server...');
  const hasil = await daftarUser({ nama, email, pass, peran: peranTerpilih });
  
  if (!hasil.ok) { 
    showToast('⚠️ ' + hasil.pesan); 
    return; 
  }

  showToast('✅ Pendaftaran berhasil! Anda otomatis masuk.');
  
  setTimeout(() => {
    const user = currentUser();
    if (user && user.peran === 'penjual') {
      location.href = 'dashboard.html';
    } else {
      location.href = 'index.html';
    }
  }, 1500);
}

/* ── Reset kata sandi via email (Firebase) ── */
async function resetPassword() {
  const email = document.getElementById('m-email').value.trim();

  if (!email) {
    showToast('⚠️ Isi email Anda terlebih dahulu di kolom email.');
    document.getElementById('m-email').focus();
    return;
  }

  showToast('⏳ Mengirim tautan reset…');
  try {
    auth.languageCode = 'id'; // agar email reset berbahasa Indonesia
    await auth.sendPasswordResetEmail(email);
    showToast('📧 Tautan reset terkirim ke ' + email + '. Cek inbox / folder spam.');
  } catch (error) {
    let pesan = 'Gagal mengirim tautan reset.';
    if (error.code === 'auth/user-not-found') pesan = 'Email tidak terdaftar.';
    if (error.code === 'auth/invalid-email')  pesan = 'Format email tidak valid.';
    if (error.code === 'auth/too-many-requests') pesan = 'Terlalu banyak percobaan. Coba lagi nanti.';
    showToast('⚠️ ' + pesan);
  }
}

/* ── Isi otomatis data dummy ── */
function isiDemo(peran) {
  // Karena kita kini memakai Firebase, akun demo lokal tidak bisa langsung login.
  // Fungsi ini sekarang mengisi form DAFTAR agar Anda bisa cepat membuat akun tes di Firebase.
  gantiMode('daftar');
  peranTerpilih = peran;

  // Update UI chip peran
  document.querySelectorAll('.peran-chip').forEach(c => c.classList.remove('chip-active'));
  const targetChip = document.querySelector(`.peran-chip[onclick*="'${peran}'"]`);
  if (targetChip) targetChip.classList.add('chip-active');

  document.getElementById('d-nama').value  = peran === 'penjual' ? 'Admin Sarung Ende' : 'Budi Pembeli';
  document.getElementById('d-email').value = peran === 'penjual' ? 'admin@sarungende.id' : 'budi.pembeli@test.com';
  document.getElementById('d-pass').value  = 'admin123';

  showToast('✍️ Data terisi. Klik "Daftar Sekarang" untuk membuat akun di server Firebase.');
}

/* ── Inisialisasi ── */
gantiMode(mode);

/* Jika URL membawa peran (mis. dari tombol "Jadi Penjual"), aktifkan chip-nya */
if (peranTerpilih !== 'pembeli') {
  document.querySelectorAll('.peran-chip').forEach(c => c.classList.remove('chip-active'));
  const chip = document.querySelector(`.peran-chip[onclick*="'${peranTerpilih}'"]`);
  if (chip) chip.classList.add('chip-active');
}
