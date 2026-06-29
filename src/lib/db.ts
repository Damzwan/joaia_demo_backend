import {MongoClient, type Collection} from "mongodb";
import {MONGO_URI, DB_NAME} from "../config/env";

/** *
 * TODO: Migrate to Mongoose for schema validation + built-in typing :)
 */
let client: MongoClient | null = null;
export let usersCollection: Collection;

export async function connectDb(): Promise<void> {
    client = new MongoClient(MONGO_URI);
    await client.connect();
    usersCollection = client.db(DB_NAME).collection("users");
    console.log("📁 Connected to MongoDB");
}

export async function closeDb(): Promise<void> {
    await client?.close();
    client = null;
}