import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import CoinGecko from 'coingecko-api';
import axios from 'axios';
import { linearRegression } from 'simple-statistics';
import { isDateWithinRange, isNumberWithinRange } from 'src/helpers';

export type Address = string;

export enum QuoteCurrency {
  EUR = 'EUR',
  USD = 'USD',
  GBP = 'GBP',
}

export type TransactionBase = {
  block_signed_at: string;
  tx_hash: string;
};

export enum TransferType {
  IN = 'IN',
  OUT = 'OUT',
}

export type Transfer = {
  transfer_type: TransferType;
  from_address: Address;
  from_address_label?: string;
  to_address: Address;
  to_address_label?: string;
  delta: string;
  balance?: number;
  balance_quote?: number;
  delta_quote?: number;
  quote_rate?: number;
} & TransactionBase;

export type TransactionExtended = {
  block_height: number;
  successful: boolean;
  value: string;
  value_quote: number;
  from_address: Address;
  from_address_label?: string;
  to_address: Address;
  to_address_label?: string;
  transfers: Transfer[];
} & TransactionBase;

export type Summary = {
  total_count: number;
  earliest_transaction: TransactionBase;
  latest_transaction: TransactionBase;
};

export type TransactionsSummary = {
  items: Summary[];
};

export type Erc20Transfers = {
  items: TransactionExtended[];
};

export type Value = {
  balance: string;
  quote: number;
  pretty_quote: string;
};

export type TokenHoldingValue = {
  quote_rate: number;
  timestamp: number;
  close: Value;
  high: Value;
  low: Value;
  open: Value;
};

export type Token = {
  contract_decimals: number;
  contract_name: string;
  contract_ticker_symbol: string;
  contract_address: Address;
  logo_url: string;
  holdings: TokenHoldingValue[];
};

export type Chain = {
  chainName: string;
  chainId: number;
  tokens: Token[];
};

export type HistoricalPortfolioBalance = {
  items: Token[];
};

@Injectable()
export class ScorerService {
  private coinGeckoClient: any;
  private covalentApiKey: string;
  private covalentUrl: string;
  private chainalysisUrl: string;
  private chainalysisApiKey: string;

  constructor(private configService: ConfigService) {
    this.coinGeckoClient = new CoinGecko();
    this.covalentApiKey = configService.get<string>('COVALENT_API_KEY') || '';
    this.covalentUrl = configService.get<string>('COVALENT_URL') || '';
    this.chainalysisUrl = configService.get<string>('CHAINALYSIS_URL') || '';
    this.chainalysisApiKey =
      configService.get<string>('CHAINALYSIS_API_KEY') || '';
  }

  async getBlockHeight(chainName: string, date: Date): Promise<number> {
    const formattedStartDate = date.toISOString().split('T')[0]; // Extracts "YYYY-MM-DD" date format
    const endDateTime = new Date(date);
    endDateTime.setDate(endDateTime.getDate() + 1); // Add one day to the date
    const formattedEndDate = endDateTime.toISOString().split('T')[0]; // Extracts "YYYY-MM-DD" date format

    const url = `${this.covalentUrl}/${chainName}/block_v2/${formattedStartDate}/${formattedEndDate}/`;
    const response = await axios.get(url, {
      params: { key: this.covalentApiKey },
      timeout: 10000,
    });
    return response.data.data.items[0].height;
  }

  async getWalletAge(
    chainName: string,
    AddressAddress: string,
  ): Promise<TransactionsSummary> {
    const url = `${this.covalentUrl}/${chainName}/address/${AddressAddress}/transactions_summary/`;
    const response = await axios.get(url, {
      params: { key: this.covalentApiKey },
      timeout: 10000,
    });
    return response.data.data;
  }

  async getERC20Transfers(
    chainName: string,
    AddressAddress: string,
    tokenAddress: string,
    startBlock: number,
    endBlock: number,
    quoteCurrency: QuoteCurrency,
  ): Promise<Erc20Transfers> {
    const url = `${this.covalentUrl}/${chainName}/address/${AddressAddress}/transfers_v2/`;
    const response = await axios.get(url, {
      params: {
        key: this.covalentApiKey,
        'quote-currency': quoteCurrency,
        'contract-address': tokenAddress,
        'starting-block': startBlock,
        'ending-block': endBlock,
      },
      timeout: 60000,
    });
    return response.data.data;
  }

