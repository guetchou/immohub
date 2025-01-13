export const COMMISSION_RATES = {
  STANDARD: 0.05, // 5% commission standard
  PREMIUM: 0.03, // 3% commission pour les propriétaires premium
  AGENCY: 0.07, // 7% commission pour les agences
};

export const calculateCommission = (amount: number, rate: number): number => {
  return amount * rate;
};

export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'XAF',
  });
};