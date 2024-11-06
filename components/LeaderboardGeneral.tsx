// components/LeaderboardGeneral.tsx

import React, { useEffect, useMemo } from "react";
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

  const sortedLeaderboard = useMemo(() => {
    return [...leaderboard].sort((a, b) => {
      if (a.score !== b.score) {
        return b.score - a.score; // Sort by score descending
      }
      if (a.quizCount !== b.quizCount) {
        return b.quizCount - a.quizCount; // If scores are equal, sort by quiz count descending
      }
      // If both score and quiz count are 0, sort by join time (assuming lower userId means joined earlier)
      return parseInt(a.userId) - parseInt(b.userId);
    });
  }, [leaderboard]);

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
    return <Text style={styles.errorText}>Kesalahan: {error}</Text>;
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
      <View style={[styles.itemContainer, isCurrentUser && styles.currentUser]}>
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
            ({item.quizCount} {item.quizCount === 1 ? "kuis" : "kuis"})
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Papan Peringkat Dunia</Text>
      <FlatList
        data={sortedLeaderboard}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.userId}-${index}`}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Belum ada skor tersedia</Text>
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
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#4DA8FF",
    marginBottom: 20,
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
  currentUser: {
    borderWidth: 2,
    borderColor: "#4DA8FF",
  },
  rank: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4DA8FF",
    width: 40,
    textAlign: "center",
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    fontSize: 16,
    color: "#333",
  },
  currentUserName: {
    fontWeight: "bold",
    color: "#4DA8FF",
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
    fontSize: 16,
    fontWeight: "bold",
    color: "#4DA8FF",
  },
  quizCount: {
    fontSize: 12,
    color: "#666",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    fontSize: 16,
    marginVertical: 20,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },
});

export default LeaderboardGeneral;
