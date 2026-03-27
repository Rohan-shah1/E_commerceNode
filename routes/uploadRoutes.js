const express = require('express');
const multer = require('multer');
const path = require('path');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

// Define storage engine logic config
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// File validation checks restricting to specific formats
function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Format error: Images only!');
    }
}

// Init Multer
const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

// @desc    Upload an image
// @route   POST /api/v1/uploads
// @access  Private/Admin
router.post('/', protect, authorize('admin'), upload.single('image'), (req, res) => {
    // Normalizes windows paths to universal web slashes to serve properly
    res.status(200).send(`/${req.file.path.replace(/\\/g, '/')}`);
});

module.exports = router;
