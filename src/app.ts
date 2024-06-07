import 'reflect-metadata';
import { createConnection } from 'typeorm';
import express from 'express';
import dotenv from 'dotenv';
import config from './ormconfig';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';
import twoFactorRoutes from './routes/twoFactorRoutes';
import exchangeRateRoutes from './routes/exchangeRateRoutes';
import exchangeRoutes from './routes/exchangeRoutes';
import remittanceRoutes from './routes/remittanceRoutes';
import reconciliationRoutes from './routes/reconciliationRoutes';
import disputeRoutes from './routes/disputeRoutes';
import reportingRoutes from './routes/reportingRoutes';
import { errorMiddleware } from './middleware/errorMiddleware';
import swaggerSetup from './swagger'; // Import Swagger setup
import './cron/reconciliationCron'; // Import the cron job

dotenv.config();

const app = express();
app.use(express.json());

swaggerSetup(app); // Setup Swagger

app.use('/api', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/two-factor', twoFactorRoutes);
app.use('/api/exchange-rates', exchangeRateRoutes);
app.use('/api/exchange', exchangeRoutes);
app.use('/api/remittance', remittanceRoutes);
app.use('/api/reconciliation', reconciliationRoutes);
app.use('/api/dispute', disputeRoutes);
app.use('/api/reporting', reportingRoutes);
app.use(errorMiddleware);

createConnection(config).then(() => {
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
}).catch(error => console.log(error));
