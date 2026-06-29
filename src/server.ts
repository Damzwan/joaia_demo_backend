import app from "./app";
import {connectDb, closeDb} from "./lib/db";
import {PORT} from "./config/env";

async function start() {
    await connectDb();
    const server = app.listen(PORT, () => {
        console.log(`🚀 Guide backend running on http://localhost:${PORT}`);
    });

    const shutdown = async () => {
        server.close();
        await closeDb();
        process.exit(0);
    };
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
}

start().catch((err) => {
    console.error("Startup failed:", err);
    process.exit(1);
});