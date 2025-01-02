import { PrismaClient } from "@prisma/client";
import mongoose from "mongoose";

declare global {
  var prisma: PrismaClient;
  var db: typeof mongoose | undefined;
}

const prisma: PrismaClient = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
}

const connectToDatabase = async () => {
  if (global.db) {
    return global.db;
  }

  try {
    const dbUrl = process.env.ROUTINE_DB_URL;
    if (!dbUrl) {
      throw new Error(
        "Database URL (ROUTINE_DB_URL) is not defined in environment variables.",
      );
    }

    const connection = await mongoose.connect(dbUrl);

    if (process.env.NODE_ENV !== "production") {
      global.db = connection;
    }

    console.log("Successfully connected to Shopify Routine Database.");
    return connection;
  } catch (error) {
    console.error("Error connecting to Shopify Routine Database:", error);
    process.exit(1);
  }
};

const db = connectToDatabase();

export default prisma;

export { db };
