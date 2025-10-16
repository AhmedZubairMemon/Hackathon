import express from "express";
import cloudinary from "../config/cloudinary.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post("/image", upload.single("file"), async (req, res) => {
  try {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "hackathon_uploads" },
      (error, result) => {
        if (error)
          return res.status(500).json({ message: "Upload failed", error });
        return res.status(200).json({ url: result.secure_url });
      }
    );

    stream.end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;