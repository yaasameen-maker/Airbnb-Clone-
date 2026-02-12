import jwt from 'jsonwebtoken';
import config from '../config';
import prisma from '../config/database';
import { v4 as uuidv4 } from 'uuid';

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  } as any);
};

export const generateRefreshToken = async (userId: string): Promise<string> => {
  const token = jwt.sign({ userId, tokenId: uuidv4() }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  } as any);

  // Store refresh token in database
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  await prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  return token;
};

export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, config.jwt.secret) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
};

export const verifyRefreshToken = async (token: string): Promise<string> => {
  try {
    const decoded = jwt.verify(token, config.jwt.refreshSecret) as { userId: string };

    // Check if token exists in database and is not expired
    const storedToken = await prisma.refreshToken.findFirst({
      where: {
        token,
        userId: decoded.userId,
        expiresAt: {
          gte: new Date(),
        },
      },
    });

    if (!storedToken) {
      throw new Error('Invalid refresh token');
    }

    return decoded.userId;
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

export const revokeRefreshToken = async (token: string): Promise<void> => {
  await prisma.refreshToken.deleteMany({
    where: { token },
  });
};

export const revokeAllUserTokens = async (userId: string): Promise<void> => {
  await prisma.refreshToken.deleteMany({
    where: { userId },
  });
};
