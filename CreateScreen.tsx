import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { theme } from "../theme";

/**
 * Create screen skeleton: camera UI omitted (use expo-camera).
 * Includes add-music button and quick toggles.
 */
export default function CreateScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.hint}>Create (camera UI placeholder)</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Add Music</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonSecondary}>
        <Text style={styles.buttonTextSecondary}>Story / Post Toggle</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, alignItems: "center", justifyContent: "center" },
  hint: { color: theme.colors.brand, fontSize: 18, marginBottom: 20 },
  button: { backgroundColor: theme.colors.brand, padding: 12, borderRadius: 8, marginBottom: 12 },
  buttonText: { color: theme.colors.black, fontWeight: "700" },
  buttonSecondary: { borderColor: theme.colors.brand, borderWidth: 1, padding: 10, borderRadius: 8 },
  buttonTextSecondary: { color: theme.colors.brand }
});