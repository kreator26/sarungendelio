/* ════════════════════════════════════════════════════════════
   SARUNG ENDE — Konfigurasi Firebase
================================================================ */

const firebaseConfig = {
  apiKey: "AIzaSyAMcu0pjIBT67wOUq6D3d25n3Ueu119CTw",
  authDomain: "sarung-ende-web.firebaseapp.com",
  projectId: "sarung-ende-web",
  storageBucket: "sarung-ende-web.firebasestorage.app",
  messagingSenderId: "396738366371",
  appId: "1:396738366371:web:6569603b6cfb25d2f0e816",
  measurementId: "G-RVFB6B81FW"
};

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);

// Inisialisasi Layanan (Storage dihapus sementara, akan dipakai di Tahap 9C)
const auth = firebase.auth();
const db = firebase.firestore();
