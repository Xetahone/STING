/**
 * Simple FFmpeg worker stub for offline validation/transcode tasks.
 * In production, run multiple workers and use a queue (Bull/Redis).
 */
import { validateVideoDuration } from "../utils/mediaValidators";
import path from "path";

async function main() {
  const testFile = process.argv[2];
  if (!testFile) {
    console.log("Usage: npm run worker -- /path/to/file");
    process.exit(1);
  }
  const dur = await validateVideoDuration(testFile);
  console.log("Duration seconds:", dur);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});