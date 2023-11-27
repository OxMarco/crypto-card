import React, { useState } from 'react';
import { Box, FormControl, FormLabel, Input, Button, VStack, SimpleGrid, Center, Slider, SliderTrack, SliderFilledTrack, SliderThumb } from '@chakra-ui/react';
import PaymentCard from '../../components/PaymentCard';
import AuthRootPage from './AuthRoot';

const CardSettingsPage = (card: any) => {
  const [dailyLimit, setDailyLimit] = useState(1000);
  const [monthlyLimit, setMonthlyLimit] = useState(5000);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log({ dailyLimit, monthlyLimit });
  };

  return (
    <AuthRootPage title="Card Details" back={true}>
      <Center py={6}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
          <Box>
            <PaymentCard cardHolderName="Lucas Stocazzo" cardNumber="4242424242424242" expiryMonth="11" expiryYear="23" />
          </Box>
          <VStack spacing={4} align="stretch">
            <form onSubmit={handleSubmit}>
              <FormControl id="daily-limit" mb={4}>
                <FormLabel>Daily Transaction Limit: {dailyLimit}</FormLabel>
                <Slider aria-label="daily-limit-slider" defaultValue={1000} min={1} max={5000} onChange={(val) => setDailyLimit(val)}>
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
              </FormControl>
              <FormControl id="monthly-limit" mb={4}>
                <FormLabel>Monthly Transaction Limit: {monthlyLimit}</FormLabel>
                <Slider aria-label="monthly-limit-slider" defaultValue={10000} min={1} max={50000} onChange={(val) => setMonthlyLimit(val)}>
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
              </FormControl>
              <Button type="submit" colorScheme="blue" variant="outline" w="full">Set Limits</Button>
            </form>
          </VStack>
        </SimpleGrid>
      </Center>
    </AuthRootPage>
  );
};

export default CardSettingsPage;

