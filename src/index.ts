import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import helmet from "helmet";
import authrouter from "./routes/auth";
import centrerouter from "./routes/centre";
import bookingrouter from "./routes/booking"
import cookieParser from "cookie-parser";
import paymentRouter from "./routes/payment";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";

dotenv.config();
const app = express();

app.use(helmet());
app.use(express.json());
app.use(
  cors({
    credentials: true,
  }),
);
app.use(cookieParser());

app.use("/api/v1/auth", authrouter);
app.use("/api/v1", centrerouter);
app.use("/api/v1", bookingrouter);
app.use("/api/v1", paymentRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("server running at: ", PORT);
});
