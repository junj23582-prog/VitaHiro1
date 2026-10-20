import { QuizQuestion } from '../types/game';

export const HEALTH_QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    question: "Makan malam di atas jam 19.00 malam otomatis langsung diubah menjadi timbunan lemak tubuh?",
    type: 'myth_or_fact',
    isFact: false,
    correctAnswer: false, // MITOS
    explanation: "MITOS! Tubuh tidak memiliki saklar waktu pembakar kalori otomatis. Yang menentukan penambahan berat badan adalah total kalori harian yang masuk dibandingkan kalori yang dibakar, serta kualitas makanan yang dikonsumsi.",
    category: 'Nutrisi',
  },
  {
    id: 2,
    question: "Minum air es atau dingin dapat membekukan lemak di perut dan membuat buncit?",
    type: 'myth_or_fact',
    isFact: false,
    correctAnswer: false, // MITOS
    explanation: "MITOS! Air es memiliki 0 kalori. Ketika air masuk ke lambung, suhunya segera disesuaikan oleh tubuh menjadi suhu tubuh normal (sekitar 37°C). Perut buncit disebabkan oleh kelebihan kalori, gula, dan kurang aktivitas fisik.",
    category: 'Nutrisi',
  },
  {
    id: 3,
    question: "Ikan kembung lokal Indonesia memiliki kandungan asam lemak Omega-3 yang setara atau bahkan lebih tinggi dari salmon impor?",
    type: 'myth_or_fact',
    isFact: true,
    correctAnswer: true, // FAKTA
    explanation: "FAKTA! Menurut data gizi Kementerian Kesehatan RI, ikan kembung mengandung sekitar 2.2 gram Omega-3 per 100 gram, lebih tinggi daripada salmon (sekitar 1.4 - 1.6 gram per 100 gram) dengan harga yang jauh lebih terjangkau.",
    category: 'Nutrisi',
  },
  {
    id: 4,
    question: "Flu biasa (common cold) dan pilek harus selalu diobati dengan antibiotik agar lekas sembuh?",
    type: 'myth_or_fact',
    isFact: false,
    correctAnswer: false, // MITOS
    explanation: "MITOS! Flu dan batuk pilek biasa disebabkan oleh infeksi VIRUS, sedangkan antibiotik HANYA membunuh BAKTERI. Mengonsumsi antibiotik sembarangan justru memicu resistensi antimikroba (superbug) yang berbahaya.",
    category: 'Imunitas',
  },
  {
    id: 5,
    question: "Kurang tidur secara kronis (di bawah 6 jam per malam) meningkatkan hormon lapar ghrelin dan menekan hormon kenyang leptin?",
    type: 'myth_or_fact',
    isFact: true,
    correctAnswer: true, // FAKTA
    explanation: "FAKTA! Studi neuroendokrin membuktikan kurang tidur mengacaukan regulasi hormon ghrelin (pemicu lapar) dan leptin (sinyal kenyang), sehingga memicu ngidam makanan tinggi gula dan karbohidrat olahan.",
    category: 'Pola Tidur',
  },
  {
    id: 6,
    question: "Berjalan kaki santai selama 10–15 menit tepat setelah makan membantu memangkas lonjakan gula darah (glukosa postprandial)?",
    type: 'myth_or_fact',
    isFact: true,
    correctAnswer: true, // FAKTA
    explanation: "FAKTA! Kontraksi otot saat berjalan kaki merangsang translokasi transporter GLUT-4, menyerap glukosa dari aliran darah ke dalam sel otot tanpa memerlukan lonjakan insulin berlebihan.",
    category: 'Kebugaran',
  },
  {
    id: 7,
    question: "Gula merah, madu, dan gula batu jauh lebih aman bagi penderita diabetes dan boleh dikonsumsi tanpa batasan?",
    type: 'myth_or_fact',
    isFact: false,
    correctAnswer: false, // MITOS
    explanation: "MITOS! Meskipun madu atau gula merah memiliki sedikit mikronutrien, keduanya tetap mengandung sukrosa, fruktosa, dan glukosa tinggi yang tetap menaikkan kadar gula darah jika dikonsumsi berlebihan.",
    category: 'Nutrisi',
  },
  {
    id: 8,
    question: "Saat seseorang mengalami luka bakar akibat cipratan minyak atau air panas, mengoleskan pasta gigi (odol) adalah langkah pertolongan pertama terbaik?",
    type: 'myth_or_fact',
    isFact: false,
    correctAnswer: false, // MITOS
    explanation: "MITOS BERBAHAYA! Pasta gigi memerangkap panas dalam jaringan kulit, memicu iritasi bahan kimia, dan memicu infeksi. Pertolongan pertama yang benar adalah mengalirkan air bersih bersuhu normal mengalir selama 15-20 menit.",
    category: 'Pertolongan Pertama',
  },
  {
    id: 9,
    question: "Berapa anjuran konsumsi gula maksimal per orang per hari menurut standar Kementerian Kesehatan RI & WHO?",
    type: 'multiple_choice',
    options: [
      "4 sendok makan (sekitar 50 gram)",
      "8 sendok makan (sekitar 100 gram)",
      "12 sendok makan (sekitar 150 gram)",
      "Tidak ada batasan selama rajin minum air",
    ],
    correctAnswer: 0,
    explanation: "Pedoman Kemenkes RI menganjurkan batas konsumsi GGL harian per orang: Gula maksimal 4 sendok makan (50 gram), Garam 1 sendok teh (5 gram), dan Lemak 5 sendok makan minyak (67 gram).",
    category: 'Nutrisi',
  },
  {
    id: 10,
    question: "Melakukan peregangan dinamis dan pemanasan sebelum olahraga berat menurunkan risiko cedera robek otot (strain/sprain)?",
    type: 'myth_or_fact',
    isFact: true,
    correctAnswer: true, // FAKTA
    explanation: "FAKTA! Pemanasan menaikkan suhu jaringan otot, meningkatkan elastisitas serat otot, dan melumasi persendian dengan cairan sinovial sebelum beban dinamis intens diterapkan.",
    category: 'Kebugaran',
  },
  {
    id: 11,
    question: "Apakah orang yang terlihat kurus atau berbobot badan normal pasti bebas dari risiko kolesterol tinggi dan perlemakan hati (fatty liver)?",
    type: 'myth_or_fact',
    isFact: false,
    correctAnswer: false, // MITOS
    explanation: "MITOS! Kondisi ini dikenal sebagai TOFI (Thin Outside, Fat Inside) atau sarcopenic obesity. Lemak visceral bisa menumpuk di sekitar organ hati dan jantung meski tampilan fisik tampak kurus, dipicu pola makan junk food dan minim otot.",
    category: 'Nutrisi',
  },
  {
    id: 12,
    question: "Berapa lama waktu hening ideal untuk mengistirahatkan mata dari layar digital menurut aturan 20-20-20?",
    type: 'multiple_choice',
    options: [
      "Tiap 20 menit, lihat benda sejauh 20 kaki (6 meter) selama 20 detik",
      "Tiap 20 jam, tidur selama 20 menit",
      "Tiap 20 menit, pejamkan mata selama 20 menit penuh",
      "Tiap 20 menit, minum 20 tetes obat mata steril",
    ],
    correctAnswer: 0,
    explanation: "Aturan 20-20-20 direkomendasikan dokter mata dunia: setiap 20 menit menatap layar monitor atau ponsel, alihkan pandangan ke objek sejauh 20 kaki (6 meter) selama minimal 20 detik guna melemaskan otot siliaris mata.",
    category: 'Kesehatan Mental',
  },
  {
    id: 13,
    question: "Menyikat gigi langsung segera setelah minum jus jeruk asam atau minuman bersoda sangat dianjurkan?",
    type: 'myth_or_fact',
    isFact: false,
    correctAnswer: false, // MITOS
    explanation: "MITOS! Asam melembutkan lapisan email gigi sementara. Jika langsung disikat dengan pasta gigi abrasif, email gigi akan terkikis cepat. Tunggu minimal 30 menit atau kumur air putih terlebih dahulu.",
    category: 'Nutrisi',
  },
  {
    id: 14,
    question: "Sel darah putih (leukosit) manakah yang berfungsi sebagai pembentuk antibodi spesifik untuk memori imunitas jangka panjang?",
    type: 'multiple_choice',
    options: [
      "Limfosit B (Sel B)",
      "Eritrosit",
      "Trombosit",
      "Basofil",
    ],
    correctAnswer: 0,
    explanation: "Limfosit B berdiferensiasi menjadi sel plasma yang memproduksi antibodi khusus untuk menetralkan antigen patogen, serta membentuk sel memori yang memberi imunitas jangka panjang terhadap infeksi serupa.",
    category: 'Imunitas',
  },
  {
    id: 15,
    question: "Stres kronis yang berkepanjangan memicu pelepasan hormon kortisol berlebih yang menekan efektivitas sistem kekebalan tubuh?",
    type: 'myth_or_fact',
    isFact: true,
    correctAnswer: true, // FAKTA
    explanation: "FAKTA! Hormon kortisol dan adrenalin dalam jangka pendek membantu respon 'fight or flight', namun paparan kronis menekan produksi limfosit dan meningkatkan peradangan sistemik di seluruh tubuh.",
    category: 'Kesehatan Mental',
  },
];
