import jwt, { JwtPayload } from "jsonwebtoken";
import { Response, Request, NextFunction } from "express";
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const jwtSecret = process.env.JWT_SECRET;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, jwtSecret, (err, user: JwtPayload) => {
      if (err || user.tokenType !== "access") {
        return res.status(403).json({
          success: false,
          message: "Invalid token",
          errorCode: 101,
        });
      }
      req.user = user.id;
      next();
    });
  } else {
    res.status(403).json({
      success: false,
      message: "No token provided",
      errorCode: 102,
    });
  }
};
