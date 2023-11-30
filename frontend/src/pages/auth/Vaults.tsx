import {
  Avatar,
  Card,
  CardBody,
  Grid,
  GridItem,
  HStack,
  Img,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import { useContext } from 'react';
import AuthRootPage from './AuthRoot';
import { AppContext } from '../../context';

const VaultsPage = () => {
  const { id, cardholderId, accessToken } = useContext(AppContext);

  const vaults = [
    { chain: 'ethereum', address: '0x123', balance: 1000 },
    { chain: 'arbitrum', address: '0x456', balance: 2400 },
    { chain: 'polygon', address: '0x789', balance: 392 },
    { chain: 'optimism', address: '0x789', balance: 0 },
  ];

  return (
    <AuthRootPage title="Vaults">
      <SimpleGrid columns={2} gap={{ base: '5', md: '6' }}>
        <>
          {vaults.map((vault, index) => (
            <Card key={index} as="a" href={`/vaults/${vault.chain}`}>
              <CardBody>
                <HStack justify={'space-between'}>
                  <Avatar
                    size={'sm'}
                    src={`https://icons.llamao.fi/icons/chains/rsz_${vault.chain}.jpg`}
                  />
                  <Text>${vault.balance}</Text>
                </HStack>
              </CardBody>
            </Card>
          ))}
        </>
      </SimpleGrid>
    </AuthRootPage>
  );
};

export default VaultsPage;
