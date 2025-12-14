/**
 * Uses fluent-ffmpeg to probe durations. Ensure ffprobe is available.
 */
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import { promisify } from "util";

(ffmpeg as any).setFfmpegPath(ffmpegPath);
const ffprobe = promisify((ffmpeg as any).ffprobe);

export async function validateVoiceDuration(filePath: string): Promise<number> {
  const info: any = await ffprobe(filePath);
  const streams = info.streams || [];
  const audio = streams.find((s: any) => s.codec_type === "audio");
  const duration = audio ? Number(audio.duration) : Number(info.format.duration);
  return Math.round(duration || 0);
}

export async function validateVideoDuration(filePath: string): Promise<number> {
  const info: any = await ffprobe(filePath);
  const duration = Number(info.format.duration || 0);
  return Math.round(duration);
}