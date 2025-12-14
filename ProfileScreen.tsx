import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../theme";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>@example</Text>
      <Text style={styles.meta}>Stalkers: 120 • Stalking: 45</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.black, alignItems: "center", justifyContent: "center" },
  name: { color: theme.colors.brand, fontSize: 22, fontWeight: "700" },
  meta: { color: theme.colors.white, marginTop: 8 }
});