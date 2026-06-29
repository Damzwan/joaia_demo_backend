import {Router} from "express";
import * as userService from "../services/user.service";
import {CreateUserSchema, UserIdSchema} from "../schemas/user.schema";

const router = Router();


router.post("/", async (req, res) => {
    const {preferences} = CreateUserSchema.parse(req.body);

    const userId = await userService.createUser(preferences);
    res.status(201).json({success: true, userId});
});

router.get("/:id", async (req, res) => {
    const {id} = UserIdSchema.parse(req.params);

    const user = await userService.getUserById(id);
    res.json(user);
});

export default router;