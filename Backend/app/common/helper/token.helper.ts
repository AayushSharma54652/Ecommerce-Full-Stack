import jwt from "jsonwebtoken";
import { IUser } from "../../user/user.dto";
import { config } from "dotenv";

config();

interface TokenPayload {
  _id: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
}

export const generateTokens = (payload: TokenPayload) => {
  const { ...cleanedPayload } = payload;

  const accessToken = jwt.sign(cleanedPayload, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(cleanedPayload, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "1d",
  });

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): IUser | null => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as IUser;
    return decoded;
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token: string): IUser | null => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as IUser;
    return decoded;
  } catch (error) {
    return null;
  }
};

export const refreshAccessToken = (refreshToken: string): string | null => {
  const user = verifyRefreshToken(refreshToken);
  if (user) {
    return generateTokens(user).accessToken;
  }
  return null;
};
