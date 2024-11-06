// components/LeaderboardGeneral.tsx

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
  fetchGeneralLeaderboard,
  selectLeaderboard,
  selectLeaderboardLoading,
  selectLeaderboardError,
  LeaderboardEntry,
} from "../redux/slices/quizSlice";
import { selectUser } from "../redux/slices/authSlice";
import { AppDispatch, RootState } from "../redux/store";

const LeaderboardGeneral: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const leaderboard = useSelector(selectLeaderboard);
  const loading = useSelector(selectLeaderboardLoading);
  const error = useSelector(selectLeaderboardError);
  const currentUser = useSelector((state: RootState) => selectUser(state));

  useEffect(() => {
    dispatch(fetchGeneralLeaderboard());
  }, [dispatch]);

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

  const renderItem = ({
    item,
    index,
  }: {
    item: LeaderboardEntry;
    index: number;
  }) => {
    const isCurrentUser = currentUser && item.userId === currentUser.id;

    return (
      <View style={styles.itemContainer}>
        <Text style={styles.rank}>{index + 1}</Text>
        <View style={styles.userInfo}>
          <Text
            style={[styles.userName, isCurrentUser && styles.currentUserName]}>
            {item.userName}
          </Text>
          <Text style={styles.institution}>{item.userInstitution}</Text>
        </View>
        <View style={styles.scoreInfo}>
          <Text style={styles.score}>{item.score.toFixed(2)}</Text>
          <Text style={styles.quizCount}>
            ({item.quizCount} {item.quizCount === 1 ? "quiz" : "quizzes"})
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>General Leaderboard</Text>
      <FlatList
        data={leaderboard}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.userId}-${index}`}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No scores available</Text>
        }
      />
    </View>
  );
};

// ... (styles remain the same)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  rank: {
    width: 30,
    fontWeight: "bold",
    fontSize: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
  },
  currentUserName: {
    fontWeight: "bold",
  },
  institution: {
    fontSize: 12,
    color: "#666",
  },
  scoreInfo: {
    alignItems: "flex-end",
  },
  score: {
    fontSize: 16,
    fontWeight: "bold",
  },
  quizCount: {
    fontSize: 12,
    color: "#666",
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

export default LeaderboardGeneral;
