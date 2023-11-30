import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  SimpleGrid,
  Stack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from '@chakra-ui/react';
import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';
import AuthRootPage from './AuthRoot';
import { AppContext } from '../../context';

const vault = {
  chain: 'arbitrum',
  address: '0x1234567890',
};

const data = {
  labels: ['USDC', 'EUROC'],
  datasets: [
    {
      data: [3250, 1210],
      backgroundColor: ['rgba(54, 162, 235, 0.2)', 'rgba(75, 192, 192, 0.2)'],
    },
  ],
};

const VaultDetailPage = () => {
  const { chain } = useParams();
  const { accessToken } = useContext(AppContext);

  return (
    <AuthRootPage title={`${chain} Vault`} back={true}>
      <SimpleGrid columns={2} gap={{ base: '5', md: '6' }}>
        <Box>
          <Doughnut data={data} />
        </Box>
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
                      <Select placeholder="Select token">
                        <option value="option1">USDC</option>
                        <option value="option2">EUROC</option>
                      </Select>
                      <Input />
                      <Button>Deposit</Button>
                    </Stack>
                  </TabPanel>
                  <TabPanel>
                    <Stack>
                      <Select placeholder="Select token">
                        <option value="option1">USDC</option>
                        <option value="option2">EUROC</option>
                      </Select>
                      <Input />
                      <Button>Withdraw</Button>
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
