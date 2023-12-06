import { Injectable } from '@nestjs/common';
import { createPublicClient, createWalletClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import { AccountantABI } from './accountant.abi';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Web3Service {
  private accountantAddress: string;
  private account: any;
  private publicClient: any;
  private privateClient: any;
  private eurToken: string;
  private usdToken: string;

  constructor(private configService: ConfigService) {
    const privateKey: any =
      configService.get<string>('WALLET_PRIVATE_KEY') || '';
    this.eurToken = configService.get<string>('EUR_TOKEN') || '';
    this.usdToken = configService.get<string>('USD_TOKEN') || '';
    this.accountantAddress =
      configService.get<string>('ACCOUNTANT_ADDRESS') || '';

    this.account = privateKeyToAccount(privateKey);
    this.publicClient = createPublicClient({
      chain: sepolia,
      transport: http(),
    });
    this.privateClient = createWalletClient({
      account: this.account,
      chain: sepolia,
      transport: http(),
    });
  }

  private _getToken(currency: 'eur' | 'usd') {
    if (currency === 'eur') return this.eurToken;
    else if (currency === 'usd') return this.usdToken;
    else throw new Error('Invalid currency');
  }

  async getBalance(user: string, currency: 'eur' | 'usd') {
    const token = this._getToken(currency);
    const balance = await this.publicClient.readContract({
      address: this.accountantAddress,
      abi: AccountantABI,
      functionName: 'checkBalance',
      args: [user, token],
    });

    return balance;
  }

  async acquireHold(user: string, currency: 'eur' | 'usd', amount: number) {
    const token = this._getToken(currency);
    const { request } = await this.publicClient.simulateContract({
      account: this.account,
      address: this.accountantAddress,
      abi: AccountantABI,
      functionName: 'acquireHold',
      args: [user, token, amount],
    });
    await this.privateClient.writeContract(request);
  }

  async releaseHold(user: string, currency: 'eur' | 'usd', amount: number) {
    const token = this._getToken(currency);
    const { request } = await this.publicClient.simulateContract({
      account: this.account,
      address: this.accountantAddress,
      abi: AccountantABI,
      functionName: 'releaseHold',
      args: [user, token, amount],
    });
    await this.privateClient.writeContract(request);
  }
}
