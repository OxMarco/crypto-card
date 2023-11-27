import React from 'react';
import { Badge, Box, HStack, Spacer, Text, useColorModeValue } from '@chakra-ui/react';

type VisaCardProps = {
  cardHolderName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
};

const PaymentCard: React.FC<VisaCardProps> = ({ cardHolderName, cardNumber, expiryMonth, expiryYear }) => {
  const cardBg = useColorModeValue('blue.500', 'blue.300');

  return (
    <Box
      borderRadius="md"
      w="300px"
      h="185px"
      p="6"
      bg={cardBg}
      color="white"
      position="relative"
    >
      <HStack justify={"space-between"}>
        <Text fontSize="xl" fontWeight="bold" mb="2">
          VISA
        </Text>
        <Badge>Virtual</Badge>
      </HStack>
      <Box fontSize="sm">
        <Text>Number</Text>
        <Text fontWeight="bold" letterSpacing="wider">
          {cardNumber.match(/.{1,4}/g)?.join(' ') || cardNumber}
        </Text>
      </Box>
      <HStack spacing={8}>
        <Box mt="4" fontSize="sm">
          <Text>Card Holder</Text>
          <Text fontWeight="bold" letterSpacing="wider">
            {cardHolderName.toUpperCase()}
          </Text>
        </Box>
        <Box mt="2" fontSize="sm">
          <Text>Expires</Text>
          <Text fontWeight="bold" letterSpacing="wider">
            {expiryMonth}/{expiryYear}
          </Text>
        </Box>
      </HStack>
    </Box>
  );
};

export default PaymentCard;
