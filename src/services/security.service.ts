import { injectable } from 'inversify';
import bcrypt from 'bcrypt';
import { logger } from '../utils/logger';

@injectable()
export class SecurityService {
  private saltRounds: number = 10;

  public async encrypt(password: string): Promise<string | void> {
    let salt, hash;
    try {
      salt = await bcrypt.genSalt(this.saltRounds);
      hash = await bcrypt.hash(password, salt);
    } catch (error) {
      logger.error(error);
    }
    if (hash) return hash;
  }
  
  public decrypt(encryptedPassword: string): string {
    return '';
  }
}
