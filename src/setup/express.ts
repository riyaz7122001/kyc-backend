import express, { Application } from "express";
import { requestLogger } from "@utility/api";
import { FRONTEND_URL } from "./secrets";
import compression from "compression";
import cors from "cors";
import cookieParser from "cookie-parser";

const app: Application = express();

app.use(requestLogger);
app.use(express.json());
app.use(cookieParser());
app.use(compression());
app.use(cors({
    origin: [FRONTEND_URL!, "http://localhost:3000", "http://localhost:5173", "http://localhost:4173"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "x-csrf"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
}))

export default app;