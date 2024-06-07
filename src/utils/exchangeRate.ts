import axios from 'axios';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes cache

const fetchExchangeRatesFromProvider1 = async () => {
  const response = await axios.get(process.env.EXCHANGE_API_PROVIDER_1_URL);
  return response.data.rates;
};

const fetchExchangeRatesFromProvider2 = async () => {
  const response = await axios.get(process.env.EXCHANGE_API_PROVIDER_2_URL);
  return response.data.rates;
};

export const getExchangeRates = async () => {
  const cachedRates = cache.get('exchangeRates');
  if (cachedRates) {
    return cachedRates;
  }

  try {
    const rates = await fetchExchangeRatesFromProvider1();
    cache.set('exchangeRates', rates);
    return rates;
  } catch (error) {
    console.error('Error fetching rates from provider 1:', error.message);

    try {
      const rates = await fetchExchangeRatesFromProvider2();
      cache.set('exchangeRates', rates);
      return rates;
    } catch (error) {
      console.error('Error fetching rates from provider 2:', error.message);
      throw new Error('Failed to fetch exchange rates from all providers');
    }
  }
};
