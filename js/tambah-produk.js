const user = currentUser();
if (!user || user.peran !== 'penjual') {
  alert('⛔ Akses Ditolak. Halaman ini khusus untuk Penjual.');
  location.href = 'login.html?mode=masuk';
}

const params = new URLSearchParams(location.search);
const editId = params.get('id') ? parseInt(params.get('id')) : null;
const produk = editId ? PRODUCTS.find(p => p.id === editId) : null;
let imgBase64 = '';

if (produk) {
  document.getElementById('form-title').textContent = 'Edit Produk';
  document.getElementById('p-nama').value = produk.nama;
  document.getElementById('p-kat').value = produk.kat;
  document.getElementById('p-motif').value = produk.motifKey;
  document.getElementById('p-harga').value = produk.harga;
  document.getElementById('p-badge').value = produk.badge || '';
  imgBase64 = produk.img;
  document.getElementById('preview-img').src = imgBase64;
  document.getElementById('preview-img').classList.remove('hidden');
}

document.getElementById('input-file').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(event) {
    imgBase64 = event.target.result;
    document.getElementById('preview-img').src = imgBase64;
    document.getElementById('preview-img').classList.remove('hidden');
  };
  reader.readAsDataURL(file);
});

function submitProduk(e) {
  e.preventDefault();
  const nama = document.getElementById('p-nama').value.trim();
  const kat = document.getElementById('p-kat').value;
  const motifKey = document.getElementById('p-motif').value;
  const harga = parseInt(document.getElementById('p-harga').value);
  const badge = document.getElementById('p-badge').value.trim();
  
  if (!nama || !harga || !imgBase64) {
    showToast('⚠️ Nama, Harga, dan Gambar wajib diisi.');
    return;
  }

  const data = {
    id: editId || 0,
    nama, kat, motifKey, harga, badge,
    img: imgBase64,
    rating: produk ? produk.rating : 5.0,
    terjual: produk ? produk.terjual : 0
  };

  tambahAtauEditProduk(data);
  showToast(editId ? '✅ Produk berhasil diperbarui!' : '✅ Produk baru berhasil ditambahkan!');
  setTimeout(() => location.href = 'dashboard.html', 800);
}