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
        name: "Level 1 Kuis Formatif",
        questions: [
          {
            question: "Apa definisi teks naratif?",
            answers: {
              A: "Teks yang menjelaskan langkah-langkah melakukan sesuatu",
              B: "Teks yang menceritakan peristiwa dalam urutan waktu tertentu",
              C: "Teks yang menggambarkan suatu tempat secara detail",
              D: "Teks yang memberikan argumen tentang suatu topik",
            },
            correctAnswer: "B",
          },
          {
            question: "Salah satu tujuan utama teks naratif adalah untuk...",
            answers: {
              A: "Menjelaskan prosedur",
              B: "Memberikan laporan",
              C: "Menghibur pembaca",
              D: "Mengkritik suatu fenomena",
            },
            correctAnswer: "C",
          },
          {
            question: "Apa fungsi estetika dari teks naratif?",
            answers: {
              A: "Menyampaikan informasi terbaru",
              B: "Menggunakan bahasa yang deskriptif dan imajinatif",
              C: "Menyajikan data statistik",
              D: "Memberikan instruksi langkah demi langkah",
            },
            correctAnswer: "B",
          },
          {
            question: "Teks naratif dapat digunakan untuk menyampaikan...",
            answers: {
              A: "Nilai-nilai sosial dan budaya",
              B: "Instruksi teknis",
              C: "Grafik dan tabel",
              D: "Perbandingan produk",
            },
            correctAnswer: "A",
          },
          {
            question: "Salah satu fungsi edukatif dari teks naratif adalah...",
            answers: {
              A: "Memberikan argumen logis",
              B: "Mengajarkan nilai-nilai penting dalam kehidupan",
              C: "Menyajikan fakta ilmiah",
              D: "Menyusun laporan keuangan",
            },
            correctAnswer: "B",
          },
          {
            question:
              "Apa yang dimaksud dengan fungsi psikologis dalam teks naratif?",
            answers: {
              A: "Menyediakan data psikologis",
              B: "Memfasilitasi pemahaman emosi dan perasaan manusia",
              C: "Mengkritik teori psikologi",
              D: "Menyajikan eksperimen psikologi",
            },
            correctAnswer: "B",
          },
          {
            question: "Teks naratif sering kali digunakan untuk...",
            answers: {
              A: "Menyampaikan laporan cuaca",
              B: "Menyajikan cerita rakyat dan legenda",
              C: "Menjelaskan proses kimia",
              D: "Menghitung persamaan matematika",
            },
            correctAnswer: "B",
          },
          {
            question:
              "Apa tujuan dari menyampaikan pesan moral dalam teks naratif?",
            answers: {
              A: "Untuk menghibur semata",
              B: "Untuk memberikan pelajaran kepada pembaca",
              C: "Untuk mengkritik kebijakan pemerintah",
              D: "Untuk menyajikan data statistik",
            },
            correctAnswer: "B",
          },
        ],
      },
      {
        name: "Level 2 Kuis Formatif",
        questions: [
          {
            question: "Apa tujuan utama dari teks naratif ekspositoris?",
            answers: {
              A: "Menghibur pembaca",
              B: "Memberikan informasi atau penjelasan",
              C: "Menyampaikan pesan moral",
              D: "Menggugah emosi pembaca",
            },
            correctAnswer: "B",
          },
          {
            question: "Contoh dari teks naratif ekspositoris adalah...",
            answers: {
              A: "Cerita pendek",
              B: "Novel",
              C: "Biografi",
              D: "Fabel",
            },
            correctAnswer: "C",
          },
          {
            question:
              "Teks naratif sugestif sering menggunakan elemen berikut, kecuali...",
            answers: {
              A: "Metafora",
              B: "Simbolisme",
              C: "Data statistik",
              D: "Fiksi",
            },
            correctAnswer: "C",
          },
          {
            question:
              "Apa yang menjadi fokus utama dalam teks naratif sugestif?",
            answers: {
              A: "Penyampaian informasi obyektif",
              B: "Struktur logis",
              C: "Cara penyampaian cerita dan dampaknya",
              D: "Data ilmiah",
            },
            correctAnswer: "C",
          },
          {
            question:
              "Perbedaan utama antara teks naratif ekspositoris dan sugestif adalah pada...",
            answers: {
              A: "Jumlah kata",
              B: "Tujuan dan dampak pada pembaca",
              C: "Penggunaan bahasa formal",
              D: "Jenis font yang digunakan",
            },
            correctAnswer: "B",
          },
          {
            question:
              "Ciri-ciri teks naratif meliputi hal-hal berikut, kecuali...",
            answers: {
              A: "Alur cerita yang jelas",
              B: "Karakter yang berkembang",
              C: "Penyajian data statistik",
              D: "Bahasa deskriptif dan imajinatif",
            },
            correctAnswer: "C",
          },
          {
            question:
              "Apa yang dimaksud dengan teks naratif yang ditulis dalam urutan kronologis?",
            answers: {
              A: "Ditulis berdasarkan urutan abjad",
              B: "Ditulis sesuai urutan waktu kejadian",
              C: "Ditulis dengan menggunakan angka",
              D: "Ditulis tanpa urutan yang jelas",
            },
            correctAnswer: "B",
          },
          {
            question:
              "Teks naratif yang menggunakan teknik kilas balik berarti...",
            answers: {
              A: "Cerita dimulai dari akhir dan kembali ke awal",
              B: "Cerita disajikan dengan urutan waktu maju",
              C: "Cerita disajikan dalam bentuk puisi",
              D: "Cerita menggunakan banyak dialog",
            },
            correctAnswer: "A",
          },
        ],
      },

      {
        name: "Level 3 Kuis Formatif",
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
              "Apakah struktur teks naratif 'Moral Values' selalu ada dalam setiap cerita?",
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

      {
        name: "Summative Quiz",
        questions: [
          {
            question: "Apa definisi dari teks naratif?",
            answers: {
              A: "Teks yang menjelaskan cara melakukan sesuatu",
              B: "Teks yang menceritakan peristiwa dalam urutan waktu tertentu",
              C: "Teks yang memberikan informasi faktual",
              D: "Teks yang mendeskripsikan suatu objek",
            },
            correctAnswer: "B",
          },
          {
            question: "Apa tujuan utama dari teks naratif?",
            answers: {
              A: "Menghibur dan menyampaikan pesan moral",
              B: "Menyampaikan informasi ilmiah",
              C: "Mendiskusikan isu-isu sosial",
              D: "Mempromosikan produk",
            },
            correctAnswer: "A",
          },
          {
            question:
              "Jenis teks naratif yang bertujuan memberikan informasi disebut...",
            answers: {
              A: "Sugestif",
              B: "Ekspositoris",
              C: "Deskriptif",
              D: "Argumentatif",
            },
            correctAnswer: "B",
          },
          {
            question:
              "Teks naratif sugestif biasanya menggunakan elemen berikut, kecuali...",
            answers: {
              A: "Metafora",
              B: "Simbolisme",
              C: "Data statistik",
              D: "Fiksi",
            },
            correctAnswer: "C",
          },
          {
            question: "Fungsi estetika dalam teks naratif adalah...",
            answers: {
              A: "Menyampaikan informasi secara akurat",
              B: "Menggunakan bahasa yang deskriptif dan imajinatif",
              C: "Menyajikan data dan fakta",
              D: "Mengajarkan cara melakukan sesuatu",
            },
            correctAnswer: "B",
          },
          {
            question:
              "Apa yang dimaksud dengan fungsi sosial dan budaya dari teks naratif?",
            answers: {
              A: "Menyampaikan nilai-nilai sosial dan norma budaya",
              B: "Mengajarkan keterampilan teknis",
              C: "Menyajikan data ekonomi",
              D: "Menjelaskan fenomena alam",
            },
            correctAnswer: "A",
          },
          {
            question:
              "Teks naratif dapat mengajarkan pembaca tentang nilai-nilai penting dalam kehidupan. Ini merupakan fungsi...",
            answers: {
              A: "Estetika",
              B: "Edukatif",
              C: "Psikologis",
              D: "Ekonomi",
            },
            correctAnswer: "B",
          },
          {
            question:
              "Apa perbedaan utama antara teks naratif ekspositoris dan sugestif?",
            answers: {
              A: "Ekspositoris fokus pada hiburan, sugestif fokus pada informasi",
              B: "Ekspositoris fokus pada informasi, sugestif fokus pada hiburan",
              C: "Ekspositoris menggunakan metafora, sugestif menggunakan data",
              D: "Ekspositoris menggunakan simbolisme, sugestif menggunakan fakta",
            },
            correctAnswer: "B",
          },
          {
            question: "Ciri-ciri teks naratif antara lain, kecuali...",
            answers: {
              A: "Mengandung alur cerita yang jelas",
              B: "Memiliki karakter yang berkembang",
              C: "Menggunakan bahasa formal dan teknis",
              D: "Mengandung konflik dan resolusi",
            },
            correctAnswer: "C",
          },
          {
            question:
              "Apa yang dimaksud dengan 'Orientation' dalam struktur teks naratif?",
            answers: {
              A: "Menunjukkan konflik dalam cerita",
              B: "Memperkenalkan tokoh, latar, dan situasi awal",
              C: "Menggambarkan penyelesaian konflik",
              D: "Menyampaikan pesan moral",
            },
            correctAnswer: "B",
          },
          {
            question:
              "Apa yang dimaksud dengan 'Complication' dalam struktur teks naratif?",
            answers: {
              A: "Memperkenalkan tokoh dan latar",
              B: "Menunjukkan konflik atau masalah dalam cerita",
              C: "Menggambarkan penyelesaian konflik",
              D: "Menyampaikan pesan moral",
            },
            correctAnswer: "B",
          },
          {
            question:
              "Apa yang dimaksud dengan 'Resolution' dalam struktur teks naratif?",
            answers: {
              A: "Memperkenalkan tokoh dan latar",
              B: "Menunjukkan konflik atau masalah dalam cerita",
              C: "Menggambarkan cara penyelesaian konflik",
              D: "Menyampaikan pesan moral",
            },
            correctAnswer: "C",
          },
          {
            question:
              "Jenis teks naratif yang sering digunakan dalam konteks akademik adalah...",
            answers: {
              A: "Sugestif",
              B: "Ekspositoris",
              C: "Deskriptif",
              D: "Argumentatif",
            },
            correctAnswer: "B",
          },
          {
            question: "Contoh teks naratif sugestif adalah...",
            answers: {
              A: "Biografi",
              B: "Laporan perjalanan",
              C: "Cerita pendek",
              D: "Artikel sejarah",
            },
            correctAnswer: "C",
          },
          {
            question: "Fungsi psikologis dari teks naratif adalah...",
            answers: {
              A: "Menyampaikan informasi teknis",
              B: "Memfasilitasi pemahaman emosi dan perasaan manusia",
              C: "Menyajikan data dan fakta",
              D: "Mengajarkan keterampilan praktis",
            },
            correctAnswer: "B",
          },
          {
            question:
              "Teks naratif yang mengandung pesan moral dapat mengajarkan pembaca tentang...",
            answers: {
              A: "Nilai-nilai ekonomi",
              B: "Nilai-nilai penting dalam kehidupan",
              C: "Teknik ilmiah",
              D: "Prosedur operasi",
            },
            correctAnswer: "B",
          },
          {
            question: "Teks naratif sering kali ditulis dalam urutan...",
            answers: {
              A: "Acak",
              B: "Kronologis",
              C: "Alfabetis",
              D: "Numerik",
            },
            correctAnswer: "B",
          },
          {
            question:
              "Apa yang dimaksud dengan 'Moral Values' dalam struktur teks naratif?",
            answers: {
              A: "Memperkenalkan tokoh dan latar",
              B: "Menunjukkan konflik atau masalah dalam cerita",
              C: "Menggambarkan cara penyelesaian konflik",
              D: "Kesimpulan atau pesan moral yang ingin disampaikan",
            },
            correctAnswer: "D",
          },
          {
            question: "Teks naratif ekspositoris lebih menekankan pada...",
            answers: {
              A: "Hiburan dan emosi",
              B: "Penyampaian informasi yang akurat dan obyektif",
              C: "Penggunaan bahasa yang imajinatif",
              D: "Penggunaan metafora dan simbolisme",
            },
            correctAnswer: "B",
          },
          {
            question: "Dalam teks naratif, konflik berfungsi sebagai...",
            answers: {
              A: "Pengantar cerita",
              B: "Inti cerita",
              C: "Kesimpulan cerita",
              D: "Latar belakang cerita",
            },
            correctAnswer: "B",
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
