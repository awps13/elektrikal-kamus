// ════════════════════════════════════════════════════════════════════════════
// MODUL PEMBELAJARAN — INSTALASI LISTRIK RUMAH
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
  | { tipe: "diagram" } // memicu diagram pengawatan rumah (dirender di komponen)
  | { tipe: "apd" } // memicu galeri ilustrasi Alat Pelindung Diri (dirender di komponen)
  | { tipe: "komponen-list"; items: { ikon: string; nama: string; teks: string; gambar?: string }[] } // kartu komponen + foto (gambar: URL/path opsional)
  | { tipe: "video"; youtube: string; judul?: string }; // video YouTube tertanam (youtube: ID video)

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
  ringkasan: "Memahami definisi, tujuan, jenis, dan dasar hukum instalasi listrik rumah.",
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
      tipe: "apd",
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
      tipe: "komponen-list",
      items: [
        { ikon: "kwh", nama: "kWh Meter", teks: "Alat ukur milik PLN yang mencatat pemakaian energi (kilowatt-hour) untuk penagihan.", gambar: "https://www.panggung.com/pecwp/wp-content/uploads/2016/06/kwh-meter-2.jpg" },
        { ikon: "phb", nama: "PHB / Box Panel", teks: "Kotak tempat MCB & pengaman — pusat distribusi listrik rumah (Perlengkapan Hubung Bagi).", gambar: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjGSedmNm-wH3wmP4mcisMUb4chTWxep5HoHCPHgFzeX7PhojcJHLEfaNesputcJWM415Rm1PU3Zroz2mM293ZvC49r-NE8R0mYrYMuvKB1i_oMbK9eC9E6VMu3mJROFdFkwfz_Z3w3fKs/s1600/panel+hubung+bagi.jpg" },
        { ikon: "mcb", nama: "MCB", teks: "Miniature Circuit Breaker — memutus arus otomatis saat overload/korsleting.", gambar: "https://www.sinarlistrik.com/wp-content/uploads/2019/08/MCB-2.png" },
        { ikon: "elcb", nama: "ELCB / RCCB", teks: "Mendeteksi kebocoran arus sekecil 30 mA dan memutus daya untuk melindungi nyawa.", gambar: "https://down-id.img.susercontent.com/file/id-11134207-7r992-lrq8neaj9veu47" },
        { ikon: "sekring", nama: "Sekring (Fuse)", teks: "Pengaman lebur model lama; putus saat arus berlebih (kini banyak digantikan MCB).", gambar: "https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//91/MTA-4700618/best-seller_best-seller-sekring-fuse-colok-besar-10-a-_full01.jpg" },
      ],
    },
    {
      tipe: "subjudul",
      teks: "2. Komponen Penghubung & Kontrol",
    },
    {
      tipe: "komponen-list",
      items: [
        { ikon: "saklar", nama: "Saklar (Switch)", teks: "Memutus/menyambung aliran ke lampu. Jenis: tunggal, seri (ganda), tukar (hotel), silang.", gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRorS5p5Jc7aHYKhy1tZDIHmsTUcFk6afGzjA&s" },
        { ikon: "stopkontak", nama: "Stop Kontak (Outlet)", teks: "Titik sambungan untuk peralatan; gunakan tipe 3 lubang (berarde) untuk keamanan.", gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhiK03i3v6xlFn1uEMM1kE0ljO2cJVYP2KTw&s" },
        { ikon: "steker", nama: "Steker (Plug)", teks: "Colokan pada ujung kabel peralatan yang dimasukkan ke stop kontak.", gambar: "http://image.indonetwork.co.id/products/thumbs/500x500/2025/07/16/d8536d4d-35ce-49a8-a2ec-0a007670551f.jpg" },
        { ikon: "kotaksambung", nama: "Kotak Sambung (T-dus)", teks: "Tempat penyambungan kabel agar rapi dan aman.", gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ-vkaYfoaq2QzTYVjwFWUaksETFuT6SPNFw&s" },
      ],
    },
    {
      tipe: "subjudul",
      teks: "3. Komponen Beban & Pelengkap",
    },
    {
      tipe: "komponen-list",
      items: [
        { ikon: "fitting", nama: "Fitting Lampu", teks: "Dudukan tempat memasang lampu (fitting plafon/gantung).", gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXxCoDho0-1yOw6lxjnF7KNw_vdmJOwrpJSw&s" },
        { ikon: "lampu", nama: "Lampu", teks: "Beban penerangan (LED, TL, pijar).", gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQK8ShB-Bfox2G1T_oSe_r2jRHqGlU8TywI2w&s" },
        { ikon: "kabel", nama: "Penghantar / Kabel", teks: "NYA (inti tunggal), NYM (berselubung 2–4 inti), NYY (untuk tanam tanah).", gambar: "https://kitani.co.id/wp-content/uploads/2025/08/kabel-NYA-NYM-dan-NYY.webp" },
        { ikon: "pembumian", nama: "Pembumian (Arde)", teks: "Menyalurkan arus bocor ke bumi sebagai pengaman.", gambar: "https://filebroker-cdn.lazada.co.id/kf/S4dfbd680756a4cf19ec450fe9de1dd8eV.jpg" },
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
      tipe: "video",
      youtube: "AG6c6ix4WqE",
      judul: "Tutorial pemasangan instalasi listrik rumah",
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

// ── BAB 6 — ALAT INSTALASI LISTRIK ───────────────────────────────────────────
const bab6: Bab = {
  id: "alat-bahan",
  no: 6,
  judul: "Alat Instalasi Listrik",
  ikon: "🔧",
  ringkasan: "Daftar peralatan kerja (tools) yang dibutuhkan dalam instalasi listrik beserta fungsinya.",
  estimasiMenit: 8,
  tujuan: [
    "Menyebutkan alat-alat kerja instalasi listrik beserta fungsinya.",
    "Mengenali bentuk masing-masing alat kerja.",
    "Memilih alat yang tepat dan aman.",
  ],
  blok: [
    {
      tipe: "subjudul",
      teks: "Alat Kerja (Tools)",
    },
    {
      tipe: "komponen-list",
      items: [
        { ikon: "obeng", nama: "Obeng (+ dan −) Berinsulasi", teks: "Memasang/melepas sekrup terminal & komponen.", gambar: "https://digipaysatu.kemenkeu.go.id/hotlink//digipay-assets/produk/2022/765498-obeng-plus-minus.png" },
        { ikon: "tang-kombinasi", nama: "Tang Kombinasi", teks: "Memotong, menjepit, & memilin kabel.", gambar: "https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//catalog-image/91/MTA-151013862/yukido_tang_kombinasi_9-_4in1_crimping_skun_kupas_kabel_potong_plier_yukido_full01_oxmxiwua.jpg" },
        { ikon: "tang-potong", nama: "Tang Potong & Tang Lancip", teks: "Memotong kabel & menjangkau area sempit.", gambar: "https://image.powerindociptaenergy.id/s3/productimages/webp/co273485/p1458305/w600-h600/fbe8b1ab-47b3-4697-b50a-59f53f9c5f98w.jpg" },
        { ikon: "stripper", nama: "Tang Pengupas (Stripper)", teks: "Mengupas isolasi kabel dengan rapi.", gambar: "https://storage.googleapis.com/eezee-product-images/force-6912160-insulated-wire-stripper-pliers-6-ir9o_600.png" },
        { ikon: "tespen", nama: "Tespen", teks: "Mendeteksi ada/tidaknya tegangan secara cepat.", gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1d2HjySk5xG-wQ0JCm7XB-Vdh0VQZBNj-AA&s" },
        { ikon: "multimeter", nama: "Multimeter / AVO Meter", teks: "Mengukur tegangan, arus, & tahanan.", gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxsBUuXQmGnABGw7nxM0dtdFDW0HIvSQB_sQ&s" },
        { ikon: "megger", nama: "Megger", teks: "Mengukur tahanan isolasi instalasi.", gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6B3lQ0gM8SGyb7y-kR5cZZiBnOQs3rktgZw&s" },
        { ikon: "bor", nama: "Bor Listrik & Mata Bor Beton", teks: "Melubangi dinding untuk jalur/fischer.", gambar: "https://www.parto.id/asset/foto_produk/ed67c1bfde0a7ee917287486e42bb843.jpg" },
        { ikon: "palu", nama: "Palu & Pahat", teks: "Membobok dinding untuk jalur in-bow.", gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHmJ9nxq8qvd09GN6L3nJYvDrPXuRY47sQFQ&s" },
        { ikon: "waterpass", nama: "Waterpass & Meteran", teks: "Memastikan pemasangan lurus & rata.", gambar: "https://img.lazcdn.com/g/p/8ba4fed4d102f6cefa39e4c4bd8d7342.jpg_720x720q80.jpg" },
      ],
    },
    {
      tipe: "info",
      varian: "tips",
      judul: "Pilih alat ber-SNI & berinsulasi",
      teks: "Gunakan alat kerja berinsulasi (bertanda tegangan, mis. 1000 V) dan berlabel SNI dari merek terpercaya. Alat berinsulasi melindungi dari sengatan saat bekerja, dan alat berkualitas lebih awet serta aman.",
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
