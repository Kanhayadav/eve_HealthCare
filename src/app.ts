import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});
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
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/v1/auth", authrouter);
app.use("/api/v1", centrerouter);
app.use("/api/v1", bookingrouter);
app.use("/api/v1", paymentRouter);

export default app;