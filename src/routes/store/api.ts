import "../../auth/OIDCStrategy";
import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate";
import { addBook } from "./store-route";
import { body } from "express-validator";
import { validateBody } from "../../utils/validateBody";

export const storeRouter = Router();

storeRouter.post(
  "/",
  authenticate,
  body("title")
    .isString()
    .withMessage("Tytuł musi być tekstem|401")
    .isLength({ min: 5, max: 50 })
    .withMessage("Tytuł musi mieć przynajmniej 5 a maksymalnie 50 znaków|402"),
  body("price")
    .isNumeric()
    .withMessage("Cena musi być liczbą|403")
    .isFloat({ min: 5, max: 1000 })
    .withMessage("Cena musi być w przedziale od 5 do 1000|404"),
  body("class")
    .isIn([1, 2, 3, 4, 5])
    .withMessage("Klasa musi być jedną z wartości: 1, 2, 3, 4, 5|405")
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
      "Przedmiot musi być jedną z wartości: Matematyka, Polski, Angielski, Niemiecki, Historia, Biologia, Chemia, Fizyka, Geografia, WOS, Informatyka, Plastyka, Muzyka, Religia, WF, Technika, Przyroda, Inne|406"
    )
    .optional(),
  body("condition")
    .isInt({ min: 1, max: 4 })
    .withMessage("Stan musi być jedną z wartości: 1, 2, 3, 4|407"),
  validateBody,
  addBook
);
