import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';
import {
  Box,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Stack,
  Select,
  Input,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import {
  useNetwork,
  useSwitchNetwork,
  useContractWrite,
  sepolia,
  useAccount,
  useWalletClient,
} from 'wagmi';
import { createPublicClient, http } from 'viem';
import AuthRootPage from './AuthRoot';
import vaults from '../../data/vaults.json';
import { vaultAbi } from '../../data/vaultAbi';
import { getUserBalance, getVaultBalance } from '../../utils/get-balances';
import { LoadingView } from '../../components/LoadingView';
import { formatNumber } from '../../utils/moneyFormat';

const VaultDetailPage = () => {
  const { chainSlug } = useParams();
  const { chain } = useNetwork();
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { switchNetwork } = useSwitchNetwork();
  const toast = useToast();
  const [vault, setVault] = useState<any>(null);
  const [tokenBalances, setTokenBalances] = useState<any>({});
  const [tokens, setTokens] = useState<any>([]);
  const [token, setToken] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isError, setError] = useState<boolean>(false);
  const [amount, setAmount] = useState<bigint>(0n);
  const [transactionLoader, setTransactionLoader] = useState<boolean>(false);
  const { write: deposit } = useContractWrite({
    account: address,
    address: vault?.address,
    abi: vaultAbi,
    functionName: 'deposit',
  });
  const { write: withdraw } = useContractWrite({
    account: address,
    address: vault?.address,
    abi: vaultAbi,
    functionName: 'withdraw',
  });
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(),
  });

  const getVaultData = (chainSlug: string) => {
    const vaultData = vaults.vaults.find(
      (vault) => vault.chainSlug === chainSlug,
    );
    if (!vaultData) {
      setError(true);
    } else {
      setVault(vaultData);
    }
  };

  useEffect(() => {
    if (!chainSlug || !chain) return;
    getVaultData(chainSlug);
  }, [chainSlug, chain]);

  useEffect(() => {
    const fetchVaultBalances = async () => {
      if (!address) return;

      setLoading(true);
      try {
        let totalBalances = [];
        for (const token of vault.tokens) {
          const balance = await getVaultBalance(
            publicClient,
            address as any,
            BigInt(vault.ccipChainId),
            token.address as any,
          );
          totalBalances.push({ ...token, balance });
        }

        setTokens(totalBalances);
        //setChartData(generateChartData(totalBalances));
        if (chainSlug !== chain?.name && switchNetwork)
          switchNetwork(vault.chainId);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (!vault || !isConnected) return;
    fetchVaultBalances();
  }, [vault, address, isConnected]);

  useEffect(() => {
    const fetchUserBalances = async () => {
      if (!address) return;

      try {
        let newBalances = { ...tokenBalances };
        for (const token of vault.tokens) {
          const balance = await getUserBalance(
            publicClient,
            address as any,
            token.address as any,
          );
          newBalances[token.address] = balance;
          setTokenBalances(newBalances);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (!vault || !isConnected) return;
    fetchUserBalances();
  }, [address, vault, isConnected]);

  const chartData = useMemo(() => {
    if (tokens.length == 0) return null;

    const labels = tokens.map((t: any) => t.symbol);
    const data = tokens.map((t: any) => {
      const balance = tokens.find((j: any) => j.address === t.address).balance;
      return (BigInt(balance) / BigInt(10 ** t.decimals)).toString();
    });
    const backgroundColors = [
      'rgba(54, 162, 235, 0.2)',
      'rgba(75, 192, 192, 0.2)',
    ];

    return {
      labels,
      datasets: [{ data, backgroundColor: backgroundColors }],
    };
  }, [tokenBalances, tokens]);

  const validateArgs = () => {
    if (amount <= 0) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid amount',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return false;
    }

    if (token === '') {
      toast({
        title: 'Invalid token',
        description: 'Please select a valid token',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return false;
    }

    return true;
  };

  const depositCall = async () => {
    if (!validateArgs() || !walletClient || !vault || vault.address === '')
      return;

    setTransactionLoader(true);
    try {
      const { request } = await publicClient.simulateContract({
        chain: sepolia,
        account: address,
        address: vault.address,
        abi: vaultAbi,
        functionName: 'deposit',
        args: [token as any, amount * 10n ** 18n],
      });

      const tx = await walletClient.writeContract(request);
      const transaction = await publicClient.waitForTransactionReceipt({
        hash: tx,
      });

      if (transaction.status === 'success') {
        toast({
          title: 'Transaction Successful',
          description: 'Your deposit was successful.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Transaction Failed',
          description: 'Your deposit did not go through.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
      setAmount(0n);
    } catch (error) {
      console.error('Transaction error:', error);
      toast({
        title: 'Transaction Error',
        description: 'There was an error processing your transaction.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    setTransactionLoader(false);
  };

  const withdrawCall = async () => {
    if (!validateArgs() || !walletClient || !vault || vault.address === '')
      return;

    setTransactionLoader(true);
    try {
      const { request } = await publicClient.simulateContract({
        chain: sepolia,
        account: address,
        address: vault.address,
        abi: vaultAbi,
        functionName: 'withdraw',
        args: [token as any, amount * 10n ** 18n],
      });

      const tx = await walletClient.writeContract(request);
      const transaction = await publicClient.waitForTransactionReceipt({
        hash: tx,
      });

      if (transaction.status === 'success') {
        toast({
          title: 'Transaction Successful',
          description: 'Your withdrawal request was successful.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Transaction Failed',
          description: 'Your withdrawal request did not go through.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
      setAmount(0n);
    } catch (error) {
      console.error('Transaction error:', error);
      toast({
        title: 'Transaction Error',
        description: 'There was an error processing your transaction.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    setTransactionLoader(false);
  };

  if (isLoading) {
    return <LoadingView />;
  }

  if (isError) {
    return (
      <AuthRootPage title="Vaults">
        <Box textAlign="center" py={5}>
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>Error fetching vault balances!</AlertTitle>
            <AlertDescription>
              Please reload the page or check your connection
            </AlertDescription>
          </Alert>
        </Box>
      </AuthRootPage>
    );
  }

  return (
    <AuthRootPage title={`${chainSlug?.toUpperCase()} Vault`} back={true}>
      <SimpleGrid columns={2} gap={{ base: '5', md: '6' }}>
        <Box>{chartData && <Doughnut id={'12'} data={chartData} />}</Box>
        <Box>
          <Card>
            <CardBody>
              <Tabs size="md" variant="enclosed">
                <TabList>
                  <Tab>Deposit</Tab>
                  <Tab>Withdraw</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <Stack>
                      {token !== '' && (
                        <Text>
                          Balance:{' '}
                          {formatNumber(BigInt(tokenBalances[token]), 18n)}
                        </Text>
                      )}
                      <Select
                        placeholder="Select token"
                        onChange={(e) => setToken(e.target.value)}
                        value={token}
                      >
                        {tokens.map((t: any, index: number) => (
                          <option key={index} value={t.address}>
                            {t.symbol}
                          </option>
                        ))}
                      </Select>
                      <Input
                        type="number"
                        min="1"
                        value={amount.toString()}
                        onChange={(e) => setAmount(BigInt(e.target.value))}
                      />
                      {transactionLoader ? (
                        <Button isDisabled={true}>
                          <Spinner />
                          &nbsp;Depositing
                        </Button>
                      ) : (
                        <Button onClick={() => depositCall()}>Deposit</Button>
                      )}
                    </Stack>
                  </TabPanel>
                  <TabPanel>
                    <Stack>
                      {token !== '' && (
                        <Text>
                          Balance:{' '}
                          {formatNumber(
                            BigInt(
                              tokens.find((t: any) => t.address === token)
                                .balance,
                            ),
                            18n,
                          )}
                        </Text>
                      )}
                      <Select
                        placeholder="Select token"
                        onChange={(e) => setToken(e.target.value)}
                        value={token}
                      >
                        {tokens.map((token: any, index: number) => (
                          <option key={index} value={token.address}>
                            {token.symbol}
                          </option>
                        ))}
                      </Select>
                      <Input
                        type="number"
                        min="1"
                        value={amount.toString()}
                        onChange={(e) => setAmount(BigInt(e.target.value))}
                      />
                      {transactionLoader ? (
                        <Button isDisabled={true}>
                          <Spinner />
                          &nbsp;Withdrawing
                        </Button>
                      ) : (
                        <Button onClick={() => withdrawCall()}>Withdraw</Button>
                      )}
                    </Stack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </CardBody>
          </Card>
        </Box>
      </SimpleGrid>
    </AuthRootPage>
  );
};

export default VaultDetailPage;
