import jwt from "jsonwebtoken";
import crypto from "crypto";
import { getUnixTime, add } from "date-fns";
const jwtSecret = process.env.JWT_SECRET;
enum tokenType {
  ACCESS = "access",
  REFRESH = "refresh",
}
export const generateTokens = (data: jwt.JwtPayload) => {
  const token = jwt.sign(
    { id: data.id, tokenType: tokenType.ACCESS },
    jwtSecret,
    { expiresIn: "4h" }
  );

  const refreshToken = jwt.sign(
    {
      id: data.id,
      tokenType: tokenType.REFRESH,
      accessToken: crypto.createHash("sha512").update(token).digest("hex"),
    },
    jwtSecret,
    { expiresIn: "7d" }
  );
  return {
    accessToken: {
      token: token,
      expireDate: getUnixTime(add(new Date(), { hours: 4 })) * 1000,
    },
    refreshToken: {
      token: refreshToken,
      expireDate: getUnixTime(add(new Date(), { days: 7 })) * 1000,
    },
  };
};
