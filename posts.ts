import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { validateVoiceDuration, validateVideoDuration } from "../utils/mediaValidators";

const router = express.Router();
const upload = multer({ dest: "/tmp/uploads" });

/**
 * POST /api/posts
 * metadata creation, returns upload URL (scaffold: direct upload via PUT to S3 expected)
 */
router.post("/", async (req, res) => {
  const { userId, caption, mediaType, soundId, allowReshare } = req.body;
  // TODO: create post row and return signed upload url
  res.json({ uploadUrl: "https://minio.example/upload", postId: "post-uuid" });
});

/**
 * POST /api/posts/:postId/voice-comment
 * Accepts multipart audio file and runs duration enforcement for free vs paid users.
 */
router.post("/:postId/voice-comment", upload.single("voice"), async (req, res) => {
  const postId = req.params.postId;
  const user = { id: "user-id", subscription: "free" }; // TODO: auth middleware
  if (!req.file) return res.status(400).json({ error: "No file" });

  try {
    const duration = await validateVoiceDuration(req.file.path);
    const freeMax = Number(process.env.FREE_VOICE_MAX_SECONDS || 15);
    const paidMin = Number(process.env.PAID_VOICE_MIN_SECONDS || 16);
    const paidMax = Number(process.env.PAID_VOICE_MAX_SECONDS || 300);

    if (user.subscription === "free" && duration > freeMax) {
      return res.status(400).json({ error: `Free users can only post up to ${freeMax}s voice comments` });
    }
    if (user.subscription === "paid" && (duration < paidMin || duration > paidMax)) {
      return res.status(400).json({ error: `Paid voice comments must be between ${paidMin}-${paidMax} seconds` });
    }

    // TODO: upload to S3, create voice_comments DB record, generate waveform
    res.json({ ok: true, duration });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to validate audio" });
  } finally {
    // cleanup
    try { fs.unlinkSync(req.file.path); } catch {}
  }
});

export default router;