import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { User } from '../entities/User';
import { HttpException } from '../middleware/errorMiddleware';

const authService = new AuthService();

export class TwoFactorController {
  async generateTwoFactorSecret(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new HttpException(401, 'User not authenticated');
      }

      const user = await User.findOne({ where: { id: req.user.id } });
      if (!user) {
        throw new HttpException(404, 'User not found');
      }

      const qrCodeUrl = await authService.generateTwoFactorSecret(user);
      res.json({ qrCodeUrl });
    } catch (error) {
      next(error);
    }
  }

  async verifyTwoFactorToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new HttpException(401, 'User not authenticated');
      }

      const user = await User.findOne({ where: { id: req.user.id } });
      if (!user) {
        throw new HttpException(404, 'User not found');
      }

      const { token } = req.body;
      const verified = await authService.verifyTwoFactorToken(user, token);
      res.json({ verified });
    } catch (error) {
      next(error);
    }
  }
}
