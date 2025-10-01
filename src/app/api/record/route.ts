import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { File } from "formidable";
import path from "path";

// Tell Next.js not to parse request body (since formidable will handle it)
export const config = {
  api: {
    bodyParser: false,
  },
};

// Define response type
type Data = {
  success?: boolean;
  photoUrl?: string;
  error?: string;
};

export default async function POST(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = formidable({
    uploadDir: path.join(process.cwd(), "public/uploads"),
    keepExtensions: true,
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Upload failed" });
    }

    const country = Array.isArray(fields.country)
      ? fields.country[0]
      : fields.country;
    const accountType = Array.isArray(fields.accountType)
      ? fields.accountType[0]
      : fields.accountType;
    const username = Array.isArray(fields.username)
      ? fields.username[0]
      : fields.username;
    const lastName = Array.isArray(fields.lastName)
      ? fields.lastName[0]
      : fields.lastName;
    const firstName = Array.isArray(fields.firstName)
      ? fields.firstName[0]
      : fields.firstName;
    const email = Array.isArray(fields.email) ? fields.email[0] : fields.email;
    const contactNumber = Array.isArray(fields.contactNumber)
      ? fields.contactNumber[0]
      : fields.contactNumber;

    let photoUrl = null;
    if (files.photo && Array.isArray(files.photo) && files.photo[0]) {
      const file = files.photo[0] as File;
      const fileName = path.basename(file.filepath);
      photoUrl = `/uploads/${fileName}`;
    }

    // TODO: Save the record data in your DB
    console.log({
      country,
      accountType,
      username,
      lastName,
      firstName,
      email,
      contactNumber,
      photoUrl,
    });

    return res
      .status(200)
      .json({ success: true, ...(photoUrl && { photoUrl }) });
  });
}
