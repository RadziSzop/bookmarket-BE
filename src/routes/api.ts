import { Router } from "express";
import { test } from "./test-route";
export const testRouter = Router();
testRouter.get("/", test);
