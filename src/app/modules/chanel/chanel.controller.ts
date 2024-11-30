import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { chanelServices } from "./chanel.service";

// create a new chanel
const createChanel = catchAsync(async (req: Request, res: Response) => {
  const result = await chanelServices.createChanelInDB(req);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "New Chanel created successfully",
    data: result,
  });
});

// get all chanel
const getAllChanels = catchAsync(async (req: Request, res: Response) => {
  const chanels = await chanelServices.getChanelsInDB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Chanels retrieved",
    data: chanels,
  });
});

// get single chanel
const getSingleChanel = catchAsync(async (req: Request, res: Response) => {
  const chanel = await chanelServices.getChanelInDB(req.params.chanelId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Chanel retrived successfully",
    data: chanel,
  });
});

// update chanel
const updateChanel = catchAsync(async (req: Request, res: Response) => {
  const updatedChanel = await chanelServices.updateChanelInDB(req);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Chanel updated successfully",
    data: updatedChanel,
  });
});

// delete chanel
const deleteChanel = catchAsync(async (req: Request, res: Response) => {
  const chanelId = req.params.chanelId;
  await chanelServices.deleteChanelInDB(chanelId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Chanel deleted successfully",
  });
});

export const chanelControllers = {
  createChanel,
  getAllChanels,
  getSingleChanel,
  updateChanel,
  deleteChanel,
};
