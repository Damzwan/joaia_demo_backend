import {Router} from "express";
import {placesService} from "../services/places.service";
import {exploreService} from "../services/explore.service";
import {SearchQuerySchema, PlaceIdSchema} from "../schemas/places.schema";

const router = Router();

router.get("/search", async (req, res) => {
    const {q, limit, lat, lng} = SearchQuerySchema.parse(req.query);
    const places = await placesService.searchText(q, limit, lat, lng);
    res.json(places);
});

router.get("/explore", async (req, res) => {
    const places = await exploreService.getAll();
    res.json(places);
});

router.get("/:id", async (req, res) => {
    const {id} = PlaceIdSchema.parse(req.params);
    const details = await placesService.getDetails(id);
    res.json(details);
});

export default router;