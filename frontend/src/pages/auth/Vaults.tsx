import {
  Avatar,
  Card,
  CardBody,
  HStack,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import AuthRootPage from './AuthRoot';
import vaults from '../../data/vaults.json';

const VaultsPage = () => {
  return (
    <AuthRootPage title="Vaults">
      <SimpleGrid my={'2'} columns={2} gap={{ base: '5', md: '6' }}>
        {vaults.vaults.map((vault: any, index: number) => (
          <Card key={index} as="a" href={`/vaults/${vault.chainSlug}`}>
            <CardBody>
              <HStack justify={'space-between'}>
                <Avatar
                  size={'sm'}
                  src={`https://icons.llamao.fi/icons/chains/rsz_${vault.chainSlug}.jpg`}
                />
                <Text>{vault.chainSlug}</Text>
              </HStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </AuthRootPage>
  );
};

export default VaultsPage;
