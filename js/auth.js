/* ════════════════════════════════════════════════════════════
   SARUNG ENDE — Tahap 5: Autentikasi pembeli & penjual (simulasi)
   Pola fungsi (daftar/login/logout/sesi) dibuat sama dengan
   Firebase Auth, sehingga di Tahap 9 hanya isi fungsi yang diganti.
   ⚠️ Hash di bawah HANYA simulasi, bukan keamanan produksi.
================================================================ */

const USERS_KEY   = 'sarung-ende-users';
const SESSION_KEY = 'sarung-ende-session';

function bacaUsers()  { try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; } catch (e) { return []; } }
function simpanUsers(u) { localStorage.setItem(USERS_KEY, JSON.stringify(u)); }

/* Hash simulasi (akan diganti Firebase Auth di Tahap 9) */
function hashKasar(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0; }
  return 'h' + h;
}

/* ── Registrasi ── */
function daftarUser({ nama, email, pass, peran }) {
  const users = bacaUsers();
  if (users.find(u => u.email === email)) return { ok: false, pesan: 'Email sudah terdaftar. Silakan masuk.' };
  users.push({ nama, email, pass: hashKasar(pass), peran });
  simpanUsers(users);
  return { ok: true };
}

/* ── Login ── */
function loginUser(email, pass) {
  const u = bacaUsers().find(u => u.email === email && u.pass === hashKasar(pass));
  if (!u) return { ok: false, pesan: 'Email atau kata sandi salah.' };
  const sesi = { nama: u.nama, email: u.email, peran: u.peran };
  localStorage.setItem(SESSION_KEY, JSON.stringify(sesi));
  return { ok: true, sesi };
}

/* ── Sesi & logout ── */
function currentUser() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch (e) { return null; }
}

function logout() {
  localStorage.removeItem(SESSION_KEY);
  renderAuthHeader();
  showToast('👋 Anda telah keluar.');
}

/* ── Area akun di header (dirender setelah header dimuat) ── */
function renderAuthHeader() {
  const area = document.getElementById('auth-area');
  if (!area) return;
  const u = currentUser();

  if (!u) {
    area.innerHTML = `
      <button onclick="location.href='login.html'"
              class="text-sm font-bold border-2 border-laut text-laut rounded-full px-4 py-2 hover:bg-laut hover:text-ivory transition">Masuk</button>`;
    return;
  }

  const ikon = u.peran === 'penjual' ? 'fa-store' : 'fa-user';
  area.innerHTML = `
    <div class="flex items-center gap-2">
      <span class="hidden md:flex items-center gap-2 text-xs font-bold bg-laut/10 text-laut rounded-full px-3 py-1.5">
        <i class="fa-solid ${ikon}"></i>${u.nama}
        <span class="uppercase text-[9px] bg-emas text-white rounded-full px-2 py-0.5">${u.peran}</span>
      </span>
      ${u.peran === 'penjual'
        ? `<button onclick="showToast('📊 Dasbor penjual aktif di Tahap 6')" class="text-xs font-bold bg-emas text-white rounded-full px-3 py-2 hover:bg-emas-dark transition">Dasbor</button>`
        : ''}
      <button onclick="logout()" title="Keluar"
              class="h-10 w-10 rounded-full border border-cocoa/15 bg-white text-mengkudu hover:border-mengkudu transition">
        <i class="fa-solid fa-right-from-bracket"></i>
      </button>
    </div>`;
}

/* ── Akun demo untuk pengujian ── */
function seedDemo() {
  const users = bacaUsers();
  if (!users.find(u => u.email === 'demo@penjual.id'))
    users.push({ nama: 'Penjual Demo', email: 'demo@penjual.id', pass: hashKasar('penjual123'), peran: 'penjual' });
  if (!users.find(u => u.email === 'demo@pembeli.id'))
    users.push({ nama: 'Pembeli Demo', email: 'demo@pembeli.id', pass: hashKasar('pembeli123'), peran: 'pembeli' });
  simpanUsers(users);
}
seedDemo();