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
          size={24}
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
      <View style={styles.contentContainer}>
        <Text style={styles.subHeader}>Tujuan Umum</Text>
        <Text style={styles.paragraph}>
          Untuk mengembangkan aplikasi pembelajaran berbasis{" "}
          <Text style={styles.highlightedText}>gamified-mobile model</Text>,
          yang terintegrasi dengan nilai-nilai konstruktif karakter bangsa
          Indonesia guna meningkatkan motivasi, partisipasi, dan kompetensi
          akademik mahasiswa menuju Indonesia Emas 2045.
        </Text>

        <Text style={styles.subHeader}>Tujuan Khusus</Text>
        <Collapsible title="1. Meningkatkan Motivasi">
          <Text style={styles.collapsibleText}>
            Untuk mengetahui motivasi mahasiswa dalam pembelajaran teks naratif
            menggunakan aplikasi{" "}
            <Text style={styles.highlightedText}>gamified-mobile model.</Text>{" "}
          </Text>
        </Collapsible>
        <Collapsible title="2. Meningkatkan Partisipasi">
          <Text style={styles.collapsibleText}>
            Untuk mengetahui partisipasi mahasiswa dalam pembelajaran teks
            naratif menggunakan aplikasi{" "}
            <Text style={styles.highlightedText}>gamified-mobile model.</Text>{" "}
          </Text>
        </Collapsible>
        <Collapsible title="3. Meningkatkan Kompetensi">
          <Text style={styles.collapsibleText}>
            Untuk memahami kompetensi mahasiswa dalam pembelajaran teks naratif
            menggunakan aplikasi{" "}
            <Text style={styles.highlightedText}>gamified-mobile model.</Text>{" "}
          </Text>
        </Collapsible>
        <Collapsible title="4. Menguatkan Nilai Karakter Bangsa">
          <Text style={styles.collapsibleText}>
            Untuk menguatkan nilai-nilai karakter bangsa mahasiswa yang dapat
            dikuatkan melalui pembelajaran berbasis aplikasi{" "}
            <Text style={styles.highlightedText}>gamified-mobile model.</Text>{" "}
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
      backgroundColor: "#E6F3FF", // Latar belakang biru muda
    },
    contentContainer: {
      padding: 20,
    },
    subHeader: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#2E86DE",
      marginBottom: 10,
    },
    paragraph: {
      fontSize: 16,
      lineHeight: 24,
      color: "#333",
      textAlign: "justify",
      marginBottom: 20,
    },
    highlightedText: {
      fontStyle: "italic",
      // fontWeight: "bold",
    },
    collapsibleContainer: {
      marginBottom: 10,
      borderRadius: 8,
      overflow: "hidden",
    },
    collapsibleHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#4DA8FF",
      padding: 15,
    },
    collapsibleTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#fff",
    },
    collapsibleContent: {
      backgroundColor: "#fff",
      padding: 15,
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
      borderColor: "#4DA8FF",
      borderWidth: 1,
    },
    collapsibleText: {
      fontSize: 16,
      lineHeight: 24,
      color: "#333",
      textAlign: "justify",
    },
  });
