/* ════════════════════════════════════════════════════════════
   SARUNG ENDE — Pemuat komponen bersama (header & footer)
   Setiap halaman cukup menyediakan:
   <div id="site-header"></div> … <div id="site-footer"></div>
================================================================ */
(async function () {
  const targets = [
    ['site-header', 'partials/header.html'],
    ['site-footer', 'partials/footer.html']
  ];

  for (const [id, url] of targets) {
    const el = document.getElementById(id);
    if (!el) continue;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(res.status);
      el.innerHTML = await res.text();
    } catch (e) {
      el.innerHTML =
        '<div class="bg-mengkudu text-ivory text-center text-sm font-bold py-3 px-4">' +
        '⚠️ Header/footer tidak termuat. Buka proyek ini lewat Live Server (VS Code) ' +
        'atau hosting — bukan langsung dari file://</div>';
    }
  }
})();