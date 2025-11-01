"use strict";

import multer from "multer";
import path from "path";

// Set storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads"); // Ensure this folder exists
    },
    filename: (req, file, cb) => {
        const uniqueName = new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname;
        cb(null, uniqueName);
    },
});

// Filter to allow only .mp4 files
const fileFilter = (req, file, cb) => {
    const allowedMime = ["video/mp4"];
    if (allowedMime.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only .mp4 files are allowed"), false);
    }
};

// Multer upload configuration
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 500 * 1024 * 1024, // Limit file size to 500MB (change if needed)
    },
});

export default upload;
