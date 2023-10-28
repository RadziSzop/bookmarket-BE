import { Request, Response } from "express";
import { generateTokens } from "../../utils/generateTokens";
import jwt from "jsonwebtoken";
import { createHash } from "crypto";
export const AzureLogin = async (req: Request, res: Response) => {
  try {
    const tokens = generateTokens({ id: req.user });
    res.cookie("token", JSON.stringify(tokens), {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });
    console.log(tokens);
    res.redirect(process.env.CLIENT_URL);
  } catch (error) {
    console.log("azure login error", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      errorCode: 199,
    });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken, accessToken } = req.body as {
      refreshToken: string;
      accessToken: string;
    };
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        errors: [
          {
            message: "Refresh token is required",
            errorCode: 310,
          },
        ],
      });
    }
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.jwtSecret
      ) as jwt.JwtPayload;
      if (decoded.tokenType !== "REFRESH") {
        return res.status(400).json({
          success: false,
          errors: [
            {
              message: "Token refresh error",
              errorCode: 311,
            },
          ],
        });
      }
      if (
        createHash("sha512").update(accessToken).digest("hex") !==
        decoded.accessToken
      ) {
        return res.status(400).json({
          success: false,
          errors: [
            {
              message: "Token refresh errorn",
              errorCode: 312,
            },
          ],
        });
      }

      const tokens = generateTokens({ id: decoded.id });
      return res.status(200).json({
        success: true,
        data: {
          message: "Token refreshed successfully",
          token: tokens,
        },
      });
    } catch {
      return res.status(400).json({
        success: false,
        errors: [
          {
            message: "Token refresh error",
            errorCode: 313,
          },
        ],
      });
    }
  } catch (error) {
    console.log("refresh error", error);
    return res.status(500).json({
      success: false,
      errors: [
        {
          message: "Server error",
          errorCode: 399,
        },
      ],
    });
  }
};
