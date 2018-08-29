import dotenv from "dotenv";

dotenv.config();

const ENV = process.env.NODE_ENV || "development";

const GOOGLE_ANALYTICS_ID = process.env.GOOGLE_ANALYTICS_ID || null;

const isDebug = ENV === "development";

export {
  ENV,
  GOOGLE_ANALYTICS_ID,
  isDebug
}