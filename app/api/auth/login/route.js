import { NextResponse } from "next/server";
import { signJWT } from "@/utils/auth";
import connectDB from "@/utils/db";
import Admin from "@/model/admin.model";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username and password are required" },
        { status: 400 },
      );
    }

    // Seed logic: Check if any admin exists, if not, create from .env
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const adminUsername = process.env.ADMIN_USERNAME;
      const adminPassword = process.env.ADMIN_PASSWORD;
      const adminEmail = process.env.ADMIN_EMAIL || "demo-admin@yourdomain.com";

      if (adminUsername && adminPassword) {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        await Admin.create({
          username: adminUsername,
          password: hashedPassword,
          email: adminEmail
        });
        console.log("Admin seeded from .env credentials.");
      }
    }

    const admin = await Admin.findOne({ username });

    if (admin) {
      const isPasswordMatch = await bcrypt.compare(password, admin.password);
      
      if (isPasswordMatch) {
         // Generate JWT
         const token = await signJWT({ username: admin.username, role: "admin" });

         // Create response with cookie
         const response = NextResponse.json({ success: true });

         response.cookies.set("token", token, {
           httpOnly: true,
           secure: process.env.NODE_ENV === "production",
           maxAge: 60 * 60 * 24, // 1 day
           path: "/",
           sameSite: "strict",
         });

         return response;
      }
    }

    return NextResponse.json(
      { success: false, error: "Invalid credentials" },
      { status: 401 },
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
