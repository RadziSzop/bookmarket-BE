import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user as number;
    const { name, phone_number } = await prisma.profile.findUnique({
      where: {
        userId: user,
      },
    });
    console.log({ user });

    res.json(user);
  } catch (error) {
    console.log("get profile error", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      errorCode: 199,
    });
  }
};
