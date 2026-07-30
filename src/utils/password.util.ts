import bcrypt from 'bcrypt';
import { CONSTANTS } from '../config/constants';

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, CONSTANTS.BCRYPT_COST);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
