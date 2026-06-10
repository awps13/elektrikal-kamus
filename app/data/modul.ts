// ════════════════════════════════════════════════════════════════════════════
// MODUL PEMBELAJARAN — INSTALASI LISTRIK RUMAH TANGGA
// Materi terstruktur 6 bab + evaluasi 15 soal pilihan ganda.
// Acuan: PUIL 2011 (SNI 0225:2011) & standar PLN.
// ════════════════════════════════════════════════════════════════════════════

// ── Tipe blok konten ─────────────────────────────────────────────────────────
export type Blok =
  | { tipe: "paragraf"; teks: string }
  | { tipe: "subjudul"; teks: string }
  | { tipe: "poin"; judul?: string; items: string[] }
  | { tipe: "langkah"; items: string[] }
  | { tipe: "info"; varian: "info" | "bahaya" | "tips" | "catatan"; judul: string; teks: string }
  | { tipe: "tabel"; kolom: string[]; baris: string[][] }
  | { tipe: "simbol" } // memicu galeri simbol kelistrikan (dirender di komponen)
  | { tipe: "diagram" }; // memicu diagram pengawatan rumah (dirender di komponen)

export interface Bab {
  id: string;
  no: number;
  judul: string;
  ikon: string;
  ringkasan: string;
  tujuan: string[]; // tujuan pembelajaran
  estimasiMenit: number;
  blok: Blok[];
}

// ── BAB 1 — PENGERTIAN INSTALASI LISTRIK ─────────────────────────────────────
const bab1: Bab = {
  id: "pengertian",
  no: 1,
  judul: "Pengertian Instalasi Listrik",
  ikon: "💡",
  ringkasan: "Memahami definisi, tujuan, jenis, dan dasar hukum instalasi listrik rumah tangga.",
  estimasiMenit: 10,
  tujuan: [
    "Menjelaskan pengertian instalasi listrik dengan benar.",
    "Menyebutkan tujuan dan manfaat instalasi listrik yang baik.",
    "Membedakan jenis-jenis instalasi listrik.",
    "Mengenal dasar hukum dan standar instalasi listrik di Indonesia.",
  ],
  blok: [
    {
      tipe: "paragraf",
      teks: "Instalasi listrik adalah suatu rangkaian peralatan dan perlengkapan listrik yang saling terhubung untuk menyalurkan, membagi, dan menggunakan energi listrik dari sumber (PLN atau pembangkit lain) menuju titik-titik beban seperti lampu, stop kontak, dan peralatan rumah tangga secara aman, andal, dan efisien.",
    },
    {
      tipe: "paragraf",
      teks: "Secara sederhana, instalasi listrik rumah adalah 'jalur perjalanan' arus listrik mulai dari kWh meter PLN, masuk ke kotak pembagi (PHB/box panel), kemudian dibagi ke beberapa kelompok beban hingga sampai ke saklar, lampu, dan stop kontak di setiap ruangan.",
    },
    {
      tipe: "subjudul",
      teks: "Tujuan Instalasi Listrik yang Baik",
    },
    {
      tipe: "poin",
      items: [
        "Keamanan (safety): melindungi manusia dari sengatan listrik dan melindungi bangunan dari bahaya kebakaran.",
        "Keandalan (reliability): listrik mengalir stabil dan tidak mudah terputus.",
        "Ketersediaan (availability): tersedia di setiap titik yang dibutuhkan penghuni.",
        "Kemudahan (accessibility): mudah dioperasikan, diperiksa, dan diperbaiki.",
        "Keindahan & kerapian (estetika): pemasangan rapi sehingga enak dipandang dan tidak membahayakan.",
        "Ekonomis: hemat biaya pemasangan dan pemakaian energi.",
      ],
    },
    {
      tipe: "subjudul",
      teks: "Jenis-Jenis Instalasi Listrik",
    },
    {
      tipe: "tabel",
      kolom: ["Dasar Penggolongan", "Jenis", "Keterangan"],
      baris: [
        ["Fungsi", "Instalasi penerangan", "Menyalurkan listrik ke lampu/titik cahaya."],
        ["Fungsi", "Instalasi tenaga/daya", "Menyalurkan listrik ke stop kontak & motor listrik."],
        ["Pemasangan", "Instalasi in-bow (tanam)", "Kabel ditanam di dalam dinding, rapi & tersembunyi."],
        ["Pemasangan", "Instalasi out-bow (luar)", "Kabel dipasang di permukaan dinding memakai pipa/duct."],
        ["Tegangan", "Tegangan rendah (TR)", "≤ 1000 V, mencakup instalasi rumah (220/380 V)."],
        ["Tegangan", "Tegangan menengah/tinggi", "Untuk jaringan distribusi & industri."],
      ],
    },
    {
      tipe: "subjudul",
      teks: "Dasar Hukum & Standar",
    },
    {
      tipe: "poin",
      judul: "Acuan resmi instalasi listrik di Indonesia:",
      items: [
        "PUIL 2011 (Persyaratan Umum Instalasi Listrik) — SNI 0225:2011, standar wajib instalasi tegangan rendah.",
        "UU No. 30 Tahun 2009 tentang Ketenagalistrikan.",
        "Setiap instalasi baru wajib memiliki SLO (Sertifikat Laik Operasi) sebelum dialiri listrik PLN.",
        "Pemasangan harus dilakukan oleh instalatir resmi yang memiliki sertifikat kompetensi.",
      ],
    },
    {
      tipe: "info",
      varian: "catatan",
      judul: "Mengapa SLO penting?",
      teks: "SLO adalah bukti bahwa instalasi listrik Anda sudah diperiksa dan dinyatakan laik (aman) untuk dioperasikan. Tanpa SLO, PLN tidak akan menyambungkan listrik ke instalasi baru. Ini melindungi Anda dari risiko korsleting dan kebakaran.",
    },
  ],
};

