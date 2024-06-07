import { NextApiRequest, NextApiResponse } from 'next';
import { getExchangeRates } from '../../utils/exchangeRate';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const rates = await getExchangeRates();
    res.status(200).json(rates);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
}
