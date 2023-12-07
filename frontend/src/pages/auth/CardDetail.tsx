import { Box, Button } from '@chakra-ui/react';
import { useContext } from 'react';
import AuthRootPage from './AuthRoot';
import { TransactionsTable } from '../../components/TransactionsTable';
import { AppContext } from '../../context';

const CardDetailPage = () => {
  const { accessToken } = useContext(AppContext);

  return (
    <AuthRootPage
      title="Card and Transactions Details"
      back={true}
      button={
        <Button as="a" href="/cards/settings" colorScheme={'blue'}>
          Edit Card
        </Button>
      }
    >
      <Box className="container">
        <Box className="card">
          <Box className="visa_logo">
            <img
              src="https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/visa.png"
              alt=""
            />
          </Box>
          <Box className="visa_info">
            <img
              src="https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/chip.png"
              alt=""
            />
            <p>1234 **** **** 0987</p>
          </Box>
          <Box className="visa_crinfo">
            <p>08/26</p>
            <p>Daniel Lite</p>
          </Box>
        </Box>
      </Box>
      <TransactionsTable accessToken={accessToken} />
    </AuthRootPage>
  );
};

export default CardDetailPage;
