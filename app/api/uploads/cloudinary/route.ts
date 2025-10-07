import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary using server environment variables (DO NOT expose these to client)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    // Expect multipart/form-data with a `file` field
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data") && !contentType.includes("form-data")) {
      return NextResponse.json({ error: "Expected multipart/form-data" }, { status: 400 });
    }

    // Parse the incoming form data using the Web FormData API available on Request
    const formData = await req.formData();
    const file = formData.get("file") as any;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to buffer and then data URI for Cloudinary upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mime = file.type || "application/octet-stream";
    const dataUri = `data:${mime};base64,${buffer.toString("base64")}`;

    // Optional: you can pass upload options here (folder, transformations, public_id, etc.)
    const uploadOptions: Record<string, any> = {};
    if (process.env.CLOUDINARY_UPLOAD_FOLDER) uploadOptions.folder = process.env.CLOUDINARY_UPLOAD_FOLDER;

    const result = await cloudinary.uploader.upload(dataUri, uploadOptions);
    return NextResponse.json(result, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
