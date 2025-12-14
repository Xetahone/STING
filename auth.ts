import express from "express";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendPhoneOTP, sendEmailOTP, verifyOTPStore } from "../services/otp";
import { hashPassword, verifyPassword } from "../services/password";

dotenv.config();
const router = express.Router();

/**
 * POST /api/auth/signup
 * body: { email, phone, username, password }
 * sends phone OTP to verify and creates a pending user entry
 */
router.post("/signup", async (req, res) => {
  const { email, phone, username, password } = req.body;
  // TODO: validate uniqueness, store pending user in DB
  const pendingId = uuidv4();
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await sendPhoneOTP(phone, otp);
  await verifyOTPStore.store({ key: `signup:${pendingId}`, otp, payload: { email, phone, username, password: await hashPassword(password) }, ttl: 10 * 60 });
  res.json({ pendingId, message: "Phone OTP sent" });
});

/**
 * POST /api/auth/verify-phone
 * body: { pendingId, otp }
 */
router.post("/verify-phone", async (req, res) => {
  const { pendingId, otp } = req.body;
  const found = await verifyOTPStore.verifyAndGet(`signup:${pendingId}`, otp);
  if (!found) return res.status(400).json({ error: "Invalid OTP" });
  // TODO: create user in DB
  // return created user summary
  res.json({ ok: true, user: { id: uuidv4(), username: found.username, email: found.email, phone: found.phone }});
});

/**
 * POST /api/auth/login
 * body: { username, password }
 * -> validates credentials then sends email OTP for second factor
 */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  // TODO: fetch user by username and verify password
  const user = { id: "user-id", email: "user@example.com", username }; // placeholder
  const okPassword = await verifyPassword(password, "$2b$10$................"); // TODO remove
  if (!user) return res.status(400).json({ error: "Invalid credentials" });
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await sendEmailOTP(user.email, otp);
  await verifyOTPStore.store({ key: `login:${user.id}`, otp, payload: { userId: user.id }, ttl: 10 * 60 });
  res.json({ message: "Email OTP sent", userId: user.id });
});

/**
 * POST /api/auth/verify-email-otp
 * body: { userId, otp }
 */
router.post("/verify-email-otp", async (req, res) => {
  const { userId, otp } = req.body;
  const found = await verifyOTPStore.verifyAndGet(`login:${userId}`, otp);
  if (!found) return res.status(400).json({ error: "Invalid OTP" });
  const token = jwt.sign({ userId }, process.env.JWT_SECRET || "secret", { expiresIn: "7d" });
  res.json({ token, refreshToken: uuidv4() });
});

export default router;