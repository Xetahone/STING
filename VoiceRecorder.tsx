import React, { useState, useRef } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import * as FileSystem from "expo-file-system";
import { Audio } from "expo-av";

/**
 * Simple press-and-hold recorder with duration limit enforcement (client-side).
 * This component doesn't interact with the server directly — use fetch/upload after recording.
 */
export default function VoiceRecorder({ maxSeconds = 15, onRecorded }: { maxSeconds?: number; onRecorded?: (uri: string, duration: number) => void }) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [duration, setDuration] = useState(0);
  const intervalRef = useRef<any>(null);

  async function start() {
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({ allowsRecordingIOS: true });
    const r = new Audio.Recording();
    await r.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
    await r.startAsync();
    setRecording(r);
    intervalRef.current = setInterval(async () => {
      const status = await r.getStatusAsync();
      setDuration(Math.round((status.durationMillis || 0) / 1000));
      if ((status.durationMillis || 0) / 1000 >= maxSeconds) {
        await stop(true);
      }
    }, 300);
  }

  async function stop(endedByLimit = false) {
    if (!recording) return;
    clearInterval(intervalRef.current);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI()!;
    const info = await FileSystem.getInfoAsync(uri);
    const dur = duration;
    setRecording(null);
    setDuration(0);
    if (onRecorded) onRecorded(uri, dur);
    if (endedByLimit) {
      // show upgrade modal (TODO)
    }
  }

  return (
    <View>
      <TouchableOpacity
        onPressIn={() => start()}
        onPressOut={() => stop(false)}
        style={{ backgroundColor: theme.colors.brand, padding: 12, borderRadius: 30 }}
      >
        <Text style={{ color: theme.colors.black }}>Hold to Record ({maxSeconds}s)</Text>
      </TouchableOpacity>
      <Text style={{ color: theme.colors.white }}>{duration}s</Text>
    </View>
  );
}