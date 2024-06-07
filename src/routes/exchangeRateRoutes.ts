import { Router } from 'express';
import { getExchangeRates } from '../utils/exchangeRate';
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware';

const router = Router();

router.get('/rates', authenticate, authorizeAdmin, async (req, res, next) => {
  try {
    const rates = await getExchangeRates();
    res.json(rates);
  } catch (error) {
    next(error);
  }
});

export default router;
