import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
import config from "../../../config";
import { Request } from "express";

const createGroupInDB = async (req: any) => {
  const payload = req.body;
  const userId = req.user.id;
  const file = req.file;
  if (!file) {
    throw new ApiError(400, "No file attached");
  }
  const imageUrl = file
    ? `${config.backend_base_url}/uploads/${file.originalname}`
    : null;
  const existingGroup = await prisma.group.findFirst({
    where: { groupName: payload.groupName },
  });
  if (existingGroup) {
    throw new ApiError(409, "Group with the same name already exists");
  }
  const newGroup = await prisma.group.create({
    data: {
      ...payload,
      userId,
      groupImage: imageUrl ? imageUrl : "",
    },
  });

  return newGroup;
};

const getGroupsInDB = async () => {
  const groups = await prisma.group.findMany({ include: { chanel: true } });
  if (groups.length === 0) {
    throw new ApiError(404, "Group not found");
  }
  return groups;
};

const getGroupInDB = async (groupId: string) => {
  const group = await prisma.group.findUnique({ where: { id: groupId } });
  if (!group) {
    throw new ApiError(404, "Group not found");
  }
  return group;
};

const updateGroupInDB = async (req: Request) => {
  const payload = req.body;
  const groupId = req.params.groupId;
  const file = req.file;
  const imageUrl = file
    ? `${config.backend_base_url}/uploads/${file.originalname}`
    : null;
  const existingGroup = await prisma.group.findUnique({
    where: { id: groupId },
  });
  if (!existingGroup) {
    throw new ApiError(404, "Group not found for update");
  }
  const updatedGroup = await prisma.group.update({
    where: { id: groupId },
    data: {
      ...payload,
      groupImage: imageUrl ? imageUrl : existingGroup.groupImage,
    },
  });
  return updatedGroup;
};

const deleteGroupInDB = async (groupId: string) => {
  const existingGroup = await prisma.group.findUnique({
    where: { id: groupId },
  });
  if (!existingGroup) {
    throw new ApiError(404, "Group not found for delete");
  }
  await prisma.group.delete({ where: { id: groupId } });

  return;
};

export const groupServices = {
  createGroupInDB,
  getGroupsInDB,
  getGroupInDB,
  updateGroupInDB,
  deleteGroupInDB,
};
