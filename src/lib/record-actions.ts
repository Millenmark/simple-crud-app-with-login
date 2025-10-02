"use server";

import { z } from "zod";
import dbConnect from "@/lib/mongodb";
import { Record as RecordModel } from "@/schema/record";
import path from "path";
import fs from "fs";

const recordSchema = z.object({
  country: z.string().min(1, "Country is required"),
  accountType: z.string().min(1, "Account type is required"),
  username: z.string().min(1, "Username is required"),
  lastName: z.string().min(1, "Last name is required"),
  firstName: z.string().min(1, "First name is required"),
  email: z.string().email("Invalid email address"),
  contactNumber: z.string().min(1, "Contact number is required"),
});

const uploadsDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export async function createOrUpdateRecord(prevState: any, formData: FormData) {
  try {
    await dbConnect();

    const rawData = Object.fromEntries(formData);
    const id = rawData.id as string | undefined;
    console.log("id", id);
    const existingPhotoUrl = rawData.existingPhotoUrl as string | undefined;

    // Remove id and existingPhotoUrl from validation data
    const { id: _, existingPhotoUrl: __, photo, ...validationData } = rawData;

    const result = recordSchema.safeParse(validationData);

    if (!result.success) {
      return {
        errors: result.error.flatten().fieldErrors,
      };
    }

    const {
      country,
      accountType,
      username,
      lastName,
      firstName,
      email,
      contactNumber,
    } = result.data;

    let photoUrl = existingPhotoUrl || null;
    if (photo && photo instanceof File && photo.size > 0) {
      const fileName = `${Date.now()}-${photo.name}`;
      const filePath = path.join(uploadsDir, fileName);
      const buffer = Buffer.from(await photo.arrayBuffer());
      fs.writeFileSync(filePath, buffer);
      photoUrl = `/uploads/${fileName}`;
    }

    if (id) {
      // Update
      await RecordModel.findByIdAndUpdate(id, {
        country,
        accountType,
        username,
        lastName,
        firstName,
        email,
        contactNumber,
        photoUrl,
      });
    } else {
      // Create
      await RecordModel.create({
        country,
        accountType,
        username,
        lastName,
        firstName,
        email,
        contactNumber,
        photoUrl,
      });
    }

    return {
      success: true,
      message: id
        ? "Record updated successfully"
        : "Record created successfully",
    };
  } catch (error) {
    console.error("Error saving record:", error);
    return {
      errors: {
        general: ["Failed to save record"],
      },
    };
  }
}
