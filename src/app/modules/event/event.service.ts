import { Prisma } from "@prisma/client";
import { IpaginationOptions } from "../../../helpers/paginationOptions";
import prisma from "../../../shared/prisma";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import {
  startOfDay,
  endOfDay,
  addDays,
  startOfWeek,
  endOfWeek,
  format,
  formatISO,
  parseISO,
  parse,
} from "date-fns";

const createEvent = async (payload: any) => {
  try {
    const selectedDate = new Date(payload.selectedDate);

    const startDateTime = parse(
      `${format(selectedDate, "yyyy-MM-dd")} ${payload.startTime}`,
      "yyyy-MM-dd h:mm a",
      new Date()
    );

    let endDateTime = parse(
      `${format(selectedDate, "yyyy-MM-dd")} ${payload.endTime}`,
      "yyyy-MM-dd h:mm a",
      new Date()
    );

    if (format(endDateTime, "h:mm a") === "12:00 AM") {
      endDateTime = addDays(endDateTime, 1);
    }

    if (endDateTime <= startDateTime) {
      throw new Error("End time must be after start time.");
    }

    const startTimeISO = formatISO(startDateTime);
    const endTimeISO = formatISO(endDateTime);
    const selectedDateISO = formatISO(selectedDate, {
      representation: "complete",
    });

    const [event] = await prisma.$transaction([
      prisma.event.create({
        data: {
          eventDesc: payload.eventDesc,
          eventName: payload.eventName,
          eventType: payload.eventType,
          selectedDate: selectedDateISO,
          startTime: startTimeISO,
          endTime: endTimeISO,
          economySeatCount: payload.economySeatCount,
          economySeatPrice: payload.economySeatPrice,
          vipSeatCount: payload.vipSeatCount,
          vipSeatPrice: payload.vipSeatPrice,
          userId: payload.userId,
        },
      }),
    ]);

    await prisma.eventLocation.create({
      data: {
        city: payload.city,
        lat: payload.lat,
        long: payload.long,
        state: payload.state,
        zipCode: payload.zipCode,
        eventId: event.id,
        userId: payload.userId,
      },
    });

    return event;
  } catch (error: any) {
    console.error("prisma error", error);
    throw new Error(error);
  }
};

const getAllEvents = async (
  filters: any,
  paginationOptions: IpaginationOptions
) => {
  const { skip, limit, page, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);
  // console.log(sortBy, "check sortBy");
  // console.log(sortOrder, "check sortOrder");

  const { query, ...filtersData } = filters;

  // console.log(filtersData, "check filterdata from service");
  // console.log(query, "check query from service file");

  let finalLimit = limit;
  let orderByCondition = { [sortBy]: sortOrder };
  const andCondition: Prisma.EventWhereInput[] = [];
  if (query) {
    andCondition.push({
      OR: [{ eventName: { contains: query as string, mode: "insensitive" } }],
    });
  }

  if (filtersData.type) {
    console.log(filtersData.type, "check type in if logic");
    andCondition.push({ eventType: { in: JSON.parse(filtersData.type) } });
  }

  if (filtersData.featured) {
    andCondition.push({ selectedDate: { gte: startOfDay(new Date()) } });
    orderByCondition = { selectedDate: "asc" };
  }

  if (filtersData.popular) {
    orderByCondition = { enrollCount: "desc" };
  }

  if (filtersData.timeBase) {
    const now = new Date();
    console.log(now, "check time");

    andCondition.push({
      selectedDate: {
        gte: startOfDay(now),
        lte: endOfDay(now),
      },
      startTime: {
        lte: now,
      },
      endTime: {
        gte: now,
      },
    });
  }
  if (filtersData.timeByDate === "today") {
    console.log("today");
    andCondition.push({
      selectedDate: {
        gte: startOfDay(new Date()),
        lte: endOfDay(new Date()),
      },
    });
  }

  if (filtersData.timeByDate === "tomorrow") {
    const tomorrow = addDays(new Date(), 1);
    andCondition.push({
      selectedDate: {
        gte: startOfDay(tomorrow),
        lte: endOfDay(tomorrow),
      },
    });
  }

  if (filtersData.timeByDate === "week") {
    const today = new Date();
    const nextWeek = addDays(today, 7);

    andCondition.push({
      selectedDate: {
        gte: startOfDay(today),
        lte: endOfDay(nextWeek),
      },
    });
  }
  if (filtersData.city && filtersData.state) {
    andCondition.push({
      eventLocation: {
        some: { 
          city: { equals: filtersData.city, mode: "insensitive" },
          state:{equals:filtersData.state,mode:"insensitive"}
         },
        
      },
    });
  }
  const whereConditions: Prisma.EventWhereInput = {
    AND: andCondition.length > 0 ? andCondition : undefined,
  };
  const result = await prisma.event.findMany({
    where: whereConditions,
    skip,
    orderBy: orderByCondition,

    take: finalLimit,
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
      eventLocation: {
        select:{
          city:true,
          state:true,
          zipCode:true,
          lat:true,
          long:true
        }
      },
    },
  });

  const count = await prisma.event.count({ where: whereConditions });
  return {
    meta: { page, limit: finalLimit, count },
    data: result,
  };
};

//  const getEventsByLocation=async(lat:number,long:number)=>{
//   const events=await prisma.event.findMany({
//     where:{
//       eventLocation:{
//         some:
//       }
//     }
//   })

const getSingleEvent = async (id: string) => {
  const event = await prisma.event.findUnique({
    where: {
      id: id,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
  });

  return event;
};

export const eventService = { createEvent, getAllEvents, getSingleEvent };
