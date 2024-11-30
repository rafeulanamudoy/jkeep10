import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { groupControllers } from "./group.controller";
import { parseBodyData } from "../../middlewares/parseBodyData";
import { fileUploader } from "../../../helpers/fileUploader";

const router = Router();

router.post(
  "/create",
  fileUploader.uploadGroupImage,
  parseBodyData,
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  groupControllers.createGroup
);
router.get("/", auth(), groupControllers.getAllGroups);
router.get("/:groupId", auth(), groupControllers.getSingleGroup);
router.put(
  "/:groupId",
  fileUploader.uploadGroupImage,
  parseBodyData,
  auth(UserRole.SUPER_ADMIN),
  groupControllers.updateGroup
);
router.delete(
  "/:groupId",
  auth(UserRole.SUPER_ADMIN),
  groupControllers.deleteGroup
);

export const groupRoutes = router;
