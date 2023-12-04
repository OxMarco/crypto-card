import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Button,
  VStack,
  SimpleGrid,
  Center,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  useToast,
} from '@chakra-ui/react';
import AuthRootPage from './AuthRoot';
import PaymentCard from '../../components/PaymentCard';
import { AppContext } from '../../context';
import api from '../../utils/axios.interceptor';
import { handleResponse } from '../../utils/response-helper';

const CardSettingsPage = () => {
  const toast = useToast();
  const cardId = '65672eec595c1dc89f5271b5';
  const { accessToken } = useContext(AppContext);
  const [card, setCard] = useState<any>();
  const [singleTxLimit, setSingleTxLimit] = useState<number>(1000);
  const [monthlyLimit, setMonthlyLimit] = useState<number>(5000);

  useEffect(() => {
    const load = async () => {
      const res = await api.get(`http://localhost:3000/card/get/${cardId}`);
      const card = await res.data;
      setCard(card);
      console.log('card', card);
    };

    if (accessToken) load();
  }, [accessToken]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const res = await fetch(`http://localhost:3000/card/limits`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        cardId,
        monthlyLimit,
        singleTxLimit,
      }),
    });

    await handleResponse(
      res,
      toast,
      'Card limits successfully updated',
      'Failed to set new card limits',
    );
  };

  return (
    <AuthRootPage title="Card Details" back={true}>
      <Center py={6}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
          <Box>
            {card?.last4 && (
              <PaymentCard
                cardBrand={card.brand}
                cardType={card.type}
                cardHolderName="Lucas Stocazzo"
                cardNumber={card.last4}
                expiryMonth={card.expMonth}
                expiryYear={card.expYear}
              />
            )}
          </Box>
          <VStack spacing={4} align="stretch">
            <form onSubmit={handleSubmit}>
              <FormControl id="single-tx-limit" mb={4}>
                <FormLabel>Single Transaction Limit: {singleTxLimit}</FormLabel>
                <Slider
                  aria-label="single-tx-limit-slider"
                  min={1}
                  max={5000}
                  onChange={(val) => setSingleTxLimit(val)}
                  value={singleTxLimit}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
              </FormControl>
              <FormControl id="monthly-limit" mb={4}>
                <FormLabel>Monthly Transaction Limit: {monthlyLimit}</FormLabel>
                <Slider
                  aria-label="monthly-limit-slider"
                  min={1}
                  max={50000}
                  onChange={(val) => setMonthlyLimit(val)}
                  value={monthlyLimit}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
              </FormControl>
              <Button
                type="submit"
                colorScheme="blue"
                variant="outline"
                w="full"
              >
                Set Limits
              </Button>
            </form>
          </VStack>
        </SimpleGrid>
      </Center>
    </AuthRootPage>
  );
};

export default CardSettingsPage;
