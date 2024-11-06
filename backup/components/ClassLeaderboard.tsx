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
      <ActivityIndicator
        size="large"
        color="#0000ff"
      />
    );
  }

  if (error) {
    return <Text style={styles.errorText}>Error: {error}</Text>;
  }

  // Di dalam ClassLeaderboard.tsx

  const renderItem = ({
    item,
    index,
  }: {
    item: LeaderboardEntry;
    index: number;
  }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.rank}>{index + 1}</Text>
      <Text style={styles.userName}>{item.userName}</Text>
      <Text style={styles.score}>{item.score.toFixed(2)}</Text>
      <Text style={styles.quizCount}>({item.quizCount} quizzes)</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Class Leaderboard</Text>
      <Text style={styles.subtitle}>{materialName}</Text>
      <FlatList
        data={leaderboard}
        renderItem={renderItem}
        keyExtractor={(item) => item.userId}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No scores available</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  quizCount: {
    fontSize: 12,
    color: "#666",
    marginLeft: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 16,
    color: "#666",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  rank: {
    width: 30,
    fontWeight: "bold",
  },
  userName: {
    flex: 1,
  },
  score: {
    width: 50,
    textAlign: "right",
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
  },
});

export default ClassLeaderboard;
