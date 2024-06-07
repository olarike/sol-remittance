import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';

export const validationMiddleware = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dto = Object.assign(new dtoClass(), req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      return res.status(400).json({ errors: errors.map((error: ValidationError) => error.constraints) });
    }
    next();
  };
};
