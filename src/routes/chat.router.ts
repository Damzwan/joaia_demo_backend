import {Router} from "express";
import {generateGuideMessages} from "../services/chat.service";
import {resolveMessages} from "../lib/resolveMessages";
import {ChatRequestSchema} from "../schemas/chat.schema";

const router = Router();

router.post("/", async (req, res) => {
    const {messages: history} = ChatRequestSchema.parse(req.body);

    const raw = await generateGuideMessages(history);
    const messages = await resolveMessages(raw);

    res.json({messages});
});

export default router;