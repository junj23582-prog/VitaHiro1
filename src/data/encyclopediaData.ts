export interface OrganGuide {
  id: string;
  name: string;
  latinName: string;
  role: string;
  healthRules: string[];
  enemies: string[];
  superFoods: string[];
  icon: string;
}

export const ORGAN_GUIDES: OrganGuide[] = [
  {
    id: 'heart',
    name: 'Jantung & Pembuluh Darah',
    latinName: 'Cor & Sistema Cardiovasculare',
    role: 'Memompa sekitar 7.500 liter darah per hari ke seluruh sel tubuh tanpa pernah berhenti sedetik pun.',
    healthRules: [
      'Aktivitas aerobik minimal 150 menit per minggu (jalan cepat, renang, bersepeda).',
      'Batasi garam di bawah 1 sendok teh (5 gram) per hari.',
      'Jaga lingkar perut pria < 90 cm dan wanita < 80 cm.',
    ],
    enemies: ['Lemak trans dari minyak jelantah', 'Rokok & asap rokok pasif', 'Stres emosional tak terkelola', 'Kurang gerak (sedentary)'],
    superFoods: ['Ikan Kembung / Salmon (Omega-3)', 'Bawang Putih (Alicin)', 'Oatmeal (Beta-glukan)', 'Minyak Zaitun'],
    icon: '❤️',
  },
  {
    id: 'lungs',
    name: 'Paru-paru & Saluran Napas',
    latinName: 'Pulmo & Apparatus Respiratorius',
    role: 'Pertukaran gas oksigen (O2) ke sel darah merah dan pembuangan karbondioksida (CO2) limbah respirasi.',
    healthRules: [
      'Latihan pernapasan diafragma dalam selama 5 menit setiap pagi.',
      'Gunakan masker saat polusi udara PM2.5 tinggi.',
      'Ventilasi sirkulasi udara kamar tidur yang baik.',
    ],
    enemies: ['Asap rokok dan vape', 'Polusi debu halus PM2.5', 'Ruangan lembap berjamur'],
    superFoods: ['Jahe & Kunyit (Antiinflamasi)', 'Apel (Flavonoid Quercetin)', 'Sayuran Cruciferous'],
    icon: '🫁',
  },
  {
    id: 'gut',
    name: 'Usus & Mikrobioma Tubuh',
    latinName: 'Intestinum & Microbioma',
    role: 'Menyerap 90% nutrisi makanan dan menampung 70% sel sistem kekebalan tubuh serta memproduksi serotonin (hormon bahagia).',
    healthRules: [
      'Konsumsi minimal 25-30 gram serat pangan alami setiap hari.',
      'Kombinasikan makanan prebiotik (bawang, pisang, gandum) dan probiotik (tempe, yogurt, kefir).',
      'Hindari konsumsi antibiotik tanpa indikasi resep dokter.',
    ],
    enemies: ['Gula rafinasi tinggi', 'Pemanis buatan berlebih', 'Stres fisik/mental', 'Alkohol'],
    superFoods: ['Tempe Murni', 'Yogurt Plain', 'Pepaya Matang', 'Bayam & Sayur Daun Hijau'],
    icon: '🧬',
  },
  {
    id: 'brain',
    name: 'Otak & Sistem Saraf Pusat',
    latinName: 'Encephalon & Systema Nervosum',
    role: 'Pusat komando kognitif, memori, emosi, koordinasi gerak tubuh, dan detak biologis sirkadian.',
    healthRules: [
      'Tidur berkualitas 7–8 jam untuk pembersihan racun via sistem glimfatik.',
      'Pelajari keterampilan baru secara berkala untuk menjaga plastisitas sinapsis otak.',
      'Cukupi hidrasi; dehidrasi 2% sudah menurunkan konsentrasi dan memicu pusing.',
    ],
    enemies: ['Kurang tidur kronis', 'Gula darah melonjak tak stabil', 'Isolasi sosial berkepanjangan'],
    superFoods: ['Telur (Kolin)', 'Kacang Kenari / Almond', 'Cokelat Hitam >70%', 'Alpukat'],
    icon: '🧠',
  },
];
