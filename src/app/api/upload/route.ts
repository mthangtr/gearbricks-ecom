import { NextRequest, NextResponse } from "next/server";
import { uploadFile } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  try {
    const buffer = await Buffer.from(await file.arrayBuffer());
    const res = (await uploadFile(buffer, "p-img")) as {
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
