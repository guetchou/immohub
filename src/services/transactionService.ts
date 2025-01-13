export interface Transaction {
  id: string;
  date: string;
  amount: number;
  commission: number;
  status: "pending" | "completed" | "failed";
  paymentMethod: string;
  reference: string;
  userId: string;
  propertyId: string;
}

class TransactionService {
  private transactions: Transaction[] = [];

  async createTransaction(transaction: Omit<Transaction, "id">): Promise<Transaction> {
    const newTransaction = {
      ...transaction,
      id: `TXN-${Date.now()}`,
    };
    
    this.transactions.push(newTransaction);
    return newTransaction;
  }

  async getTransactions(userId: string): Promise<Transaction[]> {
    return this.transactions.filter(t => t.userId === userId);
  }
}

export const transactionService = new TransactionService();