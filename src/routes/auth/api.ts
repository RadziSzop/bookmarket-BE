import "../../auth/OIDCStrategy";
import { Router, Request, Response } from "express";
import passport from "passport";
import { AzureLogin, refresh } from "./auth-route";
import { body } from "express-validator";
import { validateBody } from "../../utils/validateBody";

export const authRouter = Router();

authRouter.get(
  "/login",
  passport.authenticate("azuread-openidconnect", {
    failureRedirect: "/err",
    session: false,
  }),
  AzureLogin
);

authRouter.post(
  "/login/refresh",
  body("refreshToken").isJWT().withMessage("Invalid refresh token|314"),
  body("accessToken").isJWT().withMessage("Invalid access token|315"),
  validateBody,
  refresh
);
