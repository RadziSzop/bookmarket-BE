import { NextFunction, Request, Response } from "express";
import { FieldValidationError, validationResult } from "express-validator";
export const validateBody = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = validationResult(req)
    .array({ onlyFirstError: false })
    .map((err: FieldValidationError) => ({
      message: err.msg.split("|")[0],
      code: Number(err.msg.split("|")[1]) || 1,
      param: err.path,
    }));
  if (result.length > 0) {
    return res.status(400).json({
      success: false,
      errors: result,
    });
  }
  next();
};
