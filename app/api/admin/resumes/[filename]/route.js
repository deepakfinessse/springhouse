import { NextResponse } from "next/server";
import { verifyJWT } from "@/utils/auth";
import path from "path";
import fs from "fs";

export async function GET(request, { params }) {
  // 1. Authenticate Admin
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { success: false, error: "Authentication required" },
      { status: 401 },
    );
  }

  const token = authHeader.split(" ")[1];
  const payload = await verifyJWT(token);

  if (!payload) {
    return NextResponse.json(
      { success: false, error: "Invalid or expired token" },
      { status: 401 },
    );
  }

  const { filename } = await params;

  if (!filename) {
    return NextResponse.json(
      { success: false, error: "Filename is required" },
      { status: 400 },
    );
  }

  // 2. Locate File
  // Usage: /api/admin/resumes/1234567890_resume.pdf
  const filePath = path.join(
    process.cwd(),
    "private_uploads/resumes",
    filename,
  );

  if (!fs.existsSync(filePath)) {
    return NextResponse.json(
      { success: false, error: "File not found" },
      { status: 404 },
    );
  }

  // 3. Stream File
  const fileBuffer = fs.readFileSync(filePath);
  const mimeType = "application/pdf"; // Assuming PDFs, or distinct logic could detect type

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": mimeType,
      "Content-Disposition": `attachment; filename=${filename}`,
    },
  });
}
