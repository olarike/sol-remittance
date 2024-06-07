import { Request, Response, NextFunction } from 'express';
import { ReportingService } from '../services/reportingService';

const reportingService = new ReportingService();

export class ReportingController {
  async getTransactionReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const report = await reportingService.generateTransactionReport();
      res.json(report);
    } catch (error) {
      next(error);
    }
  }

  async getUserReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const report = await reportingService.generateUserReport();
      res.json(report);
    } catch (error) {
      next(error);
    }
  }
}
