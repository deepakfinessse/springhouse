import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Admin from "@/model/admin.model";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/utils/email";

export async function POST(request) {
  try {
    await connectDB();
    const { username, otp, newPassword } = await request.json();

    if (!username || !otp || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Username, OTP, and New Password are required" },
        { status: 400 },
      );
    }

    // Find admin by username or email
    const admin = await Admin.findOne({
      $or: [{ username: username }, { email: username }],
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Invalid request" },
        { status: 400 },
      );
    }

    if (!admin.resetOtp || !admin.resetOtpExpiry) {
      return NextResponse.json(
        { success: false, error: "No OTP request found for this user" },
        { status: 400 },
      );
    }

    // Check expiry
    if (new Date() > admin.resetOtpExpiry) {
      return NextResponse.json(
        { success: false, error: "OTP has expired. Please request a new one." },
        { status: 400 },
      );
    }

    // Verify OTP
    const isOtpValid = await bcrypt.compare(otp.toString(), admin.resetOtp);
    if (!isOtpValid) {
      return NextResponse.json(
        { success: false, error: "Invalid OTP" },
        { status: 400 },
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update admin
    admin.password = hashedPassword;
    admin.resetOtp = null;
    admin.resetOtpExpiry = null;
    await admin.save();

    // Send confirmation email
    await sendEmail({
      to: admin.email,
      subject: "CMS Admin - Password Changed Successfully",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Password Changed Successfully</h2>
          <p>Hello ${admin.username},</p>
          <p>Your password has been successfully reset.</p>
          <p>If you did not perform this action, please contact support immediately.</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Password reset successful.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
