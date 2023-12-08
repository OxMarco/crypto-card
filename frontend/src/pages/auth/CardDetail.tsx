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
      <TransactionsTable accessToken={accessToken} />
    </AuthRootPage>
  );
};

export default CardDetailPage;