// ── BAB 2 — KESELAMATAN DAN KESEHATAN KERJA (K3) ─────────────────────────────
const bab2: Bab = {
  id: "k3",
  no: 2,
  judul: "Keselamatan & Kesehatan Kerja (K3)",
  ikon: "🦺",
  ringkasan: "Prinsip K3 listrik, bahaya listrik, APD, prosedur kerja aman, dan pertolongan pertama.",
  estimasiMenit: 14,
  tujuan: [
    "Menjelaskan pengertian dan tujuan K3 listrik.",
    "Mengidentifikasi bahaya-bahaya listrik dan penyebabnya.",
    "Menggunakan Alat Pelindung Diri (APD) yang tepat.",
    "Menerapkan prosedur kerja aman (LOTO) dan pertolongan pertama sengatan listrik.",
  ],
  blok: [
    {
      tipe: "paragraf",
      teks: "Keselamatan dan Kesehatan Kerja (K3) adalah segala upaya untuk menjamin keselamatan dan kesehatan pekerja serta orang lain di sekitar tempat kerja. Dalam bidang kelistrikan, K3 sangat penting karena listrik tidak terlihat, tidak berbau, dan dapat mematikan hanya dalam hitungan detik.",
    },
    {
      tipe: "info",
      varian: "bahaya",
      judul: "Fakta penting",
      teks: "Arus sebesar 50 mA (0,05 ampere) yang melewati tubuh sudah dapat menyebabkan kematian. Padahal MCB rumah biasa baru memutus pada arus beberapa ampere. Karena itu pengaman tambahan ELCB/RCCB sangat dianjurkan.",
    },
    {
      tipe: "subjudul",
      teks: "Bahaya Listrik",
    },
    {
      tipe: "poin",
      judul: "Tiga bahaya utama listrik:",
      items: [
        "Sengatan listrik (electric shock): arus mengalir melewati tubuh manusia, menyebabkan luka bakar, kejang otot, hingga henti jantung.",
        "Kebakaran: akibat hubung singkat (korsleting), beban berlebih (overload), atau sambungan kabel yang longgar.",
        "Ledakan (busur api/arc flash): percikan api listrik bertegangan tinggi yang dapat melukai dan membakar.",
      ],
    },
    {
      tipe: "poin",
      judul: "Penyebab umum kecelakaan listrik di rumah:",
      items: [
        "Kabel terkelupas / isolasi rusak dan getas.",
        "Stop kontak menumpuk (overload) menggunakan banyak terminal cabang.",
        "Instalasi terkena air atau bekerja dengan tangan/lantai basah.",
        "Tidak ada sistem pembumian (grounding).",
        "Menyentuh bagian bertegangan tanpa mematikan sumber terlebih dahulu.",
      ],
    },
    {
      tipe: "subjudul",
      teks: "Alat Pelindung Diri (APD)",
    },
    {
      tipe: "tabel",
      kolom: ["APD", "Fungsi"],
      baris: [
        ["Sarung tangan isolasi (min. 1000 V)", "Melindungi tangan dari sengatan listrik."],
        ["Sepatu safety berinsulasi", "Mencegah arus mengalir ke tanah melalui tubuh."],
        ["Helm pelindung", "Melindungi kepala dari benturan & kejatuhan benda."],
        ["Kacamata pelindung", "Melindungi mata dari percikan api & serpihan."],
        ["Pakaian kerja lengan panjang", "Melindungi kulit dari panas & percikan."],
      ],
    },
    {
      tipe: "subjudul",
      teks: "Prosedur Kerja Aman — LOTO",
    },
    {
      tipe: "paragraf",
      teks: "LOTO (Lockout–Tagout) adalah prosedur mengunci dan menandai sumber listrik agar tidak menyala secara tidak sengaja saat sedang dikerjakan.",
    },
    {
      tipe: "langkah",
      items: [
        "Matikan (OFF) MCB utama pada box panel.",
        "Pasang gembok (lockout) pada tuas MCB jika memungkinkan.",
        "Gantung label/tag bertuliskan 'JANGAN DINYALAKAN — SEDANG DIKERJAKAN'.",
        "Verifikasi tidak ada tegangan menggunakan tespen/multimeter sebelum menyentuh kabel.",
        "Kerjakan instalasi setelah dipastikan aman.",
        "Setelah selesai, rapikan alat, lepas gembok/tag, lalu nyalakan kembali.",
      ],
    },
    {
      tipe: "subjudul",
      teks: "Pertolongan Pertama Sengatan Listrik",
    },
    {
      tipe: "langkah",
      items: [
        "JANGAN langsung menyentuh korban yang masih terhubung arus.",
        "Matikan sumber listrik (MCB/saklar) secepat mungkin.",
        "Jika sumber tidak bisa dimatikan, pisahkan korban dari sumber dengan benda kering non-konduktor (kayu, plastik).",
        "Periksa kesadaran dan pernapasan korban; lakukan CPR bila perlu dan Anda terlatih.",
        "Segera hubungi layanan darurat 119 atau bawa ke fasilitas kesehatan terdekat.",
      ],
    },
    {
      tipe: "info",
      varian: "tips",
      judul: "Prinsip 3M",
      teks: "Ingat prinsip aman: MATIKAN sumber sebelum bekerja, MEMAKAI APD yang sesuai, dan MEMERIKSA tegangan dengan tespen sebelum menyentuh penghantar.",
    },
  ],
};

// ── BAB 3 — KOMPONEN INSTALASI LISTRIK ───────────────────────────────────────
const bab3: Bab = {
  id: "komponen",
  no: 3,
  judul: "Komponen Instalasi Listrik",
  ikon: "⚡",
  ringkasan: "Mengenal komponen utama: kWh meter, PHB, MCB, ELCB, saklar, stop kontak, fitting, dan pembumian.",
  estimasiMenit: 14,
  tujuan: [
    "Menyebutkan komponen utama instalasi listrik rumah.",
    "Menjelaskan fungsi masing-masing komponen.",
    "Menentukan kapasitas/ukuran komponen sesuai kebutuhan.",
  ],
  blok: [
    {
      tipe: "paragraf",
      teks: "Instalasi listrik rumah tersusun dari banyak komponen yang masing-masing memiliki fungsi khusus. Memahami komponen membantu Anda merancang, memasang, dan merawat instalasi dengan benar.",
    },
    {
      tipe: "subjudul",
      teks: "1. Komponen Sumber & Pengaman",
    },
    {
      tipe: "poin",
      items: [
        "kWh Meter — alat ukur milik PLN yang mencatat pemakaian energi (kilowatt-hour) untuk penagihan.",
        "PHB / Box Panel (Perlengkapan Hubung Bagi) — kotak tempat MCB & pengaman, pusat distribusi listrik rumah.",
        "MCB (Miniature Circuit Breaker) — memutus arus otomatis saat overload/korsleting.",
        "ELCB / RCCB — mendeteksi kebocoran arus sekecil 30 mA dan memutus daya untuk melindungi nyawa.",
        "Sekring (fuse) — pengaman lebur model lama; putus saat arus berlebih (kini banyak digantikan MCB).",
      ],
    },
    {
      tipe: "subjudul",
      teks: "2. Komponen Penghubung & Kontrol",
    },
    {
      tipe: "poin",
      items: [
        "Saklar (switch) — memutus/menyambung aliran ke lampu. Jenis: tunggal, seri (ganda), tukar (hotel), silang.",
        "Stop kontak (outlet) — titik sambungan untuk peralatan; gunakan tipe 3 lubang (berarde) untuk keamanan.",
        "Steker (plug) — colokan pada ujung kabel peralatan yang dimasukkan ke stop kontak.",
        "Kotak sambung (T-dus / kotak cabang) — tempat penyambungan kabel agar rapi dan aman.",
      ],
    },
    {
      tipe: "subjudul",
      teks: "3. Komponen Beban & Pelengkap",
    },
    {
      tipe: "poin",
      items: [
        "Fitting lampu — dudukan tempat memasang lampu (fitting plafon/gantung).",
        "Lampu — beban penerangan (LED, TL, pijar).",
        "Penghantar/kabel — NYA (inti tunggal), NYM (berselubung 2–4 inti), NYY (untuk tanam tanah).",
        "Pembumian (grounding/arde) — menyalurkan arus bocor ke bumi sebagai pengaman.",
      ],
    },
    {
      tipe: "subjudul",
      teks: "Pemilihan Kapasitas MCB & Kabel",
    },
    {
      tipe: "tabel",
      kolom: ["Beban", "MCB", "Kabel (NYM)"],
      baris: [
        ["Penerangan / lampu", "2–6 A", "2 × 1,5 mm²"],
        ["Stop kontak umum", "10–16 A", "3 × 2,5 mm²"],
        ["AC / pemanas air", "16–20 A", "3 × 2,5 mm²"],
        ["Pompa air", "6–10 A", "3 × 1,5 mm²"],
      ],
    },
    {
      tipe: "info",
      varian: "tips",
      judul: "Aturan 80%",
      teks: "Beban pada satu MCB sebaiknya tidak melebihi 80% kapasitasnya agar tidak sering trip dan tidak cepat panas. Contoh: MCB 10 A → beban maksimum ideal ± 8 A (≈1760 watt pada 220 V).",
    },
  ],
};

// ── BAB 4 — SIMBOL DAN GAMBAR INSTALASI LISTRIK RUMAH ─────────────────────────
const bab4: Bab = {
  id: "simbol",
  no: 4,
  judul: "Simbol & Gambar Instalasi Listrik Rumah",
  ikon: "📐",
  ringkasan: "Mengenal simbol baku PUIL, membaca diagram pengawatan, dan kode warna kabel.",
  estimasiMenit: 12,
  tujuan: [
    "Mengenali simbol-simbol baku komponen listrik sesuai PUIL.",
    "Membaca dan memahami diagram pengawatan (wiring diagram) rumah sederhana.",
    "Menerapkan kode warna kabel sesuai standar SNI.",
  ],
  blok: [
    {
      tipe: "paragraf",
      teks: "Gambar instalasi listrik menggunakan simbol-simbol baku agar dapat dibaca oleh siapa pun yang memahami standar. Simbol ini ditetapkan dalam PUIL dan standar internasional (IEC). Berikut simbol yang paling sering digunakan pada instalasi rumah:",
    },
    { tipe: "simbol" },
    {
      tipe: "subjudul",
      teks: "Kode Warna Kabel (SNI / PUIL 2011)",
    },
    {
      tipe: "tabel",
      kolom: ["Penghantar", "Warna", "Kode"],
      baris: [
        ["Fasa (Line)", "Hitam / Cokelat / Merah", "L"],
        ["Netral (Neutral)", "Biru", "N"],
        ["Pembumian (Ground)", "Loreng Kuning–Hijau", "PE"],
      ],
    },
    {
      tipe: "info",
      varian: "bahaya",
      judul: "Konsistensi warna itu wajib",
      teks: "Jangan pernah memakai kabel loreng kuning-hijau untuk fasa atau netral. Warna ini KHUSUS pembumian. Kesalahan kode warna dapat menyebabkan sengatan fatal bagi teknisi berikutnya.",
    },
    {
      tipe: "subjudul",
      teks: "Contoh Diagram Pengawatan Sederhana",
    },
    {
      tipe: "paragraf",
      teks: "Diagram berikut menggambarkan jalur listrik dari kWh meter PLN, melewati MCB pada box panel, lalu dibagi ke saklar yang mengontrol lampu dan ke stop kontak. Perhatikan jalur pembumian (PE) yang terhubung ke stop kontak.",
    },
    { tipe: "diagram" },
    {
      tipe: "info",
      varian: "info",
      judul: "Jenis gambar instalasi",
      teks: "Gambar instalasi terdiri dari: (1) Diagram garis tunggal (single-line) — ringkas, 1 garis mewakili semua penghantar; (2) Diagram pengawatan (wiring) — menampilkan setiap penghantar; (3) Diagram lokasi/denah — posisi komponen pada denah rumah.",
    },
  ],
};

