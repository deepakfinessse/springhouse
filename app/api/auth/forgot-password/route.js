import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Admin from "@/model/admin.model";
import { sendEmail } from "@/utils/email";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function POST(request) {
  try {
    await connectDB();
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json(
        { success: false, error: "Username or Email is required" },
        { status: 400 },
      );
    }

    // Find admin by username or email
    const admin = await Admin.findOne({
      $or: [{ username: username }, { email: username }],
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, error: "User not found with this username or email" },
        { status: 404 }
      );
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    // Set expiry to 10 minutes from now
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    admin.resetOtp = hashedOtp;
    admin.resetOtpExpiry = expiry;
    await admin.save();

    const emailSent = await sendEmail({
      to: admin.email,
      subject: "CMS Admin - Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>Hello ${admin.username},</p>
          <p>You requested to reset your password. Here is your 6-digit OTP:</p>
          <h1 style="background: #f4f4f4; padding: 10px; width: fit-content; letter-spacing: 5px;">${otp}</h1>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `,
    });

    if (!emailSent) {
      return NextResponse.json(
        { success: false, error: "Failed to send email. Please check configuration." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "If the account exists, an OTP has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
