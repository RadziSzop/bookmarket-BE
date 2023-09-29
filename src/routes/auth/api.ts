import "../../auth/OIDCStrategy";
import { Router, Request, Response } from "express";
import passport from "passport";
import { AzureLogin } from "./auth-route";

export const authRouter = Router();

authRouter.get(
  "/login",
  passport.authenticate("azuread-openidconnect", {
    failureRedirect: "/err",
    session: false,
  }),
  AzureLogin
);
