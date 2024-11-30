import express from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoute } from "../modules/auth/auth.routes";
import { groupRoutes } from "../modules/group/group.routes";
import { chanelRoutes } from "../modules/chanel/chanel.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    route: userRoutes,
  },

  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/group",
    route: groupRoutes,
  },
  {
    path: "/chanel",
    route: chanelRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
