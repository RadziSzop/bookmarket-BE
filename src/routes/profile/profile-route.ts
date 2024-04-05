import { Request, Response } from "express";
import { prisma } from "../../shared/prisma";

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user as number;

    const { email, role, profile } = await prisma.user.findUnique({
      where: {
        id: user,
      },
      select: {
        email: true,
        role: true,
        profile: true,
      },
    });
    res.status(200).json({
      success: true,
      data: {
        email,
        role,
        profile,
      },
    });
  } catch (error) {
    console.log("get profile error", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      errorCode: 299,
    });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { extraContact } = req.body as {
      extraContact: {
        socialName: string;
        socialLink: string;
      }[];
    };
    const user = req.user as number;
    await prisma.profile.update({
      where: {
        userId: user,
      },
      data: {
        extraContact,
      },
    });
    res.status(201).json({ success: true });
  } catch (error) {
    console.log("get profile error", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      errorCode: 299,
    });
  }
};