  async getPortfolioValueOverTime(
    chainName: string,
    AddressAddress: string,
    days: number,
    quoteCurrency: QuoteCurrency,
  ): Promise<HistoricalPortfolioBalance> {
    const url = `${this.covalentUrl}/${chainName}/address/${AddressAddress}/portfolio_v2/`;
    const response = await axios.get(url, {
      params: {
        key: this.covalentApiKey,
        'quote-currency': quoteCurrency,
        days,
      },
      timeout: 60000,
    });
    return response.data.data;
  }

  async isWalletSanctioned(address: string): Promise<boolean> {
    const url = `${this.chainalysisUrl}/address/${address}`;
    const response = await axios.get(url, {
      headers: {
        'X-API-Key': this.chainalysisApiKey,
        Accept: 'application/json',
      },
      timeout: 10000,
    });
    return response.data.identifications.length !== 0;
  }

  async getPrice(slug: string, currency: QuoteCurrency): Promise<number> {
    const params = {
      tickers: false,
      developer_data: false,
      localization: false,
      market_data: true,
    };
    const data: any = await this.coinGeckoClient.coins.fetch(slug, params);

    return (
      data['data']['market_data']['current_price'][currency.toLowerCase()] || 0
    );
  }

  async analysePortfolioTrend(
    chainName: string,
    walletAddress: string,
    days: number,
    quoteCurrency: QuoteCurrency,
  ): Promise<{
    trend: 'increasing' | 'decreasing' | 'neutral';
    endValueProjected: number;
    percentageChange: number;
  }> {
    // Fetch the portfolio value over the last 30 days
    const historicalData = await this.getPortfolioValueOverTime(
      chainName,
      walletAddress,
      days,
      quoteCurrency,
    );

    // Prepare the data for linear regression
    const dataForRegression = historicalData.items.map((token, index) => {
      // Assuming `quote` gives the USD value of the token
      const totalValue = token.holdings.reduce(
        (acc, holding) => acc + holding.close.quote,
        0,
      );
      return [index, totalValue]; // [day, totalValue]
    });

    const regressionLine = linearRegression(dataForRegression);

    // Calculate the percentage change using the slope of the regression line
    const startValue = dataForRegression[0][1];
    const endValueProjected = startValue + regressionLine.m * (days - 1); // using y = mx + c, for the last day
    const percentageChange =
      ((endValueProjected - startValue) / startValue) * 100;

    // Determine the trend
    let trend: 'increasing' | 'decreasing' | 'neutral';
    if (regressionLine.m > 0) {
      trend = 'increasing';
    } else if (regressionLine.m < 0) {
      trend = 'decreasing';
    } else {
      trend = 'neutral';
    }

    return { trend, endValueProjected, percentageChange };
  }

  async analyseRecurrentTransfers(
    chainName: string,
    walletAddress: Address,
    days: number,
    tokenAddress: Address,
  ) {
    const currentDate = new Date();
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(currentDate.getDate() - days);
    const startBlock = await this.getBlockHeight(
      chainName as string,
      ninetyDaysAgo,
    ); // Using the function from your code
    const endBlock = await this.getBlockHeight(
      chainName as string,
      currentDate,
    ); // Using the function from your code
    const transactions = await this.getERC20Transfers(
      chainName as string,
      walletAddress as string,
      tokenAddress,
      startBlock,
      endBlock,
      QuoteCurrency.EUR,
    );
    const incoming: Transfer[] = [];
    const outgoing: Transfer[] = [];
    const incomingBySender: { [address: string]: Transfer[] } = {};
    const outgoingBySender: { [address: string]: Transfer[] } = {};

    for (const transaction of transactions.items) {
      const transfer = transaction.transfers[0];
      if (transfer.transfer_type === TransferType.IN) {
        incoming.push(transfer);
        if (!incomingBySender[transfer.from_address]) {
          incomingBySender[transfer.from_address] = [];
        }
        incomingBySender[transfer.from_address].push(transfer);
      } else {
        outgoing.push(transfer);
        if (!outgoingBySender[transfer.to_address]) {
          outgoingBySender[transfer.to_address] = [];
        }
        outgoingBySender[transfer.to_address].push(transfer);
      }
    }

    const recurringTransactions: Transfer[] = [];

    // Sort transactions by date
    incoming.sort(
      (a, b) =>
        new Date(a.block_signed_at).getTime() -
        new Date(b.block_signed_at).getTime(),
    );

    for (let i = 1; i < incoming.length; i++) {
      const currentTx = incoming[i];
      const previousTx = incoming[i - 1];

      const currentDate = new Date(currentTx.block_signed_at);
      const previousDate = new Date(previousTx.block_signed_at);

      const intervalInDays =
        (currentDate.getTime() - previousDate.getTime()) / (24 * 3600 * 1000);

      if (
        isDateWithinRange(previousDate, currentDate, intervalInDays) &&
        isNumberWithinRange(previousTx.delta, currentTx.delta)
      ) {
        recurringTransactions.push(currentTx);
      }
    }

    // TODO to be completed
  }

