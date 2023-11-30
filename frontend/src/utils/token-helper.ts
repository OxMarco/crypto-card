export const convertBalance = (balance: number, decimals: number) => {
  // Implement conversion logic considering the token decimals
  return balance / Math.pow(10, decimals);
};
