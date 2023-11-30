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
} from '@chakra-ui/react';
import PaymentCard from '../../components/PaymentCard';
import AuthRootPage from './AuthRoot';
import { AppContext } from '../../context';

const CardSettingsPage = () => {
  const cardId = '65672eec595c1dc89f5271b5';
  const { accessToken } = useContext(AppContext);
  const [card, setCard] = useState<any>();
  const [dailyLimit, setDailyLimit] = useState<number>(1000);
  const [monthlyLimit, setMonthlyLimit] = useState<number>(5000);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`http://localhost:3000/card/get/${cardId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const card = await res.json();
      setCard(card);
      console.log('card', card);
    };

    if (accessToken) load();
  }, [accessToken]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log({ dailyLimit, monthlyLimit });
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
              <FormControl id="daily-limit" mb={4}>
                <FormLabel>Daily Transaction Limit: {dailyLimit}</FormLabel>
                <Slider
                  aria-label="daily-limit-slider"
                  defaultValue={1000}
                  min={1}
                  max={5000}
                  onChange={(val) => setDailyLimit(val)}
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
                  defaultValue={10000}
                  min={1}
                  max={50000}
                  onChange={(val) => setMonthlyLimit(val)}
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
