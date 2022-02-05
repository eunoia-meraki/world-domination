import { User } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import { db } from './database/db';

type AuthUserId = Pick<User, 'id'>;

const BEARER = 'Bearer ';
const SECRET = process.env.SECRET || 'SECRET';

const generateJwtToken = (user: User): string => {
  return jwt.sign({ id: user.id }, SECRET);
};

const getAuthorizedUserAsync = async (
  authorization: string,
): Promise<User | null> => {
  if (!authorization) {
    return null;
  }

  const token = authorization.substring(BEARER.length, authorization.length);

  try {
    const { id } = jwt.verify(token, SECRET) as AuthUserId;
    return await db.user.findFirst({ where: { id } });
  } catch {
    return null;
  }
};

export { generateJwtToken, getAuthorizedUserAsync };
