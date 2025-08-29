import multer from "multer";
import path from "path";
import fs from "fs";

// 1) Folder za upload
const uploadDir = path.join(process.cwd(), "uploads", "slike"); 


// Kreiraj folder ako ne postoji 
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 2) Disk storage sa dogovorenim imenom fajla
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    // Ekstenzija iz originalnog imena 
    const ext = path.extname(file.originalname) || "";
    // userId uzimamo iz JWT-a (postavlja ga authenticate middleware)
    const userId = (req as any).user?.id ?? "anon";
    const ts = Date.now();
    cb(null, `slika_${userId}_${ts}${ext}`);
  },
});

export const uploadAvatar = multer({ storage });
