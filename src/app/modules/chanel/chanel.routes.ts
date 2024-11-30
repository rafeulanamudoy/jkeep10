import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { parseBodyData } from "../../middlewares/parseBodyData";
import { fileUploader } from "../../../helpers/fileUploader";
import { chanelControllers } from "./chanel.controller";

const router = Router();

router.post(
  "/create/:groupId",
  fileUploader.uploadChanelImage,
  parseBodyData,
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  chanelControllers.createChanel
);
router.get("/", auth(), chanelControllers.getAllChanels);
router.get("/:chanelId", auth(), chanelControllers.getSingleChanel);
router.put(
  "/:chanelId",
  fileUploader.uploadChanelImage,
  parseBodyData,
  auth(UserRole.SUPER_ADMIN),
  chanelControllers.updateChanel
);
router.delete(
  "/:chanelId",
  auth(UserRole.SUPER_ADMIN),
  chanelControllers.deleteChanel
);

export const chanelRoutes = router;
