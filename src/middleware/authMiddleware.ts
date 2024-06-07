import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { HttpException } from './errorMiddleware';
import { User } from '../entities/User';

const authService = new AuthService();

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(new HttpException(401, 'No token provided'));
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return next(new HttpException(401, 'No token provided'));
  }

  try {
    const decoded = authService.verifyToken(token);
    const user = await User.findOne({ where: { id: decoded.id } });
    if (!user) {
      return next(new HttpException(401, 'Invalid token'));
    }
    req.user = user; // Assign the user to the request object
    next();
  } catch (error) {
    next(new HttpException(401, 'Invalid token'));
  }
};

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return next(new HttpException(403, 'Access denied'));
  }
  next();
};
