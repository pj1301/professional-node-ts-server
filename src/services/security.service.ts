import bcrypt from 'bcrypt';
import { injectable } from 'inversify';
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

  public checkPw(encryptedPassword: string, stringPw: string): Promise<boolean> {
    const evaluation = new Promise<boolean>((resolve, reject) => {
      bcrypt.compare(stringPw, encryptedPassword, (err, result) => {
        if (err) {
          logger.error(err);
          reject();
          return;
        }
        resolve(result);
      })
    });
    return evaluation;
  }
}
