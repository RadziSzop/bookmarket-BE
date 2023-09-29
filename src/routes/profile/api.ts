import "../../auth/OIDCStrategy";
import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate";
import { getProfile, updateProfile } from "./profile-route";
import { body } from "express-validator";
import { validateBody } from "../../utils/validateBody";

export const profileRouter = Router();

profileRouter.get("/", authenticate, getProfile);
profileRouter.put(
  "/",
  authenticate,
  body("phoneNumber")
    .isMobilePhone("any")
    .withMessage("Niepoprawny numer telefonu|201"),
  body("contactEmail").isEmail().withMessage("Niepoprawny adres email|202"),
  validateBody,
  updateProfile
);