// ── BAB 5 — TEKNIK PEMASANGAN INSTALASI LISTRIK ──────────────────────────────
const bab5: Bab = {
  id: "teknik",
  no: 5,
  judul: "Teknik Pemasangan Instalasi Listrik",
  ikon: "🔌",
  ringkasan: "Metode in-bow & out-bow, pembagian grup, teknik penyambungan kabel, dan langkah pemasangan.",
  estimasiMenit: 16,
  tujuan: [
    "Membedakan metode pemasangan in-bow dan out-bow.",
    "Menjelaskan prinsip pembagian grup (loading) beban.",
    "Mempraktikkan teknik penyambungan kabel yang benar dan aman.",
    "Mengurutkan langkah-langkah pemasangan instalasi rumah.",
  ],
  blok: [
    {
      tipe: "subjudul",
      teks: "Metode Pemasangan",
    },
    {
      tipe: "tabel",
      kolom: ["Aspek", "In-bow (Tanam)", "Out-bow (Luar)"],
      baris: [
        ["Posisi kabel", "Di dalam dinding (pakai pipa konduit)", "Di permukaan dinding (pakai duct/pipa)"],
        ["Tampilan", "Rapi, tersembunyi", "Terlihat, kurang estetis"],
        ["Pemasangan", "Lebih sulit (perlu bobok dinding)", "Mudah & cepat"],
        ["Cocok untuk", "Rumah baru / renovasi besar", "Renovasi ringan / bangunan jadi"],
        ["Perawatan", "Sulit diakses bila bermasalah", "Mudah diperiksa & diganti"],
      ],
    },
    {
      tipe: "subjudul",
      teks: "Pembagian Grup (Loading Circuit)",
    },
    {
      tipe: "paragraf",
      teks: "Beban listrik rumah dibagi menjadi beberapa grup, masing-masing diamankan satu MCB. Tujuannya: bila satu grup bermasalah, grup lain tetap menyala, dan beban terdistribusi merata.",
    },
    {
      tipe: "poin",
      judul: "Contoh pembagian grup rumah sederhana:",
      items: [
        "Grup 1 — Penerangan (semua lampu).",
        "Grup 2 — Stop kontak ruang utama.",
        "Grup 3 — Beban besar (AC, pemanas air, pompa).",
      ],
    },
    {
      tipe: "subjudul",
      teks: "Teknik Penyambungan Kabel",
    },
    {
      tipe: "poin",
      items: [
        "Sambungan ekor babi (pig tail) — kabel dipilin lalu ditutup lasdop; untuk percabangan dalam kotak sambung.",
        "Sambungan puntir (twist) — dua kabel dipilin minimal 5–7 lilitan rapat.",
        "Sambungan bolak-balik (turn back) — untuk kabel yang menahan tarikan.",
        "Terminal block / konektor — sambungan paling rapi dan kuat untuk panel.",
      ],
    },
    {
      tipe: "info",
      varian: "bahaya",
      judul: "Hindari sambungan buruk",
      teks: "Sambungan kabel yang longgar menimbulkan panas (loss kontak) dan menjadi penyebab utama kebakaran listrik. Selalu pilin rapat, tutup dengan lasdop/isolasi berlapis, dan JANGAN menyambung kabel di dalam pipa konduit.",
    },
    {
      tipe: "subjudul",
      teks: "Langkah Umum Pemasangan Instalasi Rumah",
    },
    {
      tipe: "langkah",
      items: [
        "Buat gambar rencana (denah titik lampu, saklar, stop kontak) & hitung kebutuhan bahan.",
        "Tandai jalur kabel pada dinding (vertikal/horizontal, hindari diagonal).",
        "Pasang pipa konduit dan kotak sambung pada jalur (untuk in-bow: bobok dinding dulu).",
        "Tarik kabel melalui pipa sesuai kode warna (fasa, netral, arde).",
        "Pasang komponen: PHB/MCB, saklar, stop kontak, fitting lampu.",
        "Lakukan penyambungan pada kotak sambung dengan rapi dan aman.",
        "Periksa instalasi: kontinuitas, polaritas, dan tahanan isolasi (megger).",
        "Uji coba dengan menyalakan listrik; pastikan tidak ada yang panas/berbunyi.",
        "Ajukan pemeriksaan untuk mendapatkan SLO sebelum disambung PLN.",
      ],
    },
    {
      tipe: "info",
      varian: "tips",
      judul: "Uji tahanan isolasi",
      teks: "Sebelum dialiri listrik, tahanan isolasi instalasi harus diukur dengan megger dan nilainya minimal 1 MΩ (mega-ohm) sesuai PUIL. Nilai di bawah itu menandakan ada kebocoran isolasi yang berbahaya.",
    },
  ],
};

