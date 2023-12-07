import { useState, useEffect } from 'react';
import {
  Avatar,
  Card,
  CardBody,
  HStack,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import {
  useNetwork,
  useSwitchNetwork,
  useContractWrite,
  sepolia,
  useAccount,
} from 'wagmi';
import { createPublicClient, http } from 'viem';
import AuthRootPage from './AuthRoot';
import vaultsData from '../../data/vaults.json';
import { formatNumber } from '../../utils/moneyFormat';
import { getVaultBalance } from '../../utils/get-balances';
import { LoadingView } from '../../components/LoadingView';

const VaultsPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [vaults, setVaults] = useState<any>([]);
  const { address, isConnected } = useAccount();
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(),
  });

  useEffect(() => {
    const fetchBalances = async () => {
      setLoading(true);
      let aggregatedBalances: any = {};

      for (const vault of vaultsData.vaults) {
        aggregatedBalances[vault.address] = 0n;

        for (const token of vault.tokens) {
          const balance = await getVaultBalance(
            publicClient,
            address as any,
            BigInt(vault.ccipChainId),
            token.address as any,
          );
          console.log('balance', balance);
          aggregatedBalances[vault.address] += balance;
        }
      }

      const updatedVaults = vaultsData.vaults.map((vault: any) => ({
        ...vault,
        balance: aggregatedBalances[vault.address],
      }));

      setVaults(updatedVaults);
      setLoading(false);
    };

    if (address && isConnected) fetchBalances();
  }, [isConnected, address]);

  if (loading) {
    return <LoadingView />;
  }

  return (
    <AuthRootPage title="Vaults">
      <SimpleGrid my={'2'} columns={2} gap={{ base: '5', md: '6' }}>
        {vaults.map((vault: any, index: number) => (
          <Card key={index} as="a" href={`/vaults/${vault.chainSlug}`}>
            <CardBody>
              <HStack justify={'space-between'}>
                <VStack>
                  <Avatar
                    size={'sm'}
                    src={`https://icons.llamao.fi/icons/chains/rsz_${vault.chainSlug}.jpg`}
                  />
                  <Text textTransform="capitalize">{vault.chainSlug}</Text>
                </VStack>
                <Text fontWeight="700">{formatNumber(vault.balance, 18n)}</Text>
              </HStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </AuthRootPage>
  );
};

export default VaultsPage;
