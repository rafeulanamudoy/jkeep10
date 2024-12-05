import multer from "multer";
import path from "path";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: async function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// upload single image
const uploadprofileImage = upload.single("profileImage");
const uploadGroupImage = upload.single("groupImage");
const uploadChanelImage = upload.single("chanelImage");

// upload multiple images for portifilo
const uploadPortifiloImages = upload.fields([
  { name: "companyLogo", maxCount: 1 }, // Single file for company logo
  { name: "companyImages", maxCount: 10 }, // Multiple files for company images
]);

export const fileUploader = {
  upload,
  uploadprofileImage,
  uploadGroupImage,
  uploadChanelImage,
  uploadPortifiloImages,
};
