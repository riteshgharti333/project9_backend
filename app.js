import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";

import ErrorHandler from "./utils/errorHandler.js";

import { errorMiddleware } from "./middlewares/error.js";
import authRouter from "./routes/authRoute.js";
import companyCardRouter from "./routes/companyCardRoute.js";
import partnerCardRouter from "./routes/partnerCardRoute.js";
import reviewRouter from "./routes/reviewRoute.js";
import contactRouter from "./routes/contactRoute.js";
import projectRouter from "./routes/projectRoute.js";
import serviceRouter from "./routes/serviceRoute.js";

// Initialize Express app
export const app = express();

app.use(helmet());
app.use(mongoSanitize());

// Load environment variables
config({
  path: "./data/config.env",
});

// Configure CORS settings
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5174",
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
];

// Configure CORS
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`Blocked by CORS: ${origin}`);
        callback(new ErrorHandler("Not allowed by CORS", 403));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/adminbackend/api/auth", authRouter);
app.use("/adminbackend/api/company-card", companyCardRouter);
app.use("/adminbackend/api/partner-card", partnerCardRouter);
app.use("/adminbackend/api/review", reviewRouter);
app.use("/adminbackend/api/contact", contactRouter);
app.use("/adminbackend/api/project", projectRouter);
app.use("/adminbackend/api/service", serviceRouter);

app.get("/adminbackend", (req, res) => {
  res.send("Welcome to Backend");
});

// Error Middleware
app.use(errorMiddleware);
