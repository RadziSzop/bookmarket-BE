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
  body("extraContact")
    .isArray({ min: 1, max: 5 })
    .withMessage("Niepoprawny format danych|203")
    .custom((value) => {
      value.forEach(({ socialLink, socialName }) => {
        if (typeof socialLink !== "string" || typeof socialName !== "string") {
          throw new Error("Niepoprawny format danych|204");
        }
        if (socialLink.length < 2 || socialName.length < 2) {
          throw new Error("Niepoprawny format danych|205");
        }
        if (socialLink.length > 64 || socialName.length > 64) {
          throw new Error("Niepoprawny format danych|206");
        }
      });
      return true;
    }),
  validateBody,
  updateProfile
);
