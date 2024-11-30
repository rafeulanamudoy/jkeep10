import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
import config from "../../../config";
import { Request } from "express";

const createChanelInDB = async (req: any) => {
  const payload = req.body;
  const userId = req.user.id;
  const groupId = req.params.groupId;
  const file = req.file;
  if (!file) {
    throw new ApiError(400, "No file attached");
  }
  const imageUrl = file
    ? `${config.backend_base_url}/uploads/${file.originalname}`
    : null;
  const existingGroup = await prisma.chanel.findFirst({
    where: { chanelName: payload.chanelName },
  });
  if (existingGroup) {
    throw new ApiError(409, "chanel with the same name already exists");
  }
  const newGroup = await prisma.chanel.create({
    data: {
      ...payload,
      userId,
      groupId,
      chanelImage: imageUrl ? imageUrl : "",
    },
  });

  return newGroup;
};

const getChanelsInDB = async () => {
  const chanels = await prisma.chanel.findMany({ include: { group: true } });
  if (chanels.length === 0) {
    throw new ApiError(404, "chanels not found");
  }
  return chanels;
};

const getChanelInDB = async (chanelId: string) => {
  const group = await prisma.chanel.findUnique({
    where: { id: chanelId },
    include: { group: true },
  });
  if (!group) {
    throw new ApiError(404, "chanel not found");
  }
  return group;
};

const updateChanelInDB = async (req: Request) => {
  const payload = req.body;
  const chanelId = req.params.chanelId;
  const file = req.file;
  const imageUrl = file
    ? `${config.backend_base_url}/uploads/${file.originalname}`
    : null;
  const existingChanel = await prisma.chanel.findUnique({
    where: { id: chanelId },
  });
  if (!existingChanel) {
    throw new ApiError(404, "chanel not found for update");
  }
  const updatedChanel = await prisma.chanel.update({
    where: { id: chanelId },
    data: {
      ...payload,
      chanelImage: imageUrl ? imageUrl : existingChanel.chanelImage,
    },
  });
  return updatedChanel;
};

const deleteChanelInDB = async (chanelId: string) => {
  const existingChanel = await prisma.chanel.findUnique({
    where: { id: chanelId },
  });
  if (!existingChanel) {
    throw new ApiError(404, "Group not found for delete");
  }
  await prisma.chanel.delete({ where: { id: chanelId } });

  return;
};

export const chanelServices = {
  createChanelInDB,
  getChanelsInDB,
  getChanelInDB,
  updateChanelInDB,
  deleteChanelInDB,
};
