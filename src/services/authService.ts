import { User } from '../entities/User';
import * as jwt from 'jsonwebtoken';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import { HttpException } from '../middleware/errorMiddleware';

export class AuthService {
  async register(email: string, password: string): Promise<User> {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new HttpException(400, 'User already exists');
    }

    const user = User.create({ email, password });
    await user.save();
    return user;
  }

  async login(email: string, password: string): Promise<string> {
    const user = await User.findOne({ where: { email } });
    if (user && await user.validatePassword(password)) {
      if (user.isTwoFactorEnabled) {
        throw new HttpException(403, '2FA required');
      }
      return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    }
    throw new HttpException(400, 'Invalid credentials');
  }

  async generateTwoFactorSecret(user: User): Promise<string> {
    const secret = speakeasy.generateSecret({ name: 'YourAppName' });
    user.twoFactorSecret = secret.base32;
    await user.save();

    const otpauthUrl = secret.otpauth_url;
    if (!otpauthUrl) {
      throw new HttpException(500, 'Error generating OTP auth URL');
    }

    return new Promise<string>((resolve, reject) => {
      qrcode.toDataURL(otpauthUrl, (err, data_url) => {
        if (err) {
          reject(new HttpException(500, 'Error generating QR code'));
        } else {
          resolve(data_url);
        }
      });
    });
  }

  async verifyTwoFactorToken(user: User, token: string): Promise<boolean> {
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret!,
      encoding: 'base32',
      token,
    });

    if (verified) {
      user.isTwoFactorEnabled = true;
      await user.save();
    }

    return verified;
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      throw new HttpException(401, 'Invalid token');
    }
  }
}
