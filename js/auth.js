/* ════════════════════════════════════════════════════════════
   SARUNG ENDE — Tahap 9A: Autentikasi Firebase + WaitForAuth
================================================================ */

let currentUserData = null;
let authInitialized = false;
let authListeners = [];

/* ── Pantau Status Login Secara Realtime ── */
auth.onAuthStateChanged(async (user) => {
  if (user) {
    // Ambil data peran & nama dari Firestore
    try {
      const doc = await db.collection("users").doc(user.uid).get();
      if (doc.exists) {
        currentUserData = { uid: user.uid, email: user.email, ...doc.data() };
      } else {
        currentUserData = { uid: user.uid, email: user.email, nama: 'User', peran: 'pembeli' };
      }
    } catch (error) {
      console.error("Error mengambil data user:", error);
      currentUserData = { uid: user.uid, email: user.email, nama: 'User', peran: 'pembeli' };
    }
  } else {
    currentUserData = null;
  }
  
  authInitialized = true;
  // Jalankan semua fungsi yang sedang menunggu auth selesai
  authListeners.forEach(cb => cb());
  authListeners = [];
  
  renderAuthHeader(); // Update tampilan header
});

/* ── Fungsi untuk menunggu auth selesai (Anti Race-Condition) ── */
function waitForAuth(callback) {
  if (authInitialized) {
    callback();
  } else {
    authListeners.push(callback);
  }
}

/* ── Fungsi untuk halaman lain (dashboard, statistik, dll) ── */
function currentUser() {
  return currentUserData;
}

/* ── Registrasi (Daftar) ── */
async function daftarUser({ nama, email, pass, peran }) {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, pass);
    const user = userCredential.user;
    
    // Simpan nama & peran ke Firestore
    await db.collection("users").doc(user.uid).set({
      nama: nama,
      peran: peran,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    return { ok: true };
  } catch (error) {
    let pesan = 'Terjadi kesalahan saat mendaftar.';
    if (error.code === 'auth/email-already-in-use') pesan = 'Email sudah terdaftar. Silakan masuk.';
    if (error.code === 'auth/weak-password') pesan = 'Kata sandi terlalu lemah (min. 6 karakter).';
    return { ok: false, pesan: pesan };
  }
}

/* ── Login ── */
async function loginUser(email, pass) {
  try {
    await auth.signInWithEmailAndPassword(email, pass);
    return { ok: true };
  } catch (error) {
    let pesan = 'Email atau kata sandi salah.';
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-login-credentials') {
      pesan = 'Email atau kata sandi salah.';
    }
    return { ok: false, pesan: pesan };
  }
}

/* ── Logout ── */
async function logout() {
  try {
    await auth.signOut();
    showToast('👋 Anda telah keluar.');
    // Jika sedang di halaman proteksi, lempar ke beranda
    if (window.location.pathname.includes('dashboard') || 
        window.location.pathname.includes('pesanan') || 
        window.location.pathname.includes('tambah-produk') || 
        window.location.pathname.includes('statistik')) {
      setTimeout(() => location.href = 'index.html', 500);
    }
  } catch (error) {
    console.error("Error logout:", error);
  }
}

/* ── Area Akun di Header ── */
function renderAuthHeader() {
  const area = document.getElementById('auth-area');
  if (!area) return;

  if (!currentUserData) {
    area.innerHTML = `
      <button onclick="location.href='login.html'"
              class="text-sm font-bold border-2 border-laut text-laut rounded-full px-4 py-2 hover:bg-laut hover:text-ivory transition">Masuk</button>`;
    return;
  }

  const u = currentUserData;
  const ikon = u.peran === 'penjual' ? 'fa-store' : 'fa-user';
  
  area.innerHTML = `
    <div class="flex items-center gap-2">
      <span class="hidden md:flex items-center gap-2 text-xs font-bold bg-laut/10 text-laut rounded-full px-3 py-1.5">
        <i class="fa-solid ${ikon}"></i>${u.nama}
        <span class="uppercase text-[9px] bg-emas text-white rounded-full px-2 py-0.5">${u.peran}</span>
      </span>
      ${u.peran === 'penjual'
        ? `<button onclick="location.href='dashboard.html'" class="text-xs font-bold bg-emas text-white rounded-full px-3 py-2 hover:bg-emas-dark transition">Dasbor</button>`
        : ''}
      <button onclick="logout()" title="Keluar"
              class="h-10 w-10 rounded-full border border-cocoa/15 bg-white text-mengkudu hover:border-mengkudu transition">
        <i class="fa-solid fa-right-from-bracket"></i>
      </button>
    </div>`;
}
/* ── Tombol "Jadi Penjual" di header ── */
function jadiPenjual() {
  waitForAuth(() => {
    const u = currentUser();
    // Jika sudah login sebagai penjual, langsung ke dashboard
    if (u && u.peran === 'penjual') {
      location.href = 'dashboard.html';
      return;
    }
    // Selain itu, buka halaman daftar dengan peran penjual terpilih
    location.href = 'login.html?mode=daftar&peran=penjual';
  });
}
