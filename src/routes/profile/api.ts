import "../../auth/OIDCStrategy";
import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate";
import { getProfile } from "./profile-route";

export const profileRouter = Router();

profileRouter.get("/", authenticate, getProfile);
