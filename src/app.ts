import express from "express";
import cors from "cors";
import helmet from "helmet";
import limiter from "express-rate-limit";
import cookieParser from "cookie-parser";

import authrouter from "./routes/auth";
import centrerouter from "./routes/centre";
import bookingrouter from "./routes/booking";
import paymentRouter from "./routes/payment";

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cors({ credentials: true }));
app.use(cookieParser());
if (process.env.NODE_ENV !== "test") {
  app.use(limiter);
}
app.use("/api/v1/auth", authrouter);
app.use("/api/v1", centrerouter);
app.use("/api/v1", bookingrouter);
app.use("/api/v1", paymentRouter);

export default app;