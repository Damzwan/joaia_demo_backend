import {Router} from "express";
import {RouteRequestSchema} from "../schemas/route.schema";
import {routesService} from "../services/routes.service";

const router = Router();

/**
 * TODO: Implement caching (e.g., Redis) to store common route requests.
 */
router.post("/", async (req, res) => {
    const {stops, mode} = RouteRequestSchema.parse(req.body);

    const path = await routesService.getRoute(stops, mode);
    res.json({path});
});

export default router;