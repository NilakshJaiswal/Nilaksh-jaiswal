import { Router } from "express";
import multer from "multer";
import { requireAdmin } from "../middleware/auth";
import { asyncHandler, ApiError } from "../middleware/errorHandler";
import { cloudinary, cloudinaryConfigured } from "../config/cloudinary";

const router = Router();

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]);
const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_BYTES },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      cb(new ApiError(400, "Unsupported file type. Use JPEG, PNG, WEBP, GIF or SVG."));
      return;
    }
    cb(null, true);
  },
});

router.post(
  "/",
  requireAdmin,
  upload.single("image"),
  asyncHandler(async (req, res) => {
    if (!cloudinaryConfigured) {
      throw new ApiError(
        503,
        "Image storage is not configured on the server. Set CLOUDINARY_CLOUD_NAME, " +
          "CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in the backend .env file, then restart the server."
      );
    }
    if (!req.file) {
      throw new ApiError(400, "No image file was provided.");
    }

    const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "nilaksh-portfolio", resource_type: "image" },
        (err, res) => {
          if (err || !res) return reject(err || new Error("Upload failed."));
          resolve({ secure_url: res.secure_url, public_id: res.public_id });
        }
      );
      stream.end(req.file!.buffer);
    });

    res.status(201).json({ url: result.secure_url, publicId: result.public_id });
  })
);

export default router;
