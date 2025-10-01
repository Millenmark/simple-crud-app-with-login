import { NextRequest, NextResponse } from "next/server";
import formidable, { File } from "formidable";
import path from "path";
import fs from "fs";
import dbConnect from "@/lib/mongodb";
import { Record } from "@/schema/record";

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export async function GET() {
  try {
    await dbConnect();
    const records = await Record.find({});
    return NextResponse.json(records);
  } catch (error) {
    console.error("Error fetching records:", error);
    return NextResponse.json(
      { error: "Failed to fetch records" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const formData = await request.formData();

    const country = formData.get("country") as string;
    const accountType = formData.get("accountType") as string;
    const username = formData.get("username") as string;
    const lastName = formData.get("lastName") as string;
    const firstName = formData.get("firstName") as string;
    const email = formData.get("email") as string;
    const contactNumber = formData.get("contactNumber") as string;
    const photo = formData.get("photo") as File | null;

    let photoUrl = null;
    if (photo) {
      const webFile = photo as any;
      const fileName = `${Date.now()}-${webFile.name}`;
      const filePath = path.join(uploadsDir, fileName);
      const buffer = Buffer.from(await webFile.arrayBuffer());
      fs.writeFileSync(filePath, buffer);
      photoUrl = `/uploads/${fileName}`;
    }

    const newRecord = new Record({
      country,
      accountType,
      username,
      lastName,
      firstName,
      email,
      contactNumber,
      photoUrl,
    });

    await newRecord.save();

    return NextResponse.json({ success: true, ...(photoUrl && { photoUrl }) });
  } catch (error) {
    console.error("Error saving record:", error);
    return NextResponse.json(
      { error: "Failed to save record" },
      { status: 500 }
    );
  }
}
