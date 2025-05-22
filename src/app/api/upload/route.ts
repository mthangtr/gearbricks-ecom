import { NextRequest, NextResponse } from "next/server";
import { uploadFile } from "@/lib/cloudinary";
import sharp from "sharp"; // THÊM sharp

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const isWebp = file.type === "image/webp" || file.name?.endsWith(".webp");

    let processedBuffer: Buffer = buffer;

    // Convert sang webp nếu không phải
    if (!isWebp) {
      processedBuffer = await sharp(buffer).webp({ quality: 80 }).toBuffer();
    }

    const res = (await uploadFile(processedBuffer, "p-img")) as {
      secure_url: string;
      public_id: string;
      format: string;
    };

    return NextResponse.json(
      {
        url: res.secure_url,
        public_id: res.public_id,
        format: res.format,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    );
  }
}