  async runScoringChecks(
    walletAddress: Address,
    chain: Chain,
    quoteCurrency: QuoteCurrency,
  ): Promise<number> {
    console.log(`******** Started analysis of ${walletAddress} ********`);
    let totalPoints = 0;

    // 1. Check if number of transactions is > 20
    const walletSummary = await this.getWalletAge(
      chain.chainName,
      walletAddress,
    );
    if (
      walletSummary.items === null ||
      walletSummary.items[0].total_count <= 20
    ) {
      console.log('too few transactions');
    }

    // 2. Check if the wallet is at least 90 days old
    const walletCreationDate = new Date(
      walletSummary.items[0].earliest_transaction.block_signed_at,
    );
    const currentDate = new Date();
    const ageInDays =
      (currentDate.getTime() - walletCreationDate.getTime()) /
      (1000 * 3600 * 24);
    if (ageInDays < 90) {
      console.log('too fresh wallet');
    }

    // 3. Check if the latest transaction is at max 30 days old
    const latestTransactionDate = new Date(
      walletSummary.items[0].latest_transaction.block_signed_at,
    );
    const daysSinceLastTransaction =
      (currentDate.getTime() - latestTransactionDate.getTime()) /
      (1000 * 3600 * 24);
    if (daysSinceLastTransaction > 30) {
      console.log('idle wallet');
    }

    // 4. Check if the wallet has a positive balance trend in the last 90 days
    console.log(
      'Check if the wallet has a positive balance trend in the last 90 days',
    );
    const { trend, endValueProjected, percentageChange } =
      await this.analysePortfolioTrend(
        chain.chainName,
        walletAddress,
        90,
        quoteCurrency,
      );
    console.log('trend', trend);
    console.log('percentageChange', percentageChange);

    // 5. Check if the wallet has received recurrent transfers (a salary) in the last 90 days
    for (const token of chain.tokens) {
      console.log(
        'Check if the wallet has received recurrent transfers (a salary) in the last 90 days for token ' +
          token.contract_ticker_symbol,
      );
      await this.analyseRecurrentTransfers(
        chain.chainName,
        walletAddress,
        90,
        token.contract_address,
      );
    }

    console.log(`******** Completed analysis of ${walletAddress} ********`);

    // 6. Scoring
    if (walletSummary.items[0].total_count > 50) {
      totalPoints += 10;
    }

    if (ageInDays > 360) {
      totalPoints += 20;
    } else if (ageInDays > 180) {
      totalPoints += 10;
    }

    if (daysSinceLastTransaction < 30) {
      totalPoints += 20;
    } else if (daysSinceLastTransaction < 60) {
      totalPoints += 10;
    }

    if (trend === 'increasing') {
      totalPoints += 20;
    } else if (trend === 'decreasing') {
      totalPoints -= 10;
    }

    if (endValueProjected > 100000) {
      totalPoints += 30;
    } else if (endValueProjected > 10000) {
      totalPoints += 10;
    } else if (endValueProjected < 5000) {
      totalPoints -= 10;
    }

    return totalPoints;
  }
}
