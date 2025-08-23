import multer from "multer";
import path from "path";
import fs from "fs";

// Definiši direktorijum za čuvanje avatara
const uploadDir = path.join(process.cwd(), "src/uploads/avatars");

// Ako direktorijum ne postoji, napravi ga
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
// Podesi destinaciju i naziv fajla za upload avatara
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Multer destination called");
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
  const ext = path.extname(file.originalname);
  console.log("Multer filename called for:", file.originalname);
  cb(null, `avatar_${Date.now()}${ext}`);
}  
});

// Exportuj middleware za upload avatara
export const uploadAvatar = multer({ storage });
