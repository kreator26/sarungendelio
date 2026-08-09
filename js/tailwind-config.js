/* ════════════════════════════════════════════════════════════
   SARUNG ENDE — Konfigurasi tema Tailwind
   Palet warna terinspirasi tenun Ende–Lio:
   laut (indigo nila) · mengkudu (marun) · emas (oker) · ivory
================================================================ */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        ivory: '#F7F3EB',
        sand:  '#EAE0CC',
        laut:  { light: '#3A5F8A', DEFAULT: '#24466B', dark: '#16304B', deep: '#0C1F35' },
        mengkudu: { light: '#B4544A', DEFAULT: '#8C2F26', dark: '#6B231C' },
        emas:  { light: '#E7C883', DEFAULT: '#C08A2D', dark: '#8F651D' },
        cocoa: { DEFAULT: '#3B241A', dark: '#241408' }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans:  ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        card: '0 14px 34px -14px rgba(12,31,53,0.28)'
      }
    }
  }
};