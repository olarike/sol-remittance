import axios from 'axios';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes cache

const provider1Url = process.env.EXCHANGE_API_PROVIDER_1_URL;
const provider2Url = process.env.EXCHANGE_API_PROVIDER_2_URL;

if (!provider1Url) {
  throw new Error('EXCHANGE_API_PROVIDER_1_URL is not defined');
}

if (!provider2Url) {
  throw new Error('EXCHANGE_API_PROVIDER_2_URL is not defined');
}

const fetchExchangeRatesFromProvider1 = async () => {
  const response = await axios.get(provider1Url);
  return response.data.rates;
};

const fetchExchangeRatesFromProvider2 = async () => {
  const response = await axios.get(provider2Url);
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
    if (error instanceof Error) {
      console.error('Error fetching rates from provider 1:', error.message);
    } else {
      console.error('Unknown error fetching rates from provider 1');
    }

    try {
      const rates = await fetchExchangeRatesFromProvider2();
      cache.set('exchangeRates', rates);
      return rates;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching rates from provider 2:', error.message);
      } else {
        console.error('Unknown error fetching rates from provider 2');
      }
      throw new Error('Failed to fetch exchange rates from all providers');
    }
  }
};
