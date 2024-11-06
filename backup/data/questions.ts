export interface Question {
  question: string;
  answers: {
    [key: string]: string;
  };
  correctAnswer: string;
}

export interface Quiz {
  name: string;
  questions: Question[];
}

export interface Material {
  name: string;
  quizzes: Quiz[];
}

export const materials: Material[] = [
  {
    name: "Teks Naratif",
    quizzes: [
      {
        name: "Definisi Teks Naratif",
        questions: [
          {
            question: "Apa yang dimaksud dengan teks naratif?",
            answers: {
              A: "Teks yang menjelaskan cara melakukan sesuatu secara rinci.",
              B: "Teks yang menceritakan suatu peristiwa atau rangkaian peristiwa dalam urutan waktu tertentu.",
              C: "Teks yang berisi data dan angka untuk analisis.",
              D: "Teks yang berfungsi untuk membandingkan dua objek atau ide.",
            },
            correctAnswer: "B",
          },
          {
            question: "Apa tujuan utama dari teks naratif?",
            answers: {
              A: "Menyajikan fakta ilmiah dan data statistik.",
              B: "Menghibur pembaca dan menyampaikan pesan moral atau nilai-nilai tertentu.",
              C: "Menyediakan panduan langkah demi langkah untuk melakukan tugas tertentu.",
              D: "Menganalisis dan membandingkan teori-teori ilmiah.",
            },
            correctAnswer: "B",
          },
          {
            question:
              "Jenis teks apa yang bisa termasuk dalam kategori teks naratif?",
            answers: {
              A: "Manual pengguna",
              B: "Cerita pendek",
              C: "Artikel ilmiah",
              D: "Laporan keuangan",
            },
            correctAnswer: "B",
          },
          {
            question: "Teks naratif dapat berupa cerita yang bersifat:",
            answers: {
              A: "Hanya nyata",
              B: "Hanya fiktif",
              C: "Baik nyata maupun fiktif",
              D: "Hanya teknis dan informatif",
            },
            correctAnswer: "C",
          },
          {
            question:
              "Salah satu elemen penting yang sering ditemukan dalam teks naratif adalah:",
            answers: {
              A: "Diagram dan tabel",
              B: "Urutan peristiwa dalam waktu tertentu",
              C: "Langkah-langkah prosedural",
              D: "Analisis data statistik",
            },
            correctAnswer: "B",
          },
        ],
      },
      {
        name: "Tujuan Teks Naratif",
        questions: [
          {
            question:
              "Apa tujuan utama dari menyajikan cerita dalam teks naratif?",
            answers: {
              A: "Mengajarkan keterampilan matematika",
              B: "Menghibur pembaca atau pendengar",
              C: "Menyajikan data statistik",
              D: "Mengukur tingkat kebugaran",
            },
            correctAnswer: "B",
          },
          {
            question:
              "Selain menghibur, apa tujuan lain dari teks naratif yang sering ditemukan?",
            answers: {
              A: "Mengukur hasil eksperimen",
              B: "Menyampaikan pesan moral atau nilai",
              C: "Menghitung pengeluaran",
              D: "Merencanakan jadwal kegiatan",
            },
            correctAnswer: "B",
          },
          {
            question:
              "Bagaimana teks naratif dapat digunakan untuk memberikan informasi?",
            answers: {
              A: "Dengan menyajikan laporan keuangan",
              B: "Dengan mengajarkan tentang sejarah, budaya, atau peristiwa penting",
              C: "Dengan menghitung anggaran",
              D: "Dengan merancang strategi pemasaran",
            },
            correctAnswer: "B",
          },
          {
            question:
              'Apa yang dimaksud dengan "menghibur" dalam konteks teks naratif?',
            answers: {
              A: "Menyajikan data ilmiah",
              B: "Memberikan instruksi teknis",
              C: "Menghitung laba rugi",
              D: "Membuat cerita yang menarik dan menggugah perasaan",
            },
            correctAnswer: "D",
          },
          {
            question:
              "Mengapa penulis teks naratif sering menyampaikan pesan moral?",
            answers: {
              A: "Untuk memberikan nilai tambah pada laporan",
              B: "Untuk memotivasi pembaca dengan pelajaran hidup",
              C: "Untuk mencatat inventaris barang",
              D: "Untuk merancang sistem informasi",
            },
            correctAnswer: "B",
          },
        ],
      },

      {
        name: "Fungsi Teks Naratif",
        questions: [
          {
            question:
              "Apa fungsi utama dari penggunaan bahasa deskriptif dan imajinatif dalam teks naratif?",
            answers: {
              A: "Untuk memberikan informasi secara akurat",
              B: "Untuk menghibur pembaca dengan cerita yang menyenangkan",
              C: "Untuk meningkatkan keindahan dan keterlibatan pembaca dalam pengalaman cerita",
              D: "Untuk mengajarkan keterampilan bahasa yang baru",
            },
            correctAnswer: "C",
          },
          {
            question:
              "Bagaimana teks naratif dapat mencerminkan budaya suatu masyarakat?",
            answers: {
              A: "Dengan menyajikan data statistik tentang masyarakat",
              B: "Dengan menyampaikan nilai-nilai sosial, tradisi, dan norma budaya melalui cerita",
              C: "Dengan menjelaskan sejarah politik masyarakat",
              D: "Dengan memberikan panduan praktis tentang kehidupan sehari-hari",
            },
            correctAnswer: "B",
          },
          {
            question:
              "Apa yang dimaksud dengan fungsi edukatif dalam teks naratif?",
            answers: {
              A: "Menghibur pembaca dengan cerita yang penuh fantasi",
              B: "Memberikan pelajaran moral dan pengetahuan kepada pembaca",
              C: "Menggunakan bahasa yang kompleks dan sulit dimengerti",
              D: "Menggambarkan proses sosial dan budaya secara mendetail",
            },
            correctAnswer: "B",
          },
          {
            question:
              "Fungsi psikologis dari teks naratif membantu pembaca dalam hal apa?",
            answers: {
              A: "Memahami fakta-fakta ilmiah",
              B: "Mengembangkan keterampilan menulis",
              C: "Memahami emosi dan perasaan manusia serta mengembangkan empati",
              D: "Menghafal informasi sejarah",
            },
            correctAnswer: "C",
          },
          {
            question:
              "Mengapa cerita rakyat, mitos, legenda, dan fabel sering dimasukkan dalam teks naratif?",
            answers: {
              A: "Karena mereka merupakan bagian dari pelajaran matematika",
              B: "Karena mereka mencerminkan aspek sosial dan budaya dari suatu masyarakat",
              C: "Karena mereka berisi informasi ilmiah yang akurat",
              D: "Karena mereka menawarkan panduan praktis tentang kebijakan pemerintah",
            },
            correctAnswer: "B",
          },
        ],
      },

      {
        name: "Jenis-jenis Teks Naratif",
        questions: [
          {
            question: "Apa tujuan utama dari teks naratif ekspositoris?",
            answers: {
              A: "Menghibur pembaca",
              B: "Memberikan informasi atau menjelaskan sesuatu",
              C: "Menggugah emosi pembaca",
              D: "Menyampaikan pesan moral",
            },
            correctAnswer: "B",
          },
          {
            question:
              "Teks naratif jenis apa yang sering digunakan dalam konteks akademik atau profesional?",
            answers: {
              A: "Teks naratif sugestif",
              B: "Teks naratif ekspositoris",
              C: "Teks naratif fiksi",
              D: "Teks naratif fabel",
            },
            correctAnswer: "B",
          },
          {
            question:
              "Manakah dari berikut ini yang merupakan contoh teks naratif sugestif?",
            answers: {
              A: "Biografi",
              B: "Laporan perjalanan",
              C: "Novel",
              D: "Artikel sejarah",
            },
            correctAnswer: "C",
          },
          {
            question:
              "Apa yang menjadi fokus utama dalam teks naratif sugestif?",
            answers: {
              A: "Struktur yang jelas dan logis",
              B: "Penyampaian informasi yang akurat dan obyektif",
              C: "Cara penyampaian cerita dan dampaknya terhadap pembaca",
              D: "Penyampaian informasi dalam konteks akademik",
            },
            correctAnswer: "C",
          },
          {
            question:
              "Teks naratif mana yang sering menggunakan elemen fiksi, metafora, dan simbolisme untuk menyampaikan makna yang lebih dalam?",
            answers: {
              A: "Laporan perjalanan",
              B: "Artikel sejarah",
              C: "Fabel",
              D: "Biografi",
            },
            correctAnswer: "C",
          },
        ],
      },

      {
        name: "Perbedaan Teks Naratif",
        questions: [
          {
            question: "Apa tujuan utama dari teks naratif ekspositoris?",
            answers: {
              A: "Menghibur pembaca dengan cerita fiksi",
              B: "Memberikan informasi atau penjelasan tentang suatu topik",
              C: "Menggugah emosi pembaca melalui metafora",
              D: "Menyampaikan pesan moral dengan gaya bahasa figuratif",
            },
            correctAnswer: "B",
          },
          {
            question:
              "Apa perbedaan utama antara teks naratif ekspositoris dan teks naratif sugestif dalam hal isi dan konten?",
            answers: {
              A: "Teks naratif ekspositoris menggunakan bahasa kiasan, sedangkan teks naratif sugestif menggunakan fakta",
              B: "Teks naratif ekspositoris mengandung elemen fiksi dan simbolik, sedangkan teks naratif sugestif mengandung fakta dan data",
              C: "Teks naratif ekspositoris mengandung fakta dan data obyektif, sedangkan teks naratif sugestif mengandung elemen fiksi dan imajinatif",
              D: "Teks naratif ekspositoris dan teks naratif sugestif keduanya bersifat informatif dan analitis",
            },
            correctAnswer: "C",
          },
          {
            question: "Struktur mana yang lebih ketat dan formal?",
            answers: {
              A: "Struktur teks naratif sugestif",
              B: "Struktur teks naratif ekspositoris",
              C: "Struktur teks naratif kreatif",
              D: "Struktur teks naratif dramatik",
            },
            correctAnswer: "B",
          },
          {
            question:
              "Gaya bahasa apa yang digunakan dalam teks naratif sugestif?",
            answers: {
              A: "Bahasa yang jelas dan lugas",
              B: "Bahasa yang imajinatif dan figuratif",
              C: "Bahasa yang langsung dan sederhana",
              D: "Bahasa yang teknis dan formal",
            },
            correctAnswer: "B",
          },
          {
            question:
              "Dalam konteks apa teks naratif ekspositoris sering digunakan?",
            answers: {
              A: "Dalam cerita fiksi dan novel",
              B: "Dalam konteks sastra dan seni",
              C: "Dalam konteks akademis dan profesional",
              D: "Dalam konteks hiburan dan komunikasi kreatif",
            },
            correctAnswer: "C",
          },
        ],
      },

      {
        name: "Ciri-ciri Teks Naratif",
        questions: [
          {
            question:
              "Apa ciri utama dari teks naratif yang membedakannya dari jenis teks lainnya?",
            answers: {
              A: "Mengandung data statistik dan grafik",
              B: "Menggunakan bahasa yang bersifat deskriptif dan imajinatif",
              C: "Hanya berisi dialog tanpa alur cerita",
              D: "Menyajikan informasi secara langsung tanpa adanya alur cerita",
            },
            correctAnswer: "B",
          },
          {
            question:
              "Apa yang dimaksud dengan alur cerita dalam teks naratif?",
            answers: {
              A: "Bagian dari cerita yang berisi dialog antar karakter",
              B: "Urutan peristiwa yang jelas dari awal hingga akhir cerita",
              C: "Deskripsi karakter dan latar tempat",
              D: "Penggunaan bahasa figuratif dalam cerita",
            },
            correctAnswer: "B",
          },
          {
            question:
              "Dalam teks naratif, apa fungsi dari konflik dan resolusi?",
            answers: {
              A: "Untuk menjelaskan latar belakang karakter",
              B: "Sebagai inti dari cerita yang memberikan ketegangan dan penyelesaian",
              C: "Hanya sebagai informasi tambahan",
              D: "Untuk menggantikan penggunaan bahasa deskriptif",
            },
            correctAnswer: "B",
          },
          {
            question:
              "Apa yang dimaksud dengan teknik kilas balik dalam teks naratif?",
            answers: {
              A: "Menyajikan cerita dalam urutan waktu yang tidak beraturan",
              B: "Menggunakan bahasa yang sangat deskriptif",
              C: "Mengembalikan pembaca ke peristiwa yang terjadi di masa lalu untuk memberikan latar belakang atau informasi tambahan",
              D: "Menceritakan kejadian di masa depan",
            },
            correctAnswer: "C",
          },
          {
            question:
              "Mengapa setting (waktu dan tempat) penting dalam teks naratif?",
            answers: {
              A: "Untuk menghindari penggunaan bahasa figuratif",
              B: "Untuk memberikan konteks dan latar belakang bagi alur cerita dan karakter",
              C: "Hanya sebagai tambahan yang tidak mempengaruhi alur cerita",
              D: "Untuk membuat cerita menjadi lebih singkat",
            },
            correctAnswer: "B",
          },
        ],
      },

      {
        name: "Struktur Teks Naratif",
        questions: [
          {
            question:
              "Struktur Teks Naratif mana yang memperkenalkan tokoh, latar, dan situasi awal?",
            answers: {
              A: "Complication",
              B: "Orientation",
              C: "Resolution",
              D: "Moral Values",
            },
            correctAnswer: "B",
          },
          {
            question:
              "Struktur Teks Naratif mana yang menunjukkan konflik atau masalah yang muncul dalam cerita?",
            answers: {
              A: "Orientation",
              B: "Complication",
              C: "Resolution",
              D: "Moral Values",
            },
            correctAnswer: "B",
          },
          {
            question:
              "Struktur Teks Naratif mana yang menggambarkan cara penyelesaian konflik atau masalah dalam cerita?",
            answers: {
              A: "Orientation",
              B: "Complication",
              C: "Resolution",
              D: "Moral Values",
            },
            correctAnswer: "C",
          },
          {
            question:
              "Apakah struktur teks naratif Moral Values selalu ada dalam setiap cerita?",
            answers: {
              A: "Ya, selalu ada",
              B: "Tidak, tidak selalu ada",
              C: "Tidak, hanya ada dalam cerita yang memiliki moral",
              D: "Tidak, hanya ada dalam cerita yang tidak memiliki moral",
            },
            correctAnswer: "B",
          },
          {
            question:
              "Struktur teks naratif mana yang menggambarkan kesimpulan atau pesan moral yang ingin disampaikan?",
            answers: {
              A: "Orientation",
              B: "Complication",
              C: "Resolution",
              D: "Moral Values",
            },
            correctAnswer: "D",
          },
        ],
      },
      // Add more quizzes for Narrative Text here
    ],
  },
  // Add more materials here
];
