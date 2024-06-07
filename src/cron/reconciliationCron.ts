import cron from 'node-cron';
import { ReconciliationController } from '../controllers/reconciliationController';

const reconciliationController = new ReconciliationController();

// Schedule the reconciliation to run every hour
cron.schedule('0 * * * *', async () => {
  try {
    await reconciliationController.periodicReconcile();
    console.log('Reconciliation completed successfully.');
  } catch (error) {
    console.error('Error during reconciliation:', error);
  }
});
