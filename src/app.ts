import express from "express";
import cors from "cors";
import router from "./routes";
import {errorHandler} from "./middleware/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());

app.use(router);

app.use((_req, res) => {
    res.status(404).json({error: "Endpoint not found"});
});

app.use(errorHandler);

export default app;