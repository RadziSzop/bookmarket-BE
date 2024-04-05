import { Request, Response } from "express";
import { add, compareAsc } from "date-fns";
import { Subject } from "@prisma/client";
import { checkReservations } from "../../utils/checkReservations";
import { prisma } from "../../shared/prisma";

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
    await checkReservations();
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
      where: {
        reserved: false,
      },
    });

    res.status(200).json({
      success: true,
      data: books,
    });
  } catch (error) {
    console.log("get books error", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      errorCode: 198,
    });
  }
};

export const getBook = async (req: Request, res: Response) => {
  try {
    const book = await prisma.books.findFirst({
      select: {
        class: true,
        condition: true,
        id: true,
        image: true,
        price: true,
        subject: true,
        title: true,
        reservation: true,
        reserved: true,
      },
      where: {
        id: req.params.id,
      },
    });
    if (!book)
      return res.status(404).json({
        success: false,
        message: "Book not found",
        errorCode: 192,
      });
    if (
      book.reserved &&
      compareAsc(book.reservation.reservationEnd, new Date()) === -1
    ) {
      const book = await prisma.books.update({
        where: {
          id: req.params.id,
        },
        data: {
          reserved: false,
        },
      });
      await prisma.reservations.delete({
        where: {
          bookId: req.params.id,
        },
      });
      res.status(200).json({
        success: true,
        data: book,
      });
    } else {
      res.status(200).json({
        success: true,
        data: book,
      });
    }
  } catch (error) {
    console.log("get book error", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      errorCode: 197,
    });
  }
};

export const reserveBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.body as {
      id: string;
    };
    const book = await prisma.books.findFirst({
      where: {
        id,
      },
    });
    if (!book)
      return res.status(400).json({
        success: false,
        message: "Book not found",
        errorCode: 191,
      });
    if (book.reserved) {
      return res.status(400).json({
        success: false,
        message: "Book is already reserved",
        errorCode: 190,
      });
    }
    await prisma.books.update({
      where: {
        id,
      },
      data: {
        reserved: true,
      },
    });
    const reservation = await prisma.reservations.create({
      data: {
        reservationEnd: add(new Date(), { days: 3 }),
        book: {
          connect: {
            id,
          },
        },
        user: {
          connect: {
            id: req.user as number,
          },
        },
      },
    });
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log("reserve book error", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      errorCode: 196,
    });
  }
};

export const getMineBooks = async (req: Request, res: Response) => {
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
        reservation: {
          select: {
            user: {
              select: {
                email: true,
                profile: {
                  select: {
                    extraContact: true,
                    name: true,
                  },
                },
              },
            },
            bookId: false,
            reservationEnd: true,
            userId: false,
            createdAt: false,
          },
        },
      },
      where: {
        userId: req.user as number,
      },
    });

    res.status(200).json({
      success: true,
      data: books,
    });
  } catch (error) {
    console.log("get books error", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      errorCode: 195,
    });
  }
};

export const deleteReservation = async (req: Request, res: Response) => {
  try {
    const bookId = req.params.id;
    const reservation = await prisma.reservations.findFirst({
      select: {
        userId: true,
        bookId: true,
      },
      where: {
        bookId,
      },
    });
    const book = await prisma.books.findFirst({
      select: { userId: true },
      where: {
        id: bookId,
      },
    });
    if (reservation.userId !== req.user || book.userId !== req.user) {
      return res.status(403).json({
        success: false,
        message: "Brak dostępu",
        errorCode: 193,
      });
    }
    await prisma.reservations.delete({
      where: {
        bookId,
      },
    });
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log("delete reservation error", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      errorCode: 194,
    });
  }
};
