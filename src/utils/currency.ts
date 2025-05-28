
export const formatKES = (amount: number) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES'
  }).format(amount);
};

export const convertUSDToKES = (usdAmount: number) => {
  // Approximate conversion rate (in real app, this would come from API)
  const exchangeRate = 150; // 1 USD = 150 KES approximately
  return usdAmount * exchangeRate;
};
