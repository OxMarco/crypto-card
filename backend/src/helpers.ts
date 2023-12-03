// Helper function to determine if two dates are within a range of +-10%
export function isDateWithinRange(
  baseDate: Date,
  compareDate: Date,
  interval: number,
): boolean {
  const lowerBound = interval * 0.9 * 24 * 3600 * 1000; // 90% of interval in milliseconds
  const upperBound = interval * 1.1 * 24 * 3600 * 1000; // 110% of interval in milliseconds
  const difference = compareDate.getTime() - baseDate.getTime();

  return difference >= lowerBound && difference <= upperBound;
}

// Helper function to determine if two values are within a range of +-10%
export function isNumberWithinRange(
  baseValue: string,
  compareValue: string,
): boolean {
  const base = parseFloat(baseValue);
  const compare = parseFloat(compareValue);

  return compare >= 0.9 * base && compare <= 1.1 * base;
}

export function truncateEthereumAddress(address: string): string {
  const prefixLength = 4; // Number of characters to keep after "0x" at the start
  const suffixLength = 4; // Number of characters to keep at the end

  if (address.length <= 2 + prefixLength + suffixLength) {
    return address;
  }

  const prefix = address.substr(0, 2 + prefixLength);
  const suffix = address.substr(-suffixLength);
  return `${prefix}...${suffix}`;
}
