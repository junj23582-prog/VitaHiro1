import { SimScenario } from '../types/game';

export const SIM_SCENARIOS: SimScenario[] = [
  {
    id: 1,
    timeLabel: '06:00 Pagi',
    scenarioTitle: 'Bangun Tidur & Ritual Pertama',
    situation: 'Alarm berbunyi. Mulut terasa kering dan tubuh masih agak kaku setelah beristirahat 7 jam.',
    contextIcon: '🌅',
    choices: [
      {
        text: 'Minum 2 gelas air mineral hangat & peregangan tubuh 5 menit di samping kasur',
        impacts: { energy: 15, fitness: 10, immunity: 10, mental: 10 },
        outcomeStory: 'Air hangat mengaktifkan sistem metabolisme, merehidrasi organ dalam setelah tidur malam, dan peregangan melancarkan sirkulasi darah ke otak.',
      },
      {
        text: 'Langsung scroll media sosial di kasur selama 30 menit sambil mengeluh malas',
        impacts: { energy: -10, fitness: -5, immunity: 0, mental: -15 },
        outcomeStory: 'Cahaya biru layar seketika memicu lonjakan dopamin murah dan rasa cemas melihat berita, membuat mata lelah sebelum hari dimulai.',
      },
    ],
  },
  {
    id: 2,
    timeLabel: '07:30 Pagi',
    scenarioTitle: 'Menu Sarapan Penentu Hari',
    situation: 'Kamu bersiap berangkat kerja/sekolah. Perut memberi sinyal lapar untuk bahan bakar aktivitas.',
    contextIcon: '🍳',
    choices: [
      {
        text: 'Sarapan telur rebus, roti gandum, buah pisang, dan teh hijau tanpa gula',
        impacts: { energy: 20, fitness: 10, immunity: 15, mental: 10 },
        outcomeStory: 'Kombinasi protein dan karbohidrat kompleks menjaga glukosa darah stabil tanpa lonjakan insulin tajam. Kamu fokus tanpa rasa mengantuk!',
      },
      {
        text: 'Beli 4 gorengan bakwan minyak pekat plus kopi susu instan ekstra kental manis',
        impacts: { energy: -5, fitness: -10, immunity: -15, mental: -5 },
        outcomeStory: 'Gula instan memberi ledakan energi 20 menit, lalu diikuti penurunan energi mendadak (sugar crash) dan rasa begah di ulu hati.',
      },
    ],
  },
  {
    id: 3,
    timeLabel: '10:30 Pagi',
    scenarioTitle: 'Dilema Mobilitas Kantor',
    situation: 'Ruang pertemuan berada di lantai 3 gedung. Rekan kerjamu mengajak menunggu lift yang sedang penuh sesak.',
    contextIcon: '🏢',
    choices: [
      {
        text: 'Pilih naik tangga manual dengan langkah mantap dan ritmis',
        impacts: { energy: 5, fitness: 20, immunity: 5, mental: 10 },
        outcomeStory: 'Naik tangga melatih otot quadriceps, gluteus, dan menaikkan denyut jantung aerobik ringan yang menyegarkan pikiran penat!',
      },
      {
        text: 'Tetap berdiri pasif menunggu antrean lift sambil makan biskuit manis',
        impacts: { energy: -5, fitness: -5, immunity: 0, mental: 0 },
        outcomeStory: 'Kamu kehilangan kesempatan aktivitas fisik NEAT (Non-Exercise Activity Thermogenesis) yang krusial untuk kesehatan kardiovaskular.',
      },
    ],
  },
  {
    id: 4,
    timeLabel: '13:00 Siang',
    scenarioTitle: 'Tantangan Makan Siang & Hidrasi',
    situation: 'Rekan-rekan kantor mengajak pesan ayam goreng krispi tepung berlebih dan minuman es boba ekstra gula.',
    contextIcon: '🍱',
    choices: [
      {
        text: 'Pilih warteg lauk ikan pepes/kembung, sayur bening bayam, tahu tempe, dan es teh tawar',
        impacts: { energy: 15, fitness: 5, immunity: 20, mental: 15 },
        outcomeStory: 'Asupan gizi padat mikronutrien! Sayuran hijau dan protein ikan membuat otak tetap tajam saat presentasi siang tanpa ' + 'kantuk pascamakan (food coma).',
      },
      {
        text: 'Ikut pesan paket junk food dobel porsi dengan soda ukuran jumbo',
        impacts: { energy: -20, fitness: -15, immunity: -15, mental: -10 },
        outcomeStory: 'Tubuh mengerahkan cadangan energi besar ke saluran pencernaan untuk mencerna lemak jenuh dan gula, memicu kantuk luar biasa di jam 14:00.',
      },
    ],
  },
  {
    id: 5,
    timeLabel: '16:00 Sore',
    scenarioTitle: 'Mata Lelah & Deadline Menumpuk',
    situation: 'Punggung kaku dan mata mulai perih setelah 4 jam berturut-turut menatap monitor.',
    contextIcon: '💻',
    choices: [
      {
        text: 'Praktikkan aturan 20-20-20, minum sebotol air putih, dan jalan keliling 5 menit',
        impacts: { energy: 15, fitness: 10, immunity: 10, mental: 20 },
        outcomeStory: 'Otot siliaris mata berelaksasi, hidrasi kembali terpenuhi, dan kamu kembali menyelesaikan sisa pekerjaan dengan tenang.',
      },
      {
        text: 'Teguk minuman energi kalengan tinggi kafein sintetik dan tahan buang air kecil',
        impacts: { energy: -10, fitness: -10, immunity: -15, mental: -20 },
        outcomeStory: 'Jantung berdebar gelisah (palpitasi), ginjal terbebani menahan kencing, dan kecemasanmu justru meningkat.',
      },
    ],
  },
  {
    id: 6,
    timeLabel: '19:30 Malam',
    scenarioTitle: 'Waktu Luang Pasca Jam Sibuk',
    situation: 'Kamu sudah tiba di rumah. Masih ada waktu luang sebelum jam istirahat malam.',
    contextIcon: '🏃',
    choices: [
      {
        text: 'Jalan santai/jogging 20 menit keliling lingkungan rumah lalu mandi air hangat',
        impacts: { energy: 10, fitness: 25, immunity: 15, mental: 20 },
        outcomeStory: 'Pelepasan hormon endorfin menyingkirkan stres seharian. Suhu tubuh yang turun pascamandi hangat mempersiapkan melatonin alami tidur!',
      },
      {
        text: 'Langsung rebahan di sofa, pesan mi instan porsi dobel, dan tonton serial 3 jam',
        impacts: { energy: -15, fitness: -10, immunity: -10, mental: -5 },
        outcomeStory: 'Perut kembung karena garam tinggi, otot melemah, dan mata terstimulasi berlebih menjelang jam biologis tidur.',
      },
    ],
  },
  {
    id: 7,
    timeLabel: '22:30 Malam',
    scenarioTitle: 'Persiapan Masuk Gerbang Tidur Nyenyak',
    situation: 'Waktu menunjukkan pukul setengah sebelas malam. Besok ada tanggung jawab penting menanti.',
    contextIcon: '🌙',
    choices: [
      {
        text: 'Jauhkan smartphone dari tempat tidur, redupkan lampu, dan tarik napas dalam',
        impacts: { energy: 25, fitness: 10, immunity: 25, mental: 25 },
        outcomeStory: 'Hormon melatonin mengalir deras. Kamu memasuki fase tidur dalam (Deep Sleep & REM) yang memperbaiki sel rusak dan menyegarkan sistem imun!',
      },
      {
        text: 'Bawa ponsel ke tempat tidur, nonton video pendek sampai jam 02:00 pagi',
        impacts: { energy: -35, fitness: -15, immunity: -30, mental: -30 },
        outcomeStory: 'Irama sirkadian hancur. Leukosit tubuh melemah, otak gagal membersihkan limbah metabolik beta-amiloid, dan besok bangun dengan kepala berat.',
      },
    ],
  },
];
