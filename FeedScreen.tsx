import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { theme } from "../theme";

/**
 * Placeholder feed screen — replace with full vertical swipe list (FlatList with pagingEnabled)
 */
export default function FeedScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.videoCard}>
        <Text style={styles.title}>Trending Video</Text>
        <Text style={styles.meta}>100k likes • 1.2k shares • 300 comments</Text>
        <View style={styles.actions}>
          <Text style={styles.actionText}>❤</Text>
          <Text style={styles.actionText}>🎤 (voice comment)</Text>
          <Text style={styles.actionText}>↗</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.black },
  videoCard: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { color: theme.colors.brand, fontSize: 22, fontWeight: "700" },
  meta: { color: theme.colors.white, marginTop: 8 },
  actions: { position: "absolute", right: 12, bottom: 60 },
  actionText: { color: theme.colors.white, marginVertical: 8 }
});