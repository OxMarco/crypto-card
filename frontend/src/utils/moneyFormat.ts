export const formatNumber = (amount: bigint, decimals: bigint) => {
  return (amount / 10n ** decimals).toString();
};
