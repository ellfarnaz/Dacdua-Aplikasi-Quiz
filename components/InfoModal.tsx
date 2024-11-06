import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";

interface InfoModalProps {
  visible: boolean;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ visible, onClose }) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Image
            source={require("../assets/images/iconcz.png")} // Ganti dengan path logo Anda
            style={styles.logo}
          />
          <Text style={styles.modalTitle}>
            Hibah Penelitian Fundamental - Reguler Kemdikbud
          </Text>
          <View style={styles.contentContainer}>
            <Text style={styles.modalContent}>
              "Pengembangan Aplikasi Pembelajaran berbasis{" "}
              <Text style={styles.highlightedText}>Gamified-Mobile Model</Text>{" "}
              Guna Meningkatkan Motivasi, Partisipasi, Kompetensi, dan Karakter
              Mahasiswa melalui Pendekatan DACDUA"
            </Text>
            <View style={styles.teamContainer}>
              <Text style={styles.teamTitle}>Tim Peneliti:</Text>
              <Text style={styles.teamMember}>Ketua:</Text>
              <Text style={styles.teamMemberName}>
                Dr. Juhansar, S.Pd.I., M.A.
              </Text>
              <Text style={styles.teamMember}>Anggota:</Text>
              <Text style={styles.teamMemberName}>
                Ir. Joko Sutopo, S.T., M.T., Ph.D., IPU.
              </Text>
              <Text style={styles.teamMemberName}>
                Dr. Suryo Sudiro, S.S., M.Hum.
              </Text>
              <Text style={styles.teamMemberName}>
                Adam Sekti Aji, S.Kom., M.Kom.
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Tutup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(30, 136, 229, 0.3)", // Warna biru dengan transparansi
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#f0f8ff", // Warna biru muda
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 15,
    borderRadius: 100,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#1e88e5",
  },
  contentContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    width: "100%",
  },
  modalContent: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: "justify",
    color: "#333",
    lineHeight: 22,
  },
  highlightedText: {
    fontStyle: "italic",
    fontWeight: "bold",
  },
  teamContainer: {
    marginTop: 10,
  },
  teamTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1e88e5",
    textAlign: "center",
  },
  teamMember: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
    color: "#555",
  },
  teamMemberName: {
    fontSize: 16,
    marginLeft: 10,
    color: "#555",
  },
  closeButton: {
    backgroundColor: "#1e88e5",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default InfoModal;
