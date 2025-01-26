import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: function (req, file, cb) {
    // Add a timestamp to the original filename
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);

    const newFilename = `${timestamp}-${baseName}${ext}`;
    cb(null, newFilename);
  },
});

const upload = multer({ storage: storage });

// Upload single images
const updateProfileImage = upload.single("avatar");
const uploadQuizImage = upload.single("quizImage");

// Upload multiple images for portfolio
const sendFiles = upload.fields([
  { name: "sendFiles", maxCount: 10 },
  { name: "messageFiles", maxCount: 10 },
]);

export const fileUploader = {
  sendFiles,
  updateProfileImage,
  uploadQuizImage,
};
