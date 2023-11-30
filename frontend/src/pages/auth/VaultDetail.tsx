import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';
import {
  Box,
  Spinner,
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
} from '@chakra-ui/react';
import { useNetwork, useSwitchNetwork, useContractWrite } from 'wagmi';
import AuthRootPage from './AuthRoot';
import vaults from '../../data/vaults.json';
import vaultABI from '../../data/vaultABI.json';

const VaultDetailPage = () => {
  const { chainSlug } = useParams();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const toast = useToast();
  const [vault, setVault] = useState<any>(null);
  const [tokens, setTokens] = useState<any>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isError, setError] = useState<boolean>(false);
  const [chartData, setChartData] = useState<any>(null);
  const [token, setToken] = useState<any>({});
  const [amount, setAmount] = useState<number>(0);
  const { write: deposit } = useContractWrite({
    address: vault?.address,
    abi: vaultABI,
    functionName: 'deposit',
  });
  const { write: withdraw } = useContractWrite({
    address: vault?.address,
    abi: vaultABI,
    functionName: 'withdraw',
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
      setLoading(true);
      try {
        let totalBalances = [];
        for (const token of vault.tokens) {
          totalBalances.push({ ...token, balance: 1 });
        }

        setTokens(totalBalances);
        setChartData(generateChartData(totalBalances));
        if (chainSlug !== chain?.name && switchNetwork)
          switchNetwork(vault.chainId);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (!vault) return;
    fetchVaultBalances();
  }, [vault]);

  const generateChartData = (balances: any[]) => {
    console.log(balances);
    const labels = balances.map((b) => b.symbol);
    const data = balances.map((b) => b.balance);
    const backgroundColors = [
      'rgba(54, 162, 235, 0.2)',
      'rgba(75, 192, 192, 0.2)',
    ];

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors,
        },
      ],
    };
  };

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

    if (token === null) {
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
    if (!validateArgs()) return;

    const tx = await deposit({ args: [token, amount] });
    console.log(tx);
    setAmount(0);
  };

  const withdrawCall = async () => {
    if (!validateArgs()) return;

    const tx = await withdraw({ args: [token, amount] });
    console.log(tx);
    setAmount(0);
  };

  if (isLoading) {
    return (
      <AuthRootPage title="Vaults">
        <Box textAlign="center" py={5}>
          <Spinner />
          <Text>Loading data...</Text>
        </Box>
      </AuthRootPage>
    );
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
        <Box>{chartData && <Doughnut data={chartData} />}</Box>
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
                        value={amount}
                        onChange={(e) => setAmount(parseInt(e.target.value))}
                      />
                      <Button onClick={() => depositCall()}>Deposit</Button>
                    </Stack>
                  </TabPanel>
                  <TabPanel>
                    <Stack>
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
                        value={amount}
                        onChange={(e) => setAmount(parseInt(e.target.value))}
                      />
                      <Button onClick={() => withdrawCall()}>Withdraw</Button>
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
