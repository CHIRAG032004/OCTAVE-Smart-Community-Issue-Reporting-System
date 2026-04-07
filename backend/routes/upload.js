const express = require('express');
const fileUpload = require('express-fileupload');
const router = express.Router();
const cloudinary = require('cloudinary');
const fs = require('fs');
const os = require('os');
const { requireAuth } = require('../middleware/auth');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY || process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET || process.env.CLOUDINARY_API_SECRET
});

// Middleware to handle file uploads
router.use(fileUpload({
    useTempFiles: true,
    tempFileDir: os.tmpdir()
}));

router.post('/upload', async (req, res) => {
    let file;

    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ error: "No files were uploaded" });
        }

        file = req.files.file;
        if (file.size > 1024 * 1024) {
            await removeTmp(file.tempFilePath);
            return res.status(400).json({ error: "Image size too large. Max 1 MB allowed." });
        }

        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/png' && file.mimetype !== 'image/webp') {
            await removeTmp(file.tempFilePath);
            return res.status(400).json({ error: "File format is incorrect. Use png, jpg, jpeg, or webp." });
        }

        const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
            folder: 'JagrukImageContainer'
        });

        await removeTmp(file.tempFilePath);

        return res.json({ public_id: result.public_id, url: result.secure_url });
    } catch (err) {
        if (file?.tempFilePath) {
            await removeTmp(file.tempFilePath);
        }

        console.error('Image upload error:', err);
        return res.status(500).json({ error: err.message || 'Image upload failed' });
    }
});

router.post('/destroy', requireAuth(), async (req, res) => {
    try {
        const { public_id } = req.body;
        if (!public_id) return res.status(400).json({ error: "No images selected" });

        await cloudinary.v2.uploader.destroy(public_id);

        return res.json({ msg: "Image deleted successfully" });
    } catch (err) {
        console.error('Image destroy error:', err);
        return res.status(500).json({ error: err.message || 'Image delete failed' });
    }
});

const removeTmp = async (path) => {
    if (!path || !fs.existsSync(path)) return;

    try {
        await fs.promises.unlink(path);
    } catch (err) {
        console.warn('Temp file cleanup failed:', err.message);
    }
}

module.exports = router;
