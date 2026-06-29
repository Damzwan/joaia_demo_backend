import {ObjectId} from "mongodb";
import {usersCollection} from "../lib/db";

export const createUser = async (preferences: any) => {
    const newUser = {preferences, createdAt: new Date()};
    const result = await usersCollection.insertOne(newUser);
    return result.insertedId;
};

export const getUserById = async (id: string) => {
    if (!ObjectId.isValid(id)) throw new Error("INVALID_ID");

    const user = await usersCollection.findOne({_id: new ObjectId(id)});
    if (!user) throw new Error("USER_NOT_FOUND");

    return user;
};