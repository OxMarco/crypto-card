import {
  Avatar,
  Card,
  CardBody,
  HStack,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';
import AuthRootPage from './AuthRoot';
import vaults from '../../data/vaults.json';
import { formatAmount } from '../../utils/moneyFormat';

const VaultsPage = () => {
  return (
    <AuthRootPage title="Vaults">
      <SimpleGrid my={'2'} columns={2} gap={{ base: '5', md: '6' }}>
        {vaults.vaults.map((vault: any, index: number) => (
          <Card key={index} as="a" href={`/vaults/${vault.chainSlug}`}>
            <CardBody>
              <HStack justify={'space-between'}>
                <VStack>
                <Avatar
                  size={'sm'}
                  src={`https://icons.llamao.fi/icons/chains/rsz_${vault.chainSlug}.jpg`}
                />
                <Text textTransform='capitalize'>{vault.chainSlug}</Text>
                </VStack>
                <Text fontWeight="700">{formatAmount(vault.balance)}</Text>

              </HStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </AuthRootPage>
  );
};

export default VaultsPage;
