import { Request, Response } from "express";
import { generateTokens } from "../../utils/generateTokens";

export const AzureLogin = async (req: Request, res: Response) => {
  try {
    const tokens = generateTokens({ id: req.user });
    res.cookie("token", tokens);
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
