import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchClassLeaderboard,
  selectLeaderboard,
  selectLeaderboardLoading,
  selectLeaderboardError,
  LeaderboardEntry,
} from "../redux/slices/quizSlice";
import { AppDispatch } from "../redux/store";
import { Ionicons } from "@expo/vector-icons";

interface ClassLeaderboardProps {
  materialName: string;
  classId: string;
}

const ClassLeaderboard: React.FC<ClassLeaderboardProps> = ({
  materialName,
  classId,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const leaderboard = useSelector(selectLeaderboard);
  const loading = useSelector(selectLeaderboardLoading);
  const error = useSelector(selectLeaderboardError);

  useEffect(() => {
    dispatch(fetchClassLeaderboard({ materialName, classId }));
  }, [dispatch, materialName, classId]);

  if (loading === "pending") {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator
          size="large"
          color="#4DA8FF"
        />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons
          name="alert-circle-outline"
          size={48}
          color="#FF6B6B"
        />
        <Text style={styles.errorText}>Kesalahan: {error}</Text>
      </View>
    );
  }

  const renderItem = ({
    item,
    index,
  }: {
    item: LeaderboardEntry;
    index: number;
  }) => (
    <View style={styles.itemContainer}>
      <View style={styles.rankContainer}>
        <Text style={styles.rank}>{index + 1}</Text>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.userName}</Text>
        <Text style={styles.institution}>{item.userInstitution}</Text>
      </View>
      <View style={styles.scoreInfo}>
        <Text style={styles.score}>{item.score.toFixed(2)}</Text>
        <Text style={styles.quizCount}>
          ({item.quizCount} {item.quizCount === 1 ? "kuis" : "kuis"})
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Ionicons
          name="trophy-outline"
          size={26}
          color="#4DA8FF"
        />
        <Text style={styles.title}>Papan Peringkat Kelas</Text>
      </View>
      <Text style={styles.subtitle}>{materialName}</Text>
      <FlatList
        data={leaderboard}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.userId}-${index}`}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="information-circle-outline"
              size={48}
              color="#4DA8FF"
            />
            <Text style={styles.emptyText}>Belum ada skor tersedia</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6F3FF",
    padding: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // marginBottom: 10,
    marginTop: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    color: "#4DA8FF",
    marginLeft: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    color: "#666",
    // marginBottom: 20,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    padding: 15,
    elevation: 2,
    shadowColor: "#4DA8FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  rankContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4DA8FF",
    justifyContent: "center",
    alignItems: "center",
  },
  rank: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  userInfo: {
    flex: 1,
    marginLeft: 15,
  },
  userName: {
    fontSize: 16,
    color: "#333",
  },
  institution: {
    fontSize: 12,
    color: "#666",
    marginTop: 3,
  },
  scoreInfo: {
    alignItems: "flex-end",
  },
  score: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4DA8FF",
  },
  quizCount: {
    fontSize: 12,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#FF6B6B",
    textAlign: "center",
    fontSize: 16,
    marginTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 10,
  },
});

export default ClassLeaderboard;
