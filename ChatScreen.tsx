import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { io } from "socket.io-client";
import { theme } from "../theme";

/**
 * Simple chat screen demonstrating socket signaling connection and basic call buttons.
 */
export default function ChatScreen() {
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    const s = io("http://localhost:4000");
    s.on("connect", () => {
      s.emit("join", { userId: "local-user-id" });
    });
    s.on("signal", (d: any) => {
      console.log("signal received", d);
    });
    setSocket(s);
    return () => s.disconnect();
  }, []);

  function startCall() {
    if (!socket) return;
    socket.emit("call:invite", { toUserId: "remote-user-id", meta: { type: "video" } });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inbox (placeholder)</Text>
      <Button title="Start Video Call" onPress={startCall} color={theme.colors.brand} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.black, alignItems: "center", justifyContent: "center" },
  title: { color: theme.colors.brand, fontSize: 20, marginBottom: 20 }
});