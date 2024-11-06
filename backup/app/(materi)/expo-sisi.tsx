import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import ParallaxScrollView from "../../components/ParallaxScrollView";
import { DefinitionItem } from "../../components/DefinitionItem";
import BulletList from "../../components/BulletList";
import BulletList1 from "../../components/BulletList1";
import { ThemedText } from "../../components/ThemedText";
import { ThemedView } from "../../components/ThemedView";
import { Collapsible } from "../../components/Collapsible";
import { StartQuizButton } from "../../components/StartQuizButton";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../redux/slices/authSlice";
import { Ionicons } from "@expo/vector-icons";
import { RootState, AppDispatch } from "../../redux/store";
import {
  fetchScoresAsync,
  selectGeneralQuizScores,
  selectClassQuizScores,
} from "../../redux/slices/quizSlice";

const { width, height } = Dimensions.get("window");

interface NaratifTextProps {
  classId?: string;
}

export default function NaratifText({ classId }: NaratifTextProps) {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => selectUser(state));
  const generalQuizScores = useSelector(selectGeneralQuizScores);
  const classQuizScores = useSelector(selectClassQuizScores);
  const params = useLocalSearchParams<{ classId: string }>();
  const effectiveClassId = classId || params.classId;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [generalQuizStatus, setGeneralQuizStatus] = useState<
    Record<string, boolean>
  >({
    "Definisi Teks Naratif": false,
    "Tujuan Teks Naratif": false,
    "Fungsi Teks Naratif": false,
    "Jenis-jenis Teks Naratif": false,
    "Perbedaan Teks Naratif": false,
    "Ciri-ciri Teks Naratif": false,
    "Struktur Teks Naratif": false,
  });

  const [classQuizStatus, setClassQuizStatus] = useState<
    Record<string, boolean>
  >({
    "Definisi Teks Naratif": false,
    "Tujuan Teks Naratif": false,
    "Fungsi Teks Naratif": false,
    "Jenis-jenis Teks Naratif": false,
    "Perbedaan Teks Naratif": false,
    "Ciri-ciri Teks Naratif": false,
    "Struktur Teks Naratif": false,
  });

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      setError(null);
      dispatch(fetchScoresAsync())
        .unwrap()
        .then(() => setIsLoading(false))
        .catch((err) => {
          setError("Failed to load quiz scores. Please try again.");
          setIsLoading(false);
        });
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (generalQuizScores.length > 0) {
      const newGeneralQuizStatus = { ...generalQuizStatus };
      generalQuizScores.forEach((score) => {
        if (score.quizName in newGeneralQuizStatus) {
          newGeneralQuizStatus[score.quizName] = score.score > 0;
        }
      });
      setGeneralQuizStatus(newGeneralQuizStatus);
    }
  }, [generalQuizScores]);

  useEffect(() => {
    if (classQuizScores.length > 0 && effectiveClassId) {
      const newClassQuizStatus = { ...classQuizStatus };
      classQuizScores.forEach((score) => {
        if (
          score.quizName in newClassQuizStatus &&
          score.classId === effectiveClassId
        ) {
          newClassQuizStatus[score.quizName] = score.score > 0;
        }
      });
      setClassQuizStatus(newClassQuizStatus);
    }
  }, [classQuizScores, effectiveClassId]);

  return (
    <ParallaxScrollView
      headerBackgroundColor="#E6F3FF"
      headerImage={
        <View style={styles.headerImageContainer}>
          <Ionicons
            size={250}
            name="book-outline"
            style={styles.headerImage}
          />
        </View>
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          speech={false}>
          Teks Naratifsasas
        </ThemedText>
      </ThemedView>
      <ThemedText>
        Teks naratif adalah jenis teks yang menceritakan suatu peristiwa atau
        rangkaian peristiwa yang terjadi dalam suatu urutan waktu tertentu, baik
        yang bersifat nyata maupun fiktif.
      </ThemedText>
      <Collapsible
        title="Definisi Teks Naratif"
        isLockedGeneral={false}
        isLockedClass={false}
        classId={effectiveClassId}>
        <ThemedText>
          Teks naratif adalah jenis teks yang menceritakan suatu peristiwa atau
          rangkaian peristiwa yang terjadi dalam suatu urutan waktu tertentu,
          baik yang bersifat nyata maupun fiktif. Teks naratif biasanya memiliki
          tujuan untuk menghibur pembaca sekaligus menyampaikan pesan moral atau
          nilai-nilai tertentu. (Anderson & Anderson, 1997)
        </ThemedText>
        <DefinitionItem titlee="Urutan Waktu">
          <ThemedText>
            Dalam teks naratif, peristiwa disusun dalam urutan waktu tertentu,
            mengikuti kronologi, baik yang bersifat nyata maupun fiktif.
          </ThemedText>
        </DefinitionItem>
        <DefinitionItem titlee="Jenis Peristiwa">
          <ThemedText>
            Teks naratif bisa menceritakan peristiwa yang benar-benar terjadi
            atau peristiwa yang sepenuhnya imajinatif.
          </ThemedText>
        </DefinitionItem>
        <DefinitionItem titlee="Tujuan Teks Naratif">
          <ThemedText>
            Tujuan utama teks naratif adalah untuk menghibur pembaca, tetapi
            juga sering kali menyampaikan pesan moral atau nilai-nilai
            tertentu."
          </ThemedText>
        </DefinitionItem>
        <DefinitionItem titlee="Quiz Definisi Teks Naratif">
          <StartQuizButton
            title="Start Quiz"
            materialName="Teks Naratif"
            quizName="Definisi Teks Naratif"
            classId={effectiveClassId}
          />
        </DefinitionItem>
      </Collapsible>
      <Collapsible
        title="Tujuan Teks Naratif"
        isLockedGeneral={!generalQuizStatus["Definisi Teks Naratif"]}
        isLockedClass={!classQuizStatus["Definisi Teks Naratif"]}
        classId={effectiveClassId}>
        <DefinitionItem titlee="1. Menghibur Pembaca atau Pendengar">
          <ThemedText>
            Menyajikan cerita yang menarik, menghibur, dan memancing emosi atau
            imajinasi pembaca. Cerita dalam teks naratif sering kali dibuat
            menarik dan menggugah perasaan untuk membuat pembaca atau pendengar
            merasa terhibur.
          </ThemedText>
        </DefinitionItem>
        <DefinitionItem titlee="2. Menyampaikan Pesan Moral atau Nilai">
          <ThemedText>
            Banyak teks naratif yang ditulis untuk memberikan pelajaran atau
            pesan moral kepada pembaca. Melalui cerita, penulis dapat
            menyampaikan nilai-nilai tertentu, seperti kejujuran, keberanian,
            atau kerja keras.
          </ThemedText>
        </DefinitionItem>
        <DefinitionItem titlee="3. Mengajarkan atau Menginformasikan">
          <ThemedText>
            Beberapa teks naratif juga digunakan untuk memberikan informasi atau
            mengajarkan tentang sejarah, budaya, atau peristiwa penting melalui
            bentuk penceritaan.
          </ThemedText>
        </DefinitionItem>
        <DefinitionItem titlee="Quiz Tujuan Teks Naratif">
          <StartQuizButton
            title="Start Quiz"
            materialName="Teks Naratif"
            quizName="Tujuan Teks Naratif"
            classId={effectiveClassId}
          />
        </DefinitionItem>
        {/* <ExternalLink href="https://drive.google.com/file/d/1twMRUxDqglqt4H_nFJs9AnevAkf6LWJi/view">
          <ThemedText
            type="link"
            speech={false}>
            Sumber: Derewianka (1990)
          </ThemedText>
        </ExternalLink> */}
      </Collapsible>
      <Collapsible
        title="Fungsi Teks Naratif"
        isLockedGeneral={!generalQuizStatus["Tujuan Teks Naratif"]}
        isLockedClass={!classQuizStatus["Tujuan Teks Naratif"]}
        classId={effectiveClassId}>
        <DefinitionItem titlee="1. Estetika">
          <ThemedText>
            Memberikan keindahan dalam penggunaan bahasa, cerita, dan gaya
            penceritaan. Teks naratif dapat menggunakan bahasa yang deskriptif
            dan imajinatif, yang memungkinkan pembaca untuk terlibat dalam
            pengalaman cerita.
          </ThemedText>
        </DefinitionItem>
        <DefinitionItem titlee="2. Sosial dan Budaya">
          <ThemedText>
            Menyampaikan nilai-nilai sosial, tradisi, dan norma budaya melalui
            cerita. Banyak cerita rakyat, mitos, legenda, dan fabel merupakan
            bagian dari teks naratif yang mencerminkan budaya suatu masyarakat.
          </ThemedText>
        </DefinitionItem>
        <DefinitionItem titlee="3. Edukatif">
          <ThemedText>
            Memberikan pelajaran moral dan pengetahuan kepada pembaca. Misalnya,
            cerita yang mengandung pesan moral dapat mengajarkan pembaca tentang
            nilai-nilai penting dalam kehidupan.
          </ThemedText>
        </DefinitionItem>
        <DefinitionItem titlee="4. Psikologis">
          <ThemedText>
            Memfasilitasi pembaca atau pendengar untuk memahami emosi dan
            perasaan manusia. Narasi dapat membantu pembaca mengembangkan empati
            dan pemahaman tentang pengalaman orang lain.
          </ThemedText>
        </DefinitionItem>
        <DefinitionItem titlee="Quiz Fungsi Teks Naratif">
          <StartQuizButton
            title="Start Quiz"
            materialName="Teks Naratif"
            quizName="Fungsi Teks Naratif"
            classId={effectiveClassId}
          />
        </DefinitionItem>
        {/* <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link">Sumber: Labov & Waletzky (1967)</ThemedText>
        </ExternalLink> */}
      </Collapsible>
      <Collapsible
        title="Jenis-jenis Teks Naratif"
        isLockedGeneral={!generalQuizStatus["Fungsi Teks Naratif"]}
        isLockedClass={!classQuizStatus["Fungsi Teks Naratif"]}
        classId={effectiveClassId}>
        <DefinitionItem titlee="1. Ekspositoris">
          <ThemedText>
            Teks naratif ekspositoris adalah jenis teks naratif yang bertujuan
            untuk memberikan informasi atau menjelaskan sesuatu kepada pembaca.
            Teks ini disusun dengan struktur yang jelas dan logis, dan sering
            kali digunakan dalam konteks akademik atau profesional. Meskipun
            berbentuk narasi, teks ini lebih menekankan pada penyampaian
            informasi yang akurat dan obyektif.
          </ThemedText>

          <ThemedText type="defaultSemiBold1">
            Contoh: Biografi, laporan perjalanan, artikel sejarah.
          </ThemedText>
        </DefinitionItem>
        <DefinitionItem titlee="2. Sugestif">
          <ThemedText>
            Teks naratif sugestif bertujuan untuk menghibur, menggugah emosi,
            atau memberikan pesan moral kepada pembaca. Narasi jenis ini sering
            menggunakan elemen fiksi, metafora, dan simbolisme untuk
            menyampaikan makna yang lebih dalam. Fokusnya adalah pada cara
            penyampaian cerita dan dampaknya terhadap pembaca, bukan semata-mata
            pada penyampaian informasi.
          </ThemedText>
          <ThemedText type="defaultSemiBold1">
            Contoh: Cerita pendek, novel, fabel, mitos, dongeng.
          </ThemedText>
        </DefinitionItem>
        <DefinitionItem titlee="Quiz Jenis-jenis Teks Naratif">
          <StartQuizButton
            title="Start Quiz"
            materialName="Teks Naratif"
            quizName="Jenis-jenis Teks Naratif"
            classId={effectiveClassId}
          />
        </DefinitionItem>
      </Collapsible>
      <Collapsible
        title="Perbedaan Teks Naratif Ekspositoris dan Sugestif"
        isLockedGeneral={!generalQuizStatus["Jenis-jenis Teks Naratif"]}
        isLockedClass={!classQuizStatus["Jenis-jenis Teks Naratif"]}
        classId={effectiveClassId}>
        <DefinitionItem titlee="1. Tujuan">
          <BulletList items={["Teks Naratif Ekspositoris:"]} />
          <ThemedText type="default1">
            Bertujuan untuk memberikan informasi atau penjelasan tentang suatu
            topik kepada pembaca. Fokusnya adalah pada penyampaian fakta dan
            data secara jelas dan terstruktur
          </ThemedText>
          <BulletList items={["Teks Naratif Sugestif:"]} />
          <ThemedText type="default1">
            Bertujuan untuk menghibur, menggugah emosi, atau menyampaikan pesan
            moral kepada pembaca. Fokusnya adalah pada pengalaman membaca dan
            dampak emosional atau pemikiran yang ditimbulkan oleh cerita.
          </ThemedText>
        </DefinitionItem>
        <DefinitionItem titlee="2. Isi dan Konten">
          <BulletList items={["Teks Naratif Ekspositoris:"]} />
          <ThemedText type="default1">
            Mengandung fakta dan data yang obyektif. Isi teks bersifat
            informatif dan analitis, lebih mendekati artikel, laporan, atau
            biografi yang menggambarkan kejadian atau situasi secara kronologis
            namun berdasarkan kenyataan.
          </ThemedText>
          <BulletList items={["Teks Naratif Sugestif:"]} />
          <ThemedText type="default1">
            Mengandung elemen fiksi, imajinatif, dan simbolik. Ceritanya bisa
            berupa khayalan, dongeng, atau cerita yang tidak sepenuhnya
            didasarkan pada fakta. Menggunakan bahasa kiasan, metafora, dan
            elemen dramatis untuk menambah daya tarik.
          </ThemedText>
        </DefinitionItem>
        <DefinitionItem titlee="3. Struktur">
          <BulletList items={["Teks Naratif Ekspositoris:"]} />
          <ThemedText type="default1">
            Memiliki struktur yang lebih ketat dan formal. Biasanya dimulai
            dengan perkenalan atau pengantar yang jelas, diikuti oleh
            bagian-bagian yang terorganisir secara logis dan kronologis, seperti
            orientasi, penjelasan, dan kesimpulan.
          </ThemedText>
          <BulletList items={["Teks Naratif Sugestif:"]} />
          <ThemedText type="default1">
            Memiliki struktur yang lebih fleksibel. Struktur umumnya meliputi
            orientasi, komplikasi, klimaks, resolusi, dan koda, tetapi dapat
            berubah sesuai dengan gaya penceritaan atau tujuan penulis untuk
            menciptakan efek tertentu.
          </ThemedText>
        </DefinitionItem>
        <DefinitionItem titlee="4. Gaya Bahasa">
          <BulletList items={["Teks Naratif Ekspositoris:"]} />
          <ThemedText type="default1">
            Menggunakan bahasa yang jelas, lugas, dan langsung. Tidak banyak
            menggunakan gaya bahasa imajinatif atau figuratif, karena tujuannya
            adalah untuk menyampaikan informasi secara langsung dan dapat
            dimengerti.
          </ThemedText>
          <BulletList items={["Teks Naratif Sugestif:"]} />
          <ThemedText type="default1">
            Menggunakan bahasa yang lebih imajinatif dan figuratif, seperti
            metafora, simile, personifikasi, dan simbolisme. Gaya bahasanya
            bertujuan untuk menambah kedalaman emosi dan menggugah imajinasi
            pembaca.
          </ThemedText>
        </DefinitionItem>
        <DefinitionItem titlee="5. Contoh">
          <BulletList items={["Teks Naratif Ekspositoris:"]} />
          <ThemedText type="default1">
            Biografi, laporan ilmiah, artikel sejarah, jurnal perjalanan.
          </ThemedText>
          <BulletList items={["Teks Naratif Sugestif:"]} />
          <ThemedText type="default1">
            Cerita pendek, novel, fabel, mitos, dan dongeng.
          </ThemedText>
        </DefinitionItem>
        <DefinitionItem titlee="6. Penggunaan">
          <BulletList items={["Teks Naratif Ekspositoris:"]} />
          <ThemedText type="default1">
            Sering digunakan dalam konteks akademis, pendidikan, dan profesional
            di mana keakuratan informasi dan data sangat penting.
          </ThemedText>
          <BulletList items={["Teks Naratif Sugestif:"]} />
          <ThemedText type="default1">
            Lebih banyak digunakan dalam konteks sastra, seni, hiburan, dan
            komunikasi kreatif untuk menggugah emosi, memberikan pelajaran
            moral, atau mengeksplorasi tema-tema filosofis dan sosial.{" "}
          </ThemedText>
        </DefinitionItem>
        <DefinitionItem titlee="7. Dampak pada Pembaca">
          <BulletList items={["Teks Naratif Ekspositoris:"]} />
          <ThemedText type="default1">
            Mendorong pembaca untuk memahami dan mempelajari suatu topik secara
            lebih mendalam. Dampaknya cenderung bersifat informatif dan
            edukatif.
          </ThemedText>
          <BulletList items={["Teks Naratif Sugestif:"]} />
          <ThemedText type="default1">
            Mendorong pembaca untuk merasakan dan memikirkan sesuatu secara
            lebih mendalam. Dampaknya cenderung emosional, reflektif, dan bisa
            membangkitkan pemikiran kritis atau kesadaran moral.{" "}
          </ThemedText>
        </DefinitionItem>
        <DefinitionItem titlee="Simpulan">
          <ThemedText type="default">
            Perbedaan utama antara teks naratif ekspositoris dan teks naratif
            sugestif terletak pada tujuan, konten, gaya bahasa, dan dampaknya
            pada pembaca. Teks naratif ekspositoris fokus pada penyampaian
            informasi secara obyektif dan logis, sementara teks naratif sugestif
            fokus pada menggugah emosi, hiburan, dan pesan moral melalui cerita
            yang imajinatif.
          </ThemedText>
        </DefinitionItem>
        <DefinitionItem titlee="Quiz Perbedaan Teks Naratif">
          <StartQuizButton
            title="Start Quiz"
            materialName="Teks Naratif"
            quizName="Perbedaan Teks Naratif"
            classId={effectiveClassId}
          />
        </DefinitionItem>
      </Collapsible>
      <Collapsible
        title="Ciri-ciri Teks Naratif"
        isLockedGeneral={
          !generalQuizStatus["Perbedaan Teks Naratif Ekspositoris dan Sugestif"]
        }
        isLockedClass={
          !classQuizStatus["Perbedaan Teks Naratif Ekspositoris dan Sugestiff"]
        }
        classId={effectiveClassId}>
        <DefinitionItem titlee="Ciri-ciri Teks Naratif">
          <BulletList1
            items={[
              "Mengandung alur cerita yang jelas (berawal, berkembang, dan berakhir).",
              "Memiliki karakter atau tokoh yang berkembang selama cerita.",
              "Menggunakan bahasa yang bersifat deskriptif dan imajinatif.",
              "Mengandung konflik yang menjadi inti cerita dan resolusi.",
              "Memiliki setting (waktu dan tempat) yang jelas.",
              "Ditulis dalam urutan kronologis atau menggunakan teknik kilas balik.",
            ]}
          />
        </DefinitionItem>
        <DefinitionItem titlee="Quiz Ciri-ciri Teks Naratif">
          <StartQuizButton
            title="Start Quiz"
            materialName="Teks Naratif"
            quizName="Ciri-ciri Teks Naratif"
            classId={effectiveClassId}
          />
        </DefinitionItem>
      </Collapsible>
      <Collapsible
        title="Struktur Teks Naratif"
        isLockedGeneral={!generalQuizStatus["Ciri-ciri Teks Naratif"]}
        isLockedClass={!classQuizStatus["Ciri-ciri Teks Naratif"]}
        classId={effectiveClassId}>
        <DefinitionItem titlee="Struktur Teks Naratif">
          <BulletList items={["Orientation (Pengenalan):"]} />
          <ThemedText type="default1">
            Memperkenalkan tokoh, latar, dan situasi awal.
          </ThemedText>
          <BulletList items={["Complication (Permasalahan):"]} />
          <ThemedText type="default1">
            Menunjukkan konflik atau masalah yang muncul dalam cerita.
          </ThemedText>
          <BulletList items={[" Resolution (Penyelesaian):"]} />
          <ThemedText type="default1">
            Menggambarkan cara penyelesaian konflik atau masalah dalam cerita.
          </ThemedText>
          <BulletList items={[" Moral Values: "]} />
          <ThemedText type="default1">
            Kesimpulan atau pesan moral yang ingin disampaikan (tidak selalu
            ada).
          </ThemedText>
        </DefinitionItem>
        <DefinitionItem titlee="Quiz Stuktur Teks Naratif">
          <StartQuizButton
            title="Start Quiz"
            materialName="Teks Naratif"
            quizName="Struktur Teks Naratif"
            classId={effectiveClassId}
          />
        </DefinitionItem>
      </Collapsible>
      <Collapsible
        title="Contoh Teks Naratif"
        isLockedGeneral={!generalQuizStatus["Struktur Teks Naratif"]}
        isLockedClass={!classQuizStatus["Struktur Teks Naratif"]}
        classId={effectiveClassId}>
        <DefinitionItem titlee="1. Contoh Teks Naratif Ekspositoris">
          <ThemedText
            type="defaultSemiBold1"
            speech={false}>
            Judul: "Membangun Persatuan di Desa Merdeka"
          </ThemedText>
          <BulletList items={["Orientation (Pengenalan):"]} />
          <ThemedText type="default1">
            Di Desa Merdeka, penduduk terdiri dari berbagai suku, agama, dan
            latar belakang budaya. Desa ini terkenal dengan keanekaragaman dan
            keberagaman penduduknya, yang hidup berdampingan dengan damai. Desa
            Merdeka menerapkan nilai-nilai Pancasila dalam kehidupan
            sehari-hari, khususnya nilai Persatuan Indonesia.
          </ThemedText>
          <BulletList items={["Complication (Permasalahan):"]} />
          <ThemedText type="default1">
            Suatu ketika, terjadi perselisihan di antara warga mengenai
            pembangunan sebuah tempat ibadah baru. Sebagian warga menginginkan
            tempat ibadah untuk agama mereka, sementara kelompok lain merasa
            tidak setuju karena ingin membangun fasilitas publik lainnya.
            Situasi ini menimbulkan ketegangan di antara warga dan mengancam
            keharmonisan yang telah lama terjaga di desa tersebut.
          </ThemedText>
          <BulletList items={["Resolution (Penyelesaian):"]} />
          <ThemedText type="default1">
            Pemerintah desa kemudian mengadakan musyawarah untuk mufakat sesuai
            dengan nilai Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan
            dalam Permusyawaratan/Perwakilan. Dalam pertemuan tersebut, semua
            pihak diberikan kesempatan untuk menyampaikan pendapat mereka secara
            terbuka dan dengan penuh hormat. Akhirnya, warga desa sepakat untuk
            membangun tempat ibadah yang lebih besar yang dapat digunakan oleh
            berbagai agama sekaligus, dan memanfaatkan sebagian lahan yang
            tersisa untuk membangun fasilitas publik yang diinginkan.
          </ThemedText>
          <BulletList items={["Moral Value (Pesan Moral):"]} />
          <ThemedText type="default1">
            Persatuan dan kesatuan dalam masyarakat yang beragam dapat dicapai
            melalui dialog dan musyawarah untuk mencapai mufakat. Menghargai
            perbedaan dan menemukan solusi bersama adalah cerminan dari
            nilai-nilai Pancasila yang harus terus dijaga.
          </ThemedText>
        </DefinitionItem>
        <DefinitionItem titlee="2. Contoh Teks Naratif Sugestif">
          <ThemedText
            type="defaultSemiBold1"
            speech={false}>
            Judul: "Cahaya Keadilan untuk Semua"
          </ThemedText>
          <BulletList items={["Orientation (Pengenalan):"]} />
          <ThemedText type="default1">
            Di sebuah kota kecil bernama Serumpun, hidup seorang pemuda bernama
            Arif yang dikenal sangat jujur dan adil. Arif bekerja sebagai
            pedagang kecil di pasar, menjual hasil tani keluarganya. Dia sangat
            meyakini nilai Keadilan Sosial bagi Seluruh Rakyat Indonesia selalu
            berusaha untuk bersikap adil kepada semua orang yang datang
            berbelanja di tokonya.
          </ThemedText>
          <BulletList items={["Complication (Permasalahan):"]} />
          <ThemedText type="default1">
            Suatu hari, seorang pengusaha kaya datang ke pasar dan menawar semua
            barang dagangan Arif dengan harga yang jauh lebih rendah dari harga
            pasaran. Pengusaha tersebut berjanji akan membeli seluruh stok
            barangnya setiap minggu jika Arif menyetujui tawaran itu. Arif tahu
            bahwa jika ia menerima tawaran itu, ia bisa mendapatkan keuntungan
            cepat, tetapi ia juga menyadari bahwa banyak pedagang lain yang akan
            menderita kerugian karena harga pasar akan jatuh drastis.
          </ThemedText>
          <BulletList items={["Resolution (Penyelesaian):"]} />
          <ThemedText type="default1">
            Arif memutuskan untuk menolak tawaran pengusaha tersebut. Ia percaya
            bahwa keadilan harus ditegakkan, tidak hanya untuk dirinya sendiri
            tetapi juga untuk para pedagang lain di pasar. Meskipun beberapa
            orang mengatakan bahwa Arif bodoh karena menolak kesempatan emas
            itu, namun Arif tetap teguh pada prinsipnya. Dengan menolak tawaran
            yang tidak adil, harga pasar tetap stabil dan para pedagang kecil
            lainnya tetap bisa berjualan dengan tenang.
          </ThemedText>
          <BulletList items={["Moral Value (Pesan Moral):"]} />
          <ThemedText type="default1">
            Nilai keadilan harus ditegakkan di atas keuntungan pribadi. Menjaga
            keadilan sosial berarti memikirkan kesejahteraan bersama dan menolak
            untuk bertindak hanya demi kepentingan diri sendiri.
          </ThemedText>
        </DefinitionItem>

        <ThemedText type="default">
          Kedua teks di atas mencerminkan nilai-nilai Pancasila, baik dalam
          bentuk teks ekspositoris yang lebih informatif maupun teks sugestif
          yang lebih menggugah emosi dan refleksi.
        </ThemedText>
        {/* <DefinitionItem titlee="Quiz Contoh Teks Naratif">
          <StartQuizButton
            title="Start Quiz"
            quizKey="tujuanNaratif2"
          />
        </DefinitionItem> */}
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImageContainer: {
    width: width,
    height: height * 0.25,
    justifyContent: "center",
    alignItems: "center",
  },
  headerImage: {
    color: "#4DA8FF",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
