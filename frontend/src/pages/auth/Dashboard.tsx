import {
  Box,
  Flex,
  Heading,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue as mode,
} from '@chakra-ui/react';
import AuthRootPage from './AuthRoot';
import { UserProfile } from '../../components/UserProfile';
import Chart from 'chart.js/auto';
import { CategoryScale } from 'chart.js';
import ChartDataJson from '../../data/charts.json';
import { useState } from 'react';
import { Line } from 'react-chartjs-2';

const stats = [
  { title: 'Wallet Balance', value: 10000 },
  { title: 'Total Expenses', value: 1000 },
];

Chart.register(CategoryScale);

const DashboardPage = () => {
  const [chartData, setChartData] = useState({
    labels: ChartDataJson.data.map((data) => data.month),
    datasets: [
      {
        data: ChartDataJson.data.map((data) => data.spent),
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
        ],
        hoverOffset: 4,
        borderColor: 'black',
        borderWidth: 1,
        tension: 0.4,
        fill: true,
      },
    ],
  });

  return (
    <AuthRootPage title="Dashboard">
      <Box>
        <Flex
          direction={{ base: 'column', sm: 'row' }}
          align={'center'}
          gap={6}
          py={6}
          w="full"
        >
          <Box flex={1}>
            <UserProfile />
          </Box>
          <Flex
            w={{ base: '100%', md: '50%' }}
            direction="column"
            gap={6}
            py={6}
          >
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
                <StatNumber
                  color={stat.value > 9000 ? 'green' : 'red'}
                >
                  {stat.value}
                </StatNumber>
              </Stat>
            ))}
          </Flex>
        </Flex>

        <Stack shadow="md" direction="column">
          <Heading size="md">Monthly Expenses</Heading>
          <Box p="2" border="0.5px solid">
            <Line
              data={chartData}
              options={{
                plugins: {
                  title: {
                    display: false,
                  },
                  legend: {
                    display: false,
                  },
                },
              }}
            />
          </Box>
        </Stack>
      </Box>
    </AuthRootPage>
  );
};

export default DashboardPage;
