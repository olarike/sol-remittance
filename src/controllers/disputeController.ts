import { Request, Response, NextFunction } from 'express';
import { User } from '../entities/User';
import { Dispute } from '../entities/Dispute';
import { NotificationService } from '../services/notificationService';

const notificationService = new NotificationService();

export class DisputeController {
  async raiseDispute(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user as User;
      const { transactionId, reason } = req.body;

      const dispute = Dispute.create({
        user,
        transactionId,
        reason,
        status: 'open',
      });

      await dispute.save();

      await notificationService.sendEmail(
        'support@example.com',
        'New Dispute Raised',
        `User ${user.email} has raised a dispute for transaction ${transactionId}. Reason: ${reason}`
      );

      res.json({ message: 'Dispute raised successfully' });
    } catch (error) {
      next(error);
    }
  }

  async handleDispute(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { disputeId, action } = req.body;

      const dispute = await Dispute.findOne({ where: { id: disputeId } });

      if (!dispute) {
        throw new Error('Dispute not found');
      }

      dispute.status = action;
      await dispute.save();

      const user = await User.findOne({ where: { id: dispute.user.id } });

      if (!user) {
        throw new Error('User not found');
      }

      await notificationService.sendEmail(
        user.email,
        'Dispute Update',
        `Your dispute for transaction ${dispute.transactionId} has been ${action}.`
      );

      res.json({ message: 'Dispute handled successfully' });
    } catch (error) {
      next(error);
    }
  }
}
