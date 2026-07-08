import mongoose from "mongoose";

export const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI as string);

    console.log("======================================");
    console.log("✅ MongoDB Connected Successfully");
    console.log(`📦 Database : ${conn.connection.name}`);
    console.log(`🌍 Host     : ${conn.connection.host}`);
    console.log("======================================");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed");
    console.error(error);
    process.exit(1);
  }
};