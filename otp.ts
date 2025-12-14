/**
 * OTP service stubs. Replace sendPhoneOTP and sendEmailOTP with Twilio / SendGrid calls.
 * verifyOTPStore uses a simple in-memory map here for the scaffold. Replace with Redis in prod.
 */
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

type Stored = { otp: string; payload?: any; expiresAt: number };

const store = new Map<string, Stored>();

export const verifyOTPStore = {
  async store({ key, otp, payload, ttl = 600 }: { key: string; otp: string; payload?: any; ttl?: number }) {
    const expiresAt = Date.now() + ttl * 1000;
    store.set(key, { otp, payload, expiresAt });
  },
  async verifyAndGet(key: string, otp: string) {
    const s = store.get(key);
    if (!s) return null;
    if (Date.now() > s.expiresAt) {
      store.delete(key);
      return null;
    }
    if (s.otp !== otp) return null;
    store.delete(key);
    return s.payload;
  }
};

export async function sendPhoneOTP(phone: string, otp: string) {
  // TODO: integrate Twilio / provider
  console.log(`SMS OTP to ${phone}: ${otp}`);
  return true;
}

export async function sendEmailOTP(email: string, otp: string) {
  // Simple nodemailer transporter using SMTP env vars or SendGrid
  console.log(`Email OTP to ${email}: ${otp}`);
  // Optional: send via actual provider if configured
  return true;
}