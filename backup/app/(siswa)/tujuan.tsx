import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Collapsible: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { width } = useWindowDimensions();

  const styles = getStyles(width);

  return (
    <View style={styles.collapsibleContainer}>
      <TouchableOpacity
        style={styles.collapsibleHeader}
        onPress={() => setIsExpanded(!isExpanded)}>
        <Text style={styles.collapsibleTitle}>{title}</Text>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={width < 360 ? 20 : 24}
          color="#fff"
        />
      </TouchableOpacity>
      {isExpanded && <View style={styles.collapsibleContent}>{children}</View>}
    </View>
  );
};

export default function Tujuan() {
  const { width } = useWindowDimensions();
  const styles = getStyles(width);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Tujuan Pembelajaran</Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.subHeader}>Tujuan Umum</Text>
        <Text style={styles.paragraph}>
          Untuk mengembangkan aplikasi pembelajaran berbasis gamified-mobile
          model, yang terintegrasi dengan nilai-nilai konstruktif karakter
          bangsa Indonesia guna meningkatkan motivasi, partisipasi, dan
          kompetensi akademik mahasiswa menuju Indonesia Emas 2045
        </Text>

        <Text style={styles.subHeader}>Tujuan Khusus</Text>
        <Collapsible title="1. Motivasi Mahasiswa">
          <Text style={styles.collapsibleText}>
            Untuk mengetahui motivasi mahasiswa dalam pembelajaran teks naratif
            menggunakan aplikasi gamified-mobile model
          </Text>
        </Collapsible>
        <Collapsible title="2. Partisipasi Mahasiswa">
          <Text style={styles.collapsibleText}>
            Untuk mengetahui partisipasi mahasiswa dalam pembelajaran teks
            naratif menggunakan aplikasi gamified-mobile model
          </Text>
        </Collapsible>
        <Collapsible title="3. Kompetensi Mahasiswa">
          <Text style={styles.collapsibleText}>
            Untuk memahami kompetensi mahasiswa dalam pembelajaran teks naratif
            menggunakan aplikasi gamified-mobile model
          </Text>
        </Collapsible>
        <Collapsible title="4. Penerapan Nilai Karakter Bangsa">
          <Text style={styles.collapsibleText}>
            Untuk menerapkan nilai-nilai karakter bangsa yang dapat dikuatkan
            dalam pembelajaran melalui aplikasi gamified-mobile model
          </Text>
        </Collapsible>
      </View>
    </ScrollView>
  );
}

const getStyles = (width: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#E6F3FF",
    },
    header: {
      backgroundColor: "#4DA8FF",
      padding: width * 0.05,
      alignItems: "center",
      borderBottomLeftRadius: width * 0.08,
      borderBottomRightRadius: width * 0.08,
    },
    headerText: {
      fontSize: width < 360 ? 24 : 28,
      fontWeight: "bold",
      color: "#fff",
      textShadowColor: "rgba(0, 0, 0, 0.1)",
      textShadowOffset: { width: -1, height: 1 },
      textShadowRadius: 10,
    },
    contentContainer: {
      padding: width * 0.05,
    },
    subHeader: {
      fontSize: width < 360 ? 20 : 22,
      fontWeight: "bold",
      color: "#2E86DE",
      marginTop: width * 0.05,
      marginBottom: width * 0.025,
    },
    paragraph: {
      fontSize: width < 360 ? 14 : 16,
      lineHeight: width < 360 ? 20 : 24,
      color: "#333",
      textAlign: "justify",
      marginBottom: width * 0.05,
    },
    collapsibleContainer: {
      marginBottom: width * 0.025,
      borderRadius: width * 0.025,
      overflow: "hidden",
    },
    collapsibleHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#4DA8FF",
      padding: width * 0.0375,
    },
    collapsibleTitle: {
      fontSize: width < 360 ? 16 : 18,
      fontWeight: "bold",
      color: "#fff",
    },
    collapsibleContent: {
      backgroundColor: "#fff",
      padding: width * 0.0375,
      borderBottomLeftRadius: width * 0.025,
      borderBottomRightRadius: width * 0.025,
    },
    collapsibleText: {
      fontSize: width < 360 ? 14 : 16,
      lineHeight: width < 360 ? 20 : 24,
      color: "#333",
      textAlign: "justify",
    },
  });
