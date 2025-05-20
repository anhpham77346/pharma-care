import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Mã hóa mật khẩu
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * So sánh mật khẩu với hash đã lưu
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
} 