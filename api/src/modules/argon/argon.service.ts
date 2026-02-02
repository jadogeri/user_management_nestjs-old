import * as argon2 from 'argon2';
import { Service } from 'src/shared/decorators/service.decorator';

@Service()
export class ArgonService {
  /**
   * Hashes a plaintext password using Argon2id.
   * @param password - The plaintext password to hash.
   * @returns A promise that resolves to the hashed password string.
   */
  async hashPassword(password: string): Promise<string> {
    // Argon2id is the default and recommended variant
    return await argon2.hash(password);
  }

  /**
   * Verifies a password attempt against a stored Argon2 hash.
   * @param storedHash - The hash retrieved from the database.
   * @param passwordAttempt - The plaintext password entered by the user.
   * @returns A promise that resolves to true if they match, false otherwise.
   */
  async verifyPassword(storedHash: string, passwordAttempt: string): Promise<boolean> {
    try {
      // The hash string contains the salt and parameters automatically
      return await argon2.verify(storedHash, passwordAttempt);
    } catch (err) {
      // Handle internal failure or invalid hash format
      return false;
    }
  }
}
