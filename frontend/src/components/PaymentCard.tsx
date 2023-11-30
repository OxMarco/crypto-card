import React from 'react';
import { Badge, Box, HStack, Text, useColorModeValue } from '@chakra-ui/react';

type VisaCardProps = {
  cardBrand: string;
  cardType: string;
  cardHolderName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
};

const PaymentCard: React.FC<VisaCardProps> = ({
  cardBrand,
  cardType,
  cardHolderName,
  cardNumber,
  expiryMonth,
  expiryYear,
}) => {
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
      <HStack justify={'space-between'}>
        <Text fontSize="xl" fontWeight="bold" mb="2">
          {cardBrand}
        </Text>
        <Badge>{cardType}</Badge>
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
