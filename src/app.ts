import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import routes from "./routes";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    
    credentials: true,
  }),
);
app.use(cookieParser());

app.use(helmet());

app.use(compression());

app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", routes);
app.use(errorMiddleware);

export default app;
