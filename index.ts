import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";
import dotenv from "dotenv";
const dotenvConfig = dotenv.config();
// import "./src/auth/OIDCStrategy";
import morgan from "morgan";
import cors from "cors";
import { CustomError } from "./src/shared/errors";
import { StatusCodes } from "http-status-codes";
// import { testRouter } from "./src/routes/api";
import { authRouter } from "./src/routes/auth/api";
import session from "express-session";
import { profileRouter } from "./src/routes/profile/api";
import { storeRouter } from "./src/routes/store/api";

if (dotenvConfig.error) {
  throw dotenvConfig.error;
}
const port = process.env.PORT;
const app = express();

// Middleware

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(
  session({
    secret: "process.env.SESSION_SECRET",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
app.use(express.static("public"));
// Routes
app.use("/", authRouter);
app.use("/profile", profileRouter);
app.use("/store", storeRouter);
// app.use("/", testRouter);

// Error handler

app.use(
  (err: Error | CustomError, _: Request, res: Response, next: NextFunction) => {
    console.log(err);
    const status =
      err instanceof CustomError ? err.HttpStatus : StatusCodes.BAD_REQUEST;
    return res.status(status).json({
      error: err instanceof CustomError ? err.message : "Server error",
    });
  }
);

app.listen(port, () => {
  console.log(`Server started successfully on port: ${port}!`);
});
