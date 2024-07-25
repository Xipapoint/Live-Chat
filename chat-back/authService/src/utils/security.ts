import crypto from 'crypto';
import bcrypt from 'bcrypt';

export class Security {
  // PUBLIC
  public static async hash(data: string): Promise<string> {
    const saltRounds = 10; // количество раундов хеширования
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(data, salt);
    return hash;
  }


  public static async generateRandomUUID() : Promise<string>{
    return await crypto.randomUUID();
  }
}
