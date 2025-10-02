import { NextRequest, NextResponse } from "next/server";
import formidable, { File } from "formidable";
import path from "path";
import fs from "fs";
import dbConnect from "@/lib/mongodb";
import { Record } from "@/schema/record";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const formData = await request.formData();

    const country = formData.get("country") as string;
    const accountType = formData.get("accountType") as string;
    const username = formData.get("username") as string;
    const lastName = formData.get("lastName") as string;
    const firstName = formData.get("firstName") as string;
    const email = formData.get("email") as string;
    const contactNumber = formData.get("contactNumber") as string;
    const photo = formData.get("photo") as File | null;

    let photoUrl = formData.get("existingPhotoUrl") as string | null;
    if (photo) {
      const webFile = photo as any;
      const fileName = `${Date.now()}-${webFile.name}`;
      const filePath = path.join(process.cwd(), "public/uploads", fileName);
      const buffer = Buffer.from(await webFile.arrayBuffer());
      fs.writeFileSync(filePath, buffer);
      photoUrl = `/uploads/${fileName}`;
    }

    await Record.findByIdAndUpdate(id, {
      country,
      accountType,
      username,
      lastName,
      firstName,
      email,
      contactNumber,
      photoUrl,
    });

    return NextResponse.json({ success: true, ...(photoUrl && { photoUrl }) });
  } catch (error) {
    console.error("Error updating record:", error);
    return NextResponse.json(
      { error: "Failed to update record" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    await Record.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting record:", error);
    return NextResponse.json(
      { error: "Failed to delete record" },
      { status: 500 }
    );
  }
}
