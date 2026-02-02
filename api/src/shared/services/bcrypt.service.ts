import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Service } from '../decorators/service.decorator';
import { createHmac } from 'node:crypto';

@Service()
export class BcryptService {
  constructor(private readonly configService: ConfigService) {}

  private get rounds(): number {
    // FORCE CONVERSION: process.env returns a string, but bcrypt needs a number.
    const rounds = this.configService.get<string>('BCRYPT_SALT_ROUNDS');
    return Number.parseInt(rounds as string, 10) || 10; // Default to 10 if parsing fails
  }

  private get secret(): string {
    const secret = this.configService.get<string>('BCRYPT_SECRET', '');
    console.log("the secret used in bcrypt service is:", secret ? secret : '(none)');
    console.log("the secret is:", secret);
    return secret;
  }

    // Use a hash/HMAC to ensure the input to bcrypt is always < 72 chars
  private getPepperedPassword(password: string): string {
    const secret = this.configService.get<string>('BCRYPT_SECRET', '');
    const hmac =  createHmac('sha256', secret).update(password).digest('hex');
    console.log("Peppered password (HMAC):", hmac);
    return hmac;
  }

  async hashPassword(password: string): Promise<string> {
    const peppered = this.getPepperedPassword(password);
    const hash = await bcrypt.hash(peppered, this.rounds);
    console.log("Generated hash:", hash);
    return hash;
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    const peppered = this.getPepperedPassword(password);
    const isMatch = await bcrypt.compare(peppered, hash);
    console.log("Comparing password with hash:", { peppered, hash, isMatch });
    return isMatch;
  }

}