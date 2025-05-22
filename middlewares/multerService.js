import multer from "multer";
import sharp from "sharp";

const storage = multer.memoryStorage();

const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } });

const uploadFields = upload.fields([
  { name: "bannerImage", maxCount: 1 },
  { name: "contentSectionImage", maxCount: 1 },
]);

const compressImages = async (req, res, next) => {
  try {
    if (!req.files) return next();

    const allFiles = Object.values(req.files).flat();

    await Promise.all(
      allFiles.map(async (file) => {
        const compressedBuffer = await sharp(file.buffer)
          .webp({ quality: 80 })
          .toBuffer();
        file.buffer = compressedBuffer;
        file.mimetype = "image/webp";
        file.originalname = file.originalname.replace(/\.[^/.]+$/, ".webp");
      })
    );

    next();
  } catch (err) {
    next(err);
  }
};

export { uploadFields, compressImages };