// ── BAB 6 — ALAT DAN BAHAN INSTALASI LISTRIK ─────────────────────────────────
const bab6: Bab = {
  id: "alat-bahan",
  no: 6,
  judul: "Alat & Bahan Instalasi Listrik",
  ikon: "🔧",
  ringkasan: "Daftar peralatan kerja (tools) dan material (bahan) yang dibutuhkan beserta fungsinya.",
  estimasiMenit: 10,
  tujuan: [
    "Menyebutkan alat-alat kerja instalasi listrik beserta fungsinya.",
    "Menyebutkan bahan/material instalasi listrik beserta fungsinya.",
    "Memilih alat dan bahan yang tepat dan aman.",
  ],
  blok: [
    {
      tipe: "subjudul",
      teks: "A. Alat Kerja (Tools)",
    },
    {
      tipe: "tabel",
      kolom: ["Alat", "Fungsi"],
      baris: [
        ["Obeng (+ dan −) berinsulasi", "Memasang/melepas sekrup terminal & komponen."],
        ["Tang kombinasi", "Memotong, menjepit, & memilin kabel."],
        ["Tang potong & tang lancip", "Memotong kabel & menjangkau area sempit."],
        ["Tang pengupas (stripper)", "Mengupas isolasi kabel dengan rapi."],
        ["Tespen", "Mendeteksi ada/tidaknya tegangan secara cepat."],
        ["Multimeter / AVO meter", "Mengukur tegangan, arus, & tahanan."],
        ["Megger", "Mengukur tahanan isolasi instalasi."],
        ["Bor listrik & mata bor beton", "Melubangi dinding untuk jalur/fischer."],
        ["Palu & pahat", "Membobok dinding untuk jalur in-bow."],
        ["Waterpass & meteran", "Memastikan pemasangan lurus & rata."],
      ],
    },
    {
      tipe: "subjudul",
      teks: "B. Bahan / Material",
    },
    {
      tipe: "tabel",
      kolom: ["Bahan", "Fungsi"],
      baris: [
        ["Kabel NYA / NYM / NYY", "Penghantar arus listrik antar titik."],
        ["Pipa konduit PVC & fleksibel", "Pelindung kabel di dinding."],
        ["Kotak sambung (T-dus) & inbow-dus", "Tempat sambungan & dudukan komponen."],
        ["Saklar & stop kontak", "Kontrol dan titik akses listrik."],
        ["MCB, ELCB, box panel", "Pengaman & distribusi."],
        ["Fitting & lampu", "Penerangan."],
        ["Lasdop / wire connector", "Penutup & pengaman sambungan kabel."],
        ["Isolasi (electrical tape)", "Membungkus & mengisolasi sambungan."],
        ["Klem kabel & fischer", "Merapikan & memasang kabel/pipa ke dinding."],
        ["Elektroda pembumian (ground rod)", "Batang tembaga/baja yang ditanam untuk arde."],
      ],
    },
    {
      tipe: "info",
      varian: "tips",
      judul: "Pilih yang ber-SNI",
      teks: "Selalu pilih kabel dan komponen berlabel SNI dan dari merek terpercaya. Kabel abal-abal dengan tembaga tipis mudah panas dan menjadi sumber kebakaran. Hemat di bahan listrik bisa berakibat fatal.",
    },
  ],
};

export const babList: Bab[] = [bab1, bab2, bab3, bab4, bab5, bab6];

// ── EVALUASI — 15 SOAL PILIHAN GANDA ─────────────────────────────────────────
export interface SoalModul {
  id: number;
  pertanyaan: string;
  pilihan: string[];
  jawabanBenar: number; // indeks 0–3
  penjelasan: string;
  bab: number; // bab terkait
}

