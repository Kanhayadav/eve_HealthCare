import dotenv from "dotenv";
dotenv.config();

export const jwt_key = process.env.JWT_SECERT as string;
