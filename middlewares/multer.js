import multer from "multer";
import sharp from "sharp";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, 
  },
}).single("image");

const uploadWithLimit = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          result: 0,
          message: "Image must be less than 2MB",
        });
      }
      return res.status(400).json({ result: 0, message: err.message });
    } else if (err) {
      return res.status(500).json({ result: 0, message: err.message });
    }
    next();
  });
};

const compressImage = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const compressedBuffer = await sharp(req.file.buffer)
      .webp({ quality: 80 })
      .toBuffer();

    req.file.buffer = compressedBuffer;
    req.file.mimetype = "image/webp";
    req.file.originalname = req.file.originalname.replace(/\.[^/.]+$/, ".webp");

    next();
  } catch (error) {
    next(error);
  }
};

export { uploadWithLimit, compressImage };
