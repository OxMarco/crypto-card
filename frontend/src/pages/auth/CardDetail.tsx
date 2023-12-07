import { Box, Button, Spinner, Text } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import AuthRootPage from './AuthRoot';
import { TransactionsTable } from '../../components/TransactionsTable';
import { AppContext } from '../../context';
import { useParams } from 'react-router-dom';
import api from '../../utils/axios.interceptor';
import { LoadingView } from '../../components/LoadingView';

interface ICardDetail {
  brand: string,
  cardId: string,
  cardholderId: string,
  currency: string,
  expMonth: string,
  expYear: string,
  last4: string,
  status: string,
  type: string,
  id: string
}

const CardDetailPage = () => {
  const { accessToken } = useContext(AppContext);
  const route = useParams()
  const [CardDetail, setCardDetail] = useState<ICardDetail>()

  useEffect( () => {
    load()
  }, [])

  const load = async () => {
    const res = await api.get(`/card/get/${route.id}`);
    setCardDetail(res.data)
  }

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
      {
        CardDetail ?
        <>
        <Box className="container">
        <Box className="card">
          <Box className="visa_logo">
            <img
              src={`https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/${CardDetail.brand === 'Visas' ?'visa' : 'mastercard'}.png`}
              alt=""
            />
          </Box>
          <Box className="visa_info">
            <img
              src="https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/chip.png"
              alt=""
            />
            <p>**** **** **** {CardDetail.last4}</p>
          </Box>
          <Box className="visa_crinfo">
            <p>{CardDetail.expMonth}/{CardDetail.expYear}</p>
            {/* <p>Daniel Lite</p> */}
          </Box>
        </Box>
      </Box>
      <TransactionsTable accessToken={accessToken} />
      </>
      : 
      <Box textAlign="center" py={5}>
        <Spinner />
        <Text>Loading card data...</Text>
      </Box>
      }
    </AuthRootPage>
  );
};

export default CardDetailPage;