export const soalEvaluasi: SoalModul[] = [
  {
    id: 1,
    pertanyaan: "Apa yang dimaksud dengan instalasi listrik?",
    pilihan: [
      "Alat untuk mengukur pemakaian listrik rumah",
      "Rangkaian peralatan listrik untuk menyalurkan & menggunakan energi listrik secara aman",
      "Tagihan listrik bulanan dari PLN",
      "Jenis lampu hemat energi",
    ],
    jawabanBenar: 1,
    penjelasan: "Instalasi listrik adalah rangkaian peralatan dan perlengkapan listrik yang saling terhubung untuk menyalurkan, membagi, dan menggunakan energi listrik secara aman, andal, dan efisien.",
    bab: 1,
  },
  {
    id: 2,
    pertanyaan: "Standar yang menjadi acuan wajib instalasi listrik tegangan rendah di Indonesia adalah...",
    pilihan: ["PUIL 2011 (SNI 0225:2011)", "ISO 9001", "SOP PLN 2020", "UU Pajak"],
    jawabanBenar: 0,
    penjelasan: "PUIL 2011 (Persyaratan Umum Instalasi Listrik / SNI 0225:2011) adalah standar nasional yang wajib diikuti untuk semua instalasi listrik tegangan rendah, termasuk rumah tinggal.",
    bab: 1,
  },
  {
    id: 3,
    pertanyaan: "Dokumen yang menyatakan bahwa instalasi listrik laik/aman untuk dioperasikan disebut...",
    pilihan: ["SIM", "SLO (Sertifikat Laik Operasi)", "STNK", "NPWP"],
    jawabanBenar: 1,
    penjelasan: "SLO (Sertifikat Laik Operasi) adalah bukti bahwa instalasi sudah diperiksa dan dinyatakan aman. Tanpa SLO, PLN tidak akan menyambungkan listrik ke instalasi baru.",
    bab: 1,
  },
  {
    id: 4,
    pertanyaan: "Berapa besar arus listrik yang sudah dapat membahayakan nyawa manusia jika melewati tubuh?",
    pilihan: ["Sekitar 50 mA (0,05 A)", "Minimal 100 A", "Tepat 220 V", "Di atas 1000 watt"],
    jawabanBenar: 0,
    penjelasan: "Arus sekitar 50 mA (0,05 ampere) saja yang melewati tubuh sudah dapat menyebabkan kematian. Karena itu pengaman ELCB/RCCB yang peka 30 mA sangat dianjurkan.",
    bab: 2,
  },
  {
    id: 5,
    pertanyaan: "Langkah PERTAMA yang benar saat menemukan seseorang tersengat listrik adalah...",
    pilihan: [
      "Langsung menarik tubuh korban dengan tangan",
      "Menyiram korban dengan air",
      "Mematikan sumber listrik terlebih dahulu",
      "Memberi korban minum",
    ],
    jawabanBenar: 2,
    penjelasan: "Matikan sumber listrik lebih dulu. Jangan menyentuh korban yang masih terhubung arus karena Anda bisa ikut tersengat. Setelah aman, beri pertolongan dan hubungi 119.",
    bab: 2,
  },
  {
    id: 6,
    pertanyaan: "Kepanjangan dan tujuan prosedur LOTO adalah...",
    pilihan: [
      "Lock Out Tag Out — mengunci & menandai sumber agar tidak menyala saat dikerjakan",
      "Load On Time Off — mengatur jadwal pemakaian listrik",
      "Light Off Turn On — menyalakan lampu otomatis",
      "Line Output — keluaran tegangan tinggi",
    ],
    jawabanBenar: 0,
    penjelasan: "LOTO (Lockout–Tagout) adalah prosedur mengunci (lockout) dan menandai (tagout) sumber energi listrik agar tidak dinyalakan secara tidak sengaja saat teknisi sedang bekerja.",
    bab: 2,
  },
  {
    id: 7,
    pertanyaan: "Alat Pelindung Diri (APD) yang berfungsi mencegah arus mengalir ke tanah melalui tubuh adalah...",
    pilihan: ["Topi biasa", "Sepatu safety berinsulasi", "Kaus tangan kain", "Kacamata hitam"],
    jawabanBenar: 1,
    penjelasan: "Sepatu safety berinsulasi mencegah tubuh menjadi jalur arus ke tanah (grounding tubuh), sehingga melindungi pekerja dari sengatan listrik.",
    bab: 2,
  },
  {
    id: 8,
    pertanyaan: "Komponen yang memutus arus secara otomatis saat terjadi beban berlebih atau korsleting adalah...",
    pilihan: ["kWh meter", "Stop kontak", "MCB", "Fitting lampu"],
    jawabanBenar: 2,
    penjelasan: "MCB (Miniature Circuit Breaker) memutus aliran listrik otomatis saat terjadi overload atau hubung singkat, mencegah kebakaran dan kerusakan.",
    bab: 3,
  },
  {
    id: 9,
    pertanyaan: "Pengaman yang mampu mendeteksi kebocoran arus sekecil 30 mA untuk melindungi manusia dari sengatan adalah...",
    pilihan: ["ELCB / RCCB", "Sekring 10 A", "Saklar tukar", "kWh meter"],
    jawabanBenar: 0,
    penjelasan: "ELCB/RCCB mendeteksi arus bocor sekecil 30 mA dan langsung memutus daya, jauh lebih peka dari MCB biasa sehingga dapat melindungi nyawa manusia.",
    bab: 3,
  },
  {
    id: 10,
    pertanyaan: "Ukuran kabel NYM yang umum direkomendasikan untuk grup stop kontak (berarde) adalah...",
    pilihan: ["2 × 1,5 mm²", "3 × 2,5 mm²", "1 × 0,5 mm²", "4 × 10 mm²"],
    jawabanBenar: 1,
    penjelasan: "NYM 3 × 2,5 mm² (3 inti: fasa, netral, arde) adalah ukuran standar untuk stop kontak, mampu menangani beban hingga ± 16 A.",
    bab: 3,
  },
  {
    id: 11,
    pertanyaan: "Berdasarkan kode warna SNI/PUIL, warna kabel untuk penghantar NETRAL adalah...",
    pilihan: ["Merah", "Biru", "Loreng kuning-hijau", "Hitam"],
    jawabanBenar: 1,
    penjelasan: "Sesuai PUIL 2011, kabel BIRU dipakai untuk Netral (N), loreng kuning-hijau KHUSUS pembumian (PE), dan hitam/cokelat/merah untuk fasa (L).",
    bab: 4,
  },
  {
    id: 12,
    pertanyaan: "Warna kabel loreng kuning-hijau pada instalasi listrik digunakan KHUSUS untuk...",
    pilihan: ["Fasa (L)", "Netral (N)", "Pembumian / grounding (PE)", "Kabel cadangan"],
    jawabanBenar: 2,
    penjelasan: "Loreng kuning-hijau adalah warna baku untuk penghantar pembumian (PE). Warna ini tidak boleh dipakai untuk fungsi lain demi keselamatan.",
    bab: 4,
  },
  {
    id: 13,
    pertanyaan: "Metode pemasangan instalasi yang kabelnya ditanam di dalam dinding memakai pipa konduit disebut...",
    pilihan: ["Out-bow", "In-bow", "Overhead", "Wireless"],
    jawabanBenar: 1,
    penjelasan: "In-bow (tanam) adalah metode memasang kabel di dalam dinding menggunakan pipa konduit, hasilnya rapi dan tersembunyi. Out-bow dipasang di permukaan dinding.",
    bab: 5,
  },
  {
    id: 14,
    pertanyaan: "Mengapa instalasi rumah perlu dibagi menjadi beberapa grup yang masing-masing diamankan satu MCB?",
    pilihan: [
      "Agar tagihan listrik lebih murah",
      "Supaya bila satu grup bermasalah, grup lain tetap menyala & beban merata",
      "Agar warna kabel lebih beragam",
      "Karena diwajibkan membayar pajak",
    ],
    jawabanBenar: 1,
    penjelasan: "Pembagian grup membuat instalasi lebih aman dan andal: jika satu grup trip/bermasalah, grup lain tetap menyala, dan beban listrik terdistribusi merata.",
    bab: 5,
  },
  {
    id: 15,
    pertanyaan: "Alat yang digunakan untuk mengukur tahanan isolasi instalasi (minimal 1 MΩ) sebelum dialiri listrik adalah...",
    pilihan: ["Tespen", "Megger", "Palu", "Waterpass"],
    jawabanBenar: 1,
    penjelasan: "Megger (insulation tester) mengukur tahanan isolasi instalasi. Sesuai PUIL, nilainya harus minimal 1 MΩ; di bawah itu menandakan kebocoran isolasi yang berbahaya.",
    bab: 6,
  },
];
