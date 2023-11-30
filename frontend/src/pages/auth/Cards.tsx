import { useContext } from 'react';
import { Button, useDisclosure } from '@chakra-ui/react';
import { CardsTable } from '../../components/CardsTable';
import AuthRootPage from './AuthRoot';
import NewCardModal from '../../modals/NewCard';
import { AppContext } from '../../context';

const CardsPage = () => {
  const { accessToken } = useContext(AppContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <AuthRootPage
      title="Your Cards"
      button={
        <Button onClick={onOpen} colorScheme={'blue'}>
          Add Card
        </Button>
      }
    >
      <NewCardModal
        accessToken={accessToken}
        isOpen={isOpen}
        onClose={onClose}
      />
      <CardsTable accessToken={accessToken} />
    </AuthRootPage>
  );
};

export default CardsPage;
