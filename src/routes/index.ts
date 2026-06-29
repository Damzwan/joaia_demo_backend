import {Router} from "express";
import userRoutes from "./user.router";
import chatRoutes from "./chat.router";
import placesRoutes from "./places.router";
import routesRoutes from "./routes.router";

const router = Router();

router.use("/users", userRoutes);
router.use("/chat", chatRoutes);
router.use("/places", placesRoutes);
router.use("/routes", routesRoutes);

export default router;