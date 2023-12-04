import {
  Box,
  Flex,
  Grid,
  GridItem,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue as mode,
} from '@chakra-ui/react';
import AuthRootPage from './AuthRoot';
import { UserProfile } from '../../components/UserProfile';
import { formatAmount } from '../../utils/moneyFormat';

const stats = [
  { title: 'Wallet Balance', value: 10000 },
  { title: 'Total Expenses', value: 1000 },
];

const DashboardPage = () => {
  return (
    <AuthRootPage title="Dashboard">
      <Box>
      <Flex direction={{ base: 'column', sm: 'row' }} align={'center'} gap={6} py={6} w='full'>
        <Box flex={1}>
          <UserProfile />
        </Box>
        <Flex w={{base: '100%', md: '50%'}} direction='column' gap={6} py={6}>
            {stats.map((stat: any, index: number) => (
              <Stat
                key={index}
                p={5}
                shadow="md"
                border="1px"
                borderColor={mode('gray.200', 'gray.700')}
                borderRadius="md"
                bg={mode('white', 'gray.700')}
              >
                <StatLabel>{stat.title}</StatLabel>
                <StatNumber fontWeight="700" fontSize="40px" color={ stat.value > 9000 ? 'green' : 'red' }>{formatAmount(stat.value)}</StatNumber>
              </Stat>
            ))}
          </Flex>
      </Flex>
      </Box>
    </AuthRootPage>
  );
};

export default DashboardPage;
