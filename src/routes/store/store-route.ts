import { Request, Response } from "express";
import { PrismaClient, Subject } from "@prisma/client";
const prisma = new PrismaClient();

export const addBook = async (req: Request, res: Response) => {
  try {
    const {
      title,
      price,
      class: classNumber,
      subject,
      condition,
    } = req.body as {
      title: string;
      price: number;
      condition: number;
      class?: number;
      subject?: Subject;
    };
    const user = req.user as number;
    const book = await prisma.books.create({
      data: {
        image: req.file.filename,
        title,
        price,
        class: classNumber || null,
        condition: condition || null,
        subject: subject || null,
        user: {
          connect: {
            id: user,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
    });
  } catch (error) {
    console.log("get profile error", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      errorCode: 199,
    });
  }
};

export const getBooks = async (req: Request, res: Response) => {
  try {
    const books = await prisma.books.findMany({
      select: {
        class: true,
        condition: true,
        id: true,
        image: true,
        price: true,
        subject: true,
        title: true,
      },
    });

    res.status(200).json({
      success: true,
      data: books,
    });
  } catch (error) {
    console.log("get profile error", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      errorCode: 198,
    });
  }
};
