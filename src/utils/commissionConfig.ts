export const COMMISSION_RATES = {
  STANDARD: 0.05, // 5%
  PREMIUM: 0.03,  // 3%
  SPECIAL: 0.02   // 2%
} as const;

export const calculateCommission = (amount: number, rate: number): number => {
  return amount * rate;
};

export const formatCurrency = (amount: number): string => {
  return `${amount.toLocaleString()} FCFA`;
};