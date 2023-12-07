import { erc20ABI } from 'wagmi';
import { accountantAbi } from '../data/accountantAbi';
import { accountant } from '../data/addresses';

export async function getVaultBalance(
  publicClient: any,
  address: `0x${string}`,
  ccipChainId: bigint,
  tokenAddress: `0x${string}`,
) {
  try {
    const data = await publicClient.readContract({
      address: accountant,
      abi: accountantAbi,
      functionName: 'balances',
      args: [address, ccipChainId, tokenAddress],
    });

    return data;
  } catch (e) {
    console.error(e);

    return 0n;
  }
}

export async function getUserBalance(
  publicClient: any,
  address: `0x${string}`,
  tokenAddress: `0x${string}`,
) {
  try {
    const data = await publicClient.readContract({
      address: tokenAddress,
      abi: erc20ABI,
      functionName: 'balanceOf',
      args: [address],
    });

    return data;
  } catch (e) {
    console.error(e);

    return 0n;
  }
}
