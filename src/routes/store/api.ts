import "../../auth/OIDCStrategy";
import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate";
import {
  addBook,
  getBook,
  getBooks,
  reserveBook,
  getMineBooks,
  deleteReservation,
} from "./store-route";
import { body, query } from "express-validator";
import { validateBody } from "../../utils/validateBody";
import { validateAttachments } from "../../utils/validateAttachments";
import { PrismaClient } from "@prisma/client";

export const storeRouter = Router();
const prisma = new PrismaClient();

storeRouter.post(
  "/",
  authenticate,
  validateAttachments(400, "image"),
  body("title")
    .isString()
    .withMessage("Tytuł musi być tekstem|408")
    .isLength({ min: 5, max: 50 })
    .withMessage("Tytuł musi mieć przynajmniej 5 a maksymalnie 50 znaków|409"),
  body("price")
    .toInt()
    .isNumeric()
    .withMessage("Cena musi być liczbą|410")
    .isFloat({ min: 5, max: 1000 })
    .withMessage("Cena musi być w przedziale od 5 do 1000|411"),
  body("class")
    .toInt()
    .isIn([1, 2, 3, 4, 5])
    .withMessage("Klasa musi być jedną z wartości: 1, 2, 3, 4, 5|412")
    .optional(),
  body("subject")
    .isIn([
      "Matematyka",
      "Polski",
      "Angielski",
      "Niemiecki",
      "Historia",
      "Biologia",
      "Chemia",
      "Fizyka",
      "Geografia",
      "WOS",
      "Informatyka",
      "Plastyka",
      "Muzyka",
      "Religia",
      "WF",
      "Technika",
      "Przyroda",
      "Inne",
    ])
    .withMessage(
      "Przedmiot musi być jedną z wartości: Matematyka, Polski, Angielski, Niemiecki, Historia, Biologia, Chemia, Fizyka, Geografia, WOS, Informatyka, Plastyka, Muzyka, Religia, WF, Technika, Przyroda, Inne|413"
    )
    .optional(),
  body("condition")
    .toInt()
    .isInt({ min: 1, max: 4 })
    .withMessage("Stan musi być jedną z wartości: 1, 2, 3, 4|414"),
  validateBody,
  addBook
);
storeRouter.post(
  "/reservation",
  authenticate,
  body("id")
    .isUUID()
    .withMessage("Nieodpowiednie ID książki|415")
    .custom((value) => {
      return !!prisma.books.findFirst({
        where: {
          id: value,
        },
      });
    })
    .withMessage("Taka książka nie istnieje|416"),
  validateBody,
  reserveBook
);

storeRouter.get("/", authenticate, getBooks);
storeRouter.get("/mine", authenticate, getMineBooks);
storeRouter.get(
  "/:id",
  authenticate,
  query("id").isUUID().withMessage("Nieodpowiednie ID książki|417"),
  getBook
);
storeRouter.delete("/reservation/:id", authenticate, deleteReservation);
