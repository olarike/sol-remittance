import axios from 'axios';

export class BlockchainService {
  async getTransactionStatus(transactionId: string): Promise<string> {
    // Replace with actual API endpoint
    const response = await axios.get(`https://blockchain-api.com/transaction/${transactionId}/status`);
    return response.data.status; // 'completed', 'failed', etc.
  }
}
