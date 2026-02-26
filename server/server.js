const path = require('path');
// 1 & 4 & 5. Verify dotenv is configured correctly and env variables are read.
// Load .env explicitly from the server folder if it exists.
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');

console.log('--- Environment Variable Check ---');
console.log('Looking for .env file at:', path.resolve(__dirname, '.env'));
const isCloudNameSet = !!process.env.CLOUDINARY_CLOUD_NAME;
const isApiKeySet = !!process.env.CLOUDINARY_API_KEY;
const isApiSecretSet = !!process.env.CLOUDINARY_API_SECRET;

console.log('CLOUDINARY_CLOUD_NAME:', isCloudNameSet ? `✅ SET (${process.env.CLOUDINARY_CLOUD_NAME})` : '❌ MISSING');
console.log('CLOUDINARY_API_KEY:', isApiKeySet ? '✅ SET (Hidden)' : '❌ MISSING');
console.log('CLOUDINARY_API_SECRET:', isApiSecretSet ? '✅ SET (Hidden)' : '❌ MISSING');
console.log('----------------------------------');

if (!isCloudNameSet || !isApiKeySet || !isApiSecretSet) {
    console.warn('⚠️ WARNING: Cloudinary environment variables are missing! Image uploads will fail. Please ensure the .env file in the server directory has these variables configured.');
}

// ─── Cloudinary Config ─────────────────────────────────────────────────────
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─── Express Setup ─────────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 5000;

// Allow requests from the Vite dev server (port 5173) and any production origin
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['POST'],
}));

app.use(express.json());

// ─── Multer — memory storage (no disk writes) ──────────────────────────────
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
    fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed'), false);
        }
        cb(null, true);
    },
});

// ─── Helper: buffer → Cloudinary via upload_stream ─────────────────────────
function uploadToCloudinary(buffer, options = {}) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'product-images', ...options },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        Readable.from(buffer).pipe(stream);
    });
}

// ─── POST /upload ───────────────────────────────────────────────────────────
// 2 & 7. Wrap multer upload to catch upload-specific errors more cleanly and add defensive checks
app.post('/upload', (req, res, next) => {
    upload.single('image')(req, res, function (err) {
        console.log('--- Incoming /upload Request ---');
        console.log('Headers content-type:', req.headers['content-type'] ? req.headers['content-type'] : 'No content-type header found');

        if (err instanceof multer.MulterError) {
            console.error('❌ Multer Error:', err);
            return res.status(400).json({ error: `Multer Error: ${err.message}`, code: err.code });
        } else if (err) {
            console.error('❌ Unknown Upload Error:', err);
            return res.status(500).json({ error: `Upload Error: ${err.message}` });
        }
        next();
    });
}, async (req, res) => {
    try {
        console.log('File details:', req.file ? {
            fieldname: req.file.fieldname,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size
        } : '❌ No file object found');

        // 7. Add defensive checks and return proper error messages in JSON.
        if (!req.file) {
            console.error('❌ Upload Failed: No image file provided in the request body.');
            return res.status(400).json({ error: 'No image file provided. Please verify the form field is strictly named "image" and check your payload format.' });
        }

        // 6. Check if multer upload directory exists.
        console.log('ℹ️ Using Multer config: memoryStorage() - No physical upload directory is used, operating directly from memory buffer.');
        if (!req.file.buffer || req.file.buffer.length === 0) {
            console.error('❌ Upload Failed: File buffer is empty or missing.');
            return res.status(400).json({ error: 'File buffer is empty or missing.' });
        }

        console.log('⏳ Uploading file to Cloudinary...');
        let result;
        try {
            result = await uploadToCloudinary(req.file.buffer, {
                quality: 'auto',
                fetch_format: 'auto',
            });
        } catch (cloudinaryErr) {
            // 3. Log the exact Cloudinary error to console.
            console.error('❌ Exact Cloudinary Error:', JSON.stringify(cloudinaryErr, null, 2));
            if (cloudinaryErr) {
                console.error('Cloudinary Error Message:', cloudinaryErr.message);
                console.error('Cloudinary HTTP Code:', cloudinaryErr.http_code);
            }
            return res.status(500).json({
                error: 'Failed to upload image to Cloudinary.',
                details: cloudinaryErr ? cloudinaryErr.message : 'Unknown Cloudinary error'
            });
        }

        console.log('✅ Upload successful. Cloudinary URL:', result.secure_url);

        return res.status(200).json({
            secure_url: result.secure_url,
            public_id: result.public_id,
        });

    } catch (err) {
        console.error('❌ Unexpected Express Route Error:', err);
        return res.status(500).json({ error: 'An unexpected internal server error occurred during handling.', details: err.message });
    }
});

// ─── Health check ───────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// ─── Multer error handler ───────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
    if (err instanceof multer.MulterError || err.message) {
        return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Internal server error.' });
});

// ─── Start ──────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`✅ Upload server running at http://localhost:${PORT}`);
    console.log(`   POST http://localhost:${PORT}/upload`);
});
