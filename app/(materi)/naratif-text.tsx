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
import BulletList2 from "../../components/BulletList2";
import BulletList3 from "../../components/BulletList3";
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
import NumberedListComponent from "@/components/NumberedListComponent";

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
    "Level 1 Kuis Formatif": false,
    "Level 2 Kuis Formatif": false,
    "Level 3 Kuis Formatif": false,
    "Summative Quiz": false,
    "Perbedaan Teks Naratif": false,
    "Ciri-ciri Teks Naratif": false,
    "Struktur Teks Naratif": false,
  });

  const [classQuizStatus, setClassQuizStatus] = useState<
    Record<string, boolean>
  >({
    "Level 1 Kuis Formatif": false,
    "Level 2 Kuis Formatif": false,
    "Level 3 Kuis Formatif": false,
    "Summative Quiz": false,
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
      {/* <ThemedView>
        <ThemedText
          type="title"
          speech={false}>
          Teks Naratif
        </ThemedText>
      </ThemedView>
      <ThemedText>
        Teks naratif adalah jenis teks yang menceritakan suatu peristiwa atau
        rangkaian peristiwa yang terjadi dalam suatu urutan waktu tertentu, baik
        yang bersifat nyata maupun fiktif.
      </ThemedText> */}
      <Collapsible
        title="LEVEL 1"
        isLockedGeneral={false}
        isLockedClass={false}
        classId={effectiveClassId}>
        <DefinitionItem titlee="Definisi">
          <ThemedText>
            Teks naratif adalah jenis teks yang menceritakan suatu peristiwa
            atau rangkaian peristiwa yang terjadi dalam suatu urutan waktu
            tertentu, baik yang bersifat nyata maupun fiktif. Teks naratif
            biasanya memiliki tujuan untuk menghibur pembaca sekaligus
            menyampaikan pesan moral atau nilai-nilai tertentu. (Anderson &
            Anderson, 1997).
          </ThemedText>
        </DefinitionItem>
        <DefinitionItem titlee="Tujuan">
          <ThemedText>
            1. Menghibur: Menyajikan cerita menarik yang menggugah emosi dan
            imajinasi pembaca. {"\n"}
            2. Pesan Moral: Menyampaikan pelajaran atau nilai-nilai seperti
            kejujuran dan keberanian.{"\n"}
            3. Informasi: Mengajarkan sejarah, budaya, atau peristiwa penting
            melalui cerita (Derewianka, 1990).
          </ThemedText>
        </DefinitionItem>
        <DefinitionItem titlee="Fungsi">
          <NumberedListComponent showSpeakAllButton={true}>
            {`Estetika: Menyediakan keindahan bahasa dan gaya cerita yang deskriptif dan imajinatif.
Sosial dan Budaya: Mencerminkan nilai sosial dan budaya melalui cerita rakyat, mitos, dan legenda.
Edukatif: Memberikan pelajaran moral dan pengetahuan.
Psikologis: Membantu pembaca memahami emosi dan pengalaman manusia (Labov & Waletzky, 1967).`}
          </NumberedListComponent>
        </DefinitionItem>
        <DefinitionItem titlee="Level 1 Kuis Formatif">
          <StartQuizButton
            title="Start Quiz"
            materialName="Teks Naratif"
            quizName="Level 1 Kuis Formatif"
            classId={effectiveClassId}
          />
        </DefinitionItem>
      </Collapsible>
      <Collapsible
        title="LEVEL 2"
        isLockedGeneral={!generalQuizStatus["Level 1 Kuis Formatif"]}
        isLockedClass={!classQuizStatus["Level 1 Kuis Formatif"]}
        classId={effectiveClassId}>
        <DefinitionItem titlee="Ekspositoris">
          <BulletList1
            showSpeakAllButton={true}
            items={[
              "Bertujuan memberikan informasi atau penjelasan dengan struktur logis dan obyektif.",
              "Digunakan dalam konteks akademik atau profesional.",
              "Contoh:Biografi, laporan perjalanan, artikel sejarah (Smith, 2020).",
            ]}
          />
          {/* <ThemedText speech={false}>{""}</ThemedText>
          <ThemedText type="defaultSemiBold1">
            Contoh: {""}Biografi, laporan perjalanan, artikel sejarah.
          </ThemedText> */}
        </DefinitionItem>
        <DefinitionItem titlee="Sugestif">
          <BulletList1
            showSpeakAllButton={true}
            items={[
              "Bertujuan menghibur, menggugah emosi, atau menyampaikan pesan moral.",
              "Menggunakan elemen fiksi, metafora, dan simbolisme.",
              "Contoh: Biografi, laporan perjalanan, artikel sejarah (Smith, 2020).",
            ]}
          />
          {/* <ThemedText speech={false}>{""}</ThemedText>
          <ThemedText type="defaultSemiBold1">
            Contoh: Biografi, laporan perjalanan, artikel sejarah (Smith, 2020).
          </ThemedText> */}
        </DefinitionItem>
        <DefinitionItem titlee="Perbedaan Teks Naratif Ekspositoris dan Sugestif">
          <BulletList2>
            {`Teks Naratif Ekspositoris: Bertujuan untuk memberikan informasi atau penjelasan tentang suatu topik kepada pembaca. Fokusnya adalah pada penyampaian fakta dan data secara jelas dan terstruktur
Teks Naratif Sugestif: Bertujuan untuk menghibur, menggugah emosi, atau menyampaikan pesan moral kepada pembaca. Fokusnya adalah pada pengalaman membaca dan dampak emosional atau pemikiran yang ditimbulkan oleh cerita.`}
          </BulletList2>
        </DefinitionItem>
        <DefinitionItem titlee="Ciri-ciri Teks Naratif">
          <BulletList1
            showSpeakAllButton={true}
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
        <DefinitionItem titlee="Quiz Level 2 Kuis Formatif">
          <StartQuizButton
            title="Start Quiz"
            materialName="Teks Naratif"
            quizName="Level 2 Kuis Formatif"
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
        title="LEVEL 3"
        isLockedGeneral={!generalQuizStatus["Level 2 Kuis Formatif"]}
        isLockedClass={!classQuizStatus["Level 2 Kuis Formatif"]}
        classId={effectiveClassId}>
        <DefinitionItem titlee="Struktur Teks Naratif">
          <BulletList2 showSpeakAllButton={true}>
            {`Orientation (Pengenalan): Memperkenalkan tokoh, latar, dan situasi awal.
              Complication (Permasalahan): Menunjukkan konflik atau masalah yang muncul dalam cerita.
              Resolution (Penyelesaian): Menggambarkan cara penyelesaian konflik atau masalah dalam cerita.
              Moral Values: Kesimpulan atau pesan moral yang ingin disampaikan (tidak selalu ada).`}
          </BulletList2>
        </DefinitionItem>
        <DefinitionItem titlee="Contoh Teks Naratif Ekspositoris">
          <BulletList3>
            {`Judul: Membangun Persatuan di Desa Merdeka
Orientation (Pengenalan): Di Desa Merdeka, penduduk terdiri dari berbagai suku, agama, dan latar belakang budaya. Desa ini terkenal dengan keanekaragaman dan keberagaman penduduknya, yang hidup berdampingan dengan damai. Desa Merdeka menerapkan nilai-nilai Pancasila dalam kehidupan sehari-hari, khususnya nilai Persatuan Indonesia.
Complication (Permasalahan): Suatu ketika, terjadi perselisihan di antara warga mengenai pembangunan sebuah tempat ibadah baru. Sebagian warga menginginkan tempat ibadah untuk agama mereka, sementara kelompok lain merasa tidak setuju karena ingin membangun fasilitas publik lainnya. Situasi ini menimbulkan ketegangan di antara warga dan mengancam keharmonisan yang telah lama terjaga di desa tersebut.
Resolution (Penyelesaian): Pemerintah desa kemudian mengadakan musyawarah untuk mufakat sesuai dengan nilai Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan dalam Permusyawaratan/Perwakilan. Dalam pertemuan tersebut, semua pihak diberikan kesempatan untuk menyampaikan pendapat mereka secara terbuka dan dengan penuh hormat. Akhirnya, warga desa sepakat untuk membangun tempat ibadah yang lebih besar yang dapat digunakan oleh berbagai agama sekaligus, dan memanfaatkan sebagian lahan yang tersisa untuk membangun fasilitas publik yang diinginkan.
Moral Values: Persatuan dan kesatuan dalam masyarakat yang beragam dapat dicapai melalui dialog dan musyawarah untuk mencapai mufakat. Menghargai perbedaan dan menemukan solusi bersama adalah cerminan dari nilai-nilai Pancasila yang harus terus dijaga.`}
          </BulletList3>
        </DefinitionItem>
        <DefinitionItem titlee="Contoh Teks Naratif Sugestif">
          <BulletList3>
            {`Judul: Cahaya Keadilan untuk Semua
Orientation (Pengenalan): Di sebuah kota kecil bernama Serumpun, hidup seorang pemuda bernama Arif yang dikenal sangat jujur dan adil. Arif bekerja sebagai pedagang kecil di pasar, menjual hasil tani keluarganya. Dia sangat meyakini nilai Keadilan Sosial bagi Seluruh Rakyat Indonesia selalu berusaha untuk bersikap adil kepada semua orang yang datang berbelanja di tokonya.
Complication (Permasalahan): Suatu hari, seorang pengusaha kaya datang ke pasar dan menawar semua barang dagangan Arif dengan harga yang jauh lebih rendah dari harga pasaran. Pengusaha tersebut berjanji akan membeli seluruh stok barangnya setiap minggu jika Arif menyetujui tawaran itu. Arif tahu bahwa jika ia menerima tawaran itu, ia bisa mendapatkan keuntungan cepat, tetapi ia juga menyadari bahwa banyak pedagang lain yang akan menderita kerugian karena harga pasar akan jatuh drastis.
Resolution (Penyelesaian): Arif memutuskan untuk menolak tawaran pengusaha tersebut. Ia percaya bahwa keadilan harus ditegakkan, tidak hanya untuk dirinya sendiri tetapi juga untuk para pedagang lain di pasar. Meskipun beberapa orang mengatakan bahwa Arif bodoh karena menolak kesempatan emas itu, namun Arif tetap teguh pada prinsipnya. Dengan menolak tawaran yang tidak adil, harga pasar tetap stabil dan para pedagang kecil lainnya tetap bisa berjualan dengan tenang.
Moral Values: Nilai keadilan harus ditegakkan di atas keuntungan pribadi. Menjaga keadilan sosial berarti memikirkan kesejahteraan bersama dan menolak untuk bertindak hanya demi kepentingan diri sendiri.`}
          </BulletList3>
        </DefinitionItem>
        <DefinitionItem titlee="Quiz Level 3 Kuis Formatif">
          <StartQuizButton
            title="Start Quiz"
            materialName="Teks Naratif"
            quizName="Level 3 Kuis Formatif"
            classId={effectiveClassId}
          />
        </DefinitionItem>
        {/* <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link">Sumber: Labov & Waletzky (1967)</ThemedText>
        </ExternalLink> */}
      </Collapsible>
      <Collapsible
        title="FINAL SUMMATIVE QUIZ"
        isLockedGeneral={!generalQuizStatus["Level 3 Kuis Formatif"]}
        isLockedClass={!classQuizStatus["Level 3 Kuis Formatif"]}
        classId={effectiveClassId}>
        <DefinitionItem titlee="Summative Quiz">
          <StartQuizButton
            title="Start Quiz"
            materialName="Teks Naratif"
            quizName="Summative Quiz"
            classId={effectiveClassId}
          />
        </DefinitionItem>
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
