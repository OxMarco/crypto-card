import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

export const OfferModal = () => {
  const [open, setOpen] = useState<boolean>(false);
  const close = () => {
    setOpen(false);
    localStorage.setItem('offerModalClosed', 'true');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localStorage.getItem('offerModalClosed') !== 'true') {
        setOpen(true);
      }
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Modal isOpen={open} onClose={() => setOpen(false)} size="2xl">
      <ModalOverlay />
      <ModalContent borderRadius="2xl" mx="4">
        <ModalBody>
          <Stack
            maxW="xs"
            mx="auto"
            py={{ base: '12', md: '16' }}
            spacing={{ base: '6', md: '10' }}
          >
            <Stack spacing="3" textAlign="center">
              <Text fontSize="lg">Subscribe to our newsletter and get</Text>
              <Text
                color={useColorModeValue('blue.500', 'blue.200')}
                fontWeight="extrabold"
                fontSize={{ base: '5xl', md: '6xl' }}
                textTransform="uppercase"
                transform="scale(1.2)"
              >
                10% off
              </Text>
              <Text fontSize="lg">
                <Box as="span" whiteSpace="nowrap" fontWeight="bold">
                  on your crypto card
                </Box>{' '}
                and exclusive access to new perks
              </Text>
            </Stack>
            <Stack
              as="form"
              spacing="3"
              onSubmit={(e) => {
                e.preventDefault();
                // manage form submission
              }}
            >
              <FormControl id="email">
                <FormLabel srOnly>Enter your email</FormLabel>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  size="lg"
                  autoComplete="email"
                  fontSize="md"
                  focusBorderColor={useColorModeValue('blue.500', 'blue.200')}
                />
              </FormControl>
              <Button
                type="submit"
                fontWeight="bold"
                textTransform="uppercase"
                fontSize="md"
                colorScheme="blue"
                size="lg"
              >
                Get my 10% discount
              </Button>
            </Stack>
            <Button
              variant={'link'}
              fontSize="sm"
              textAlign="center"
              color={useColorModeValue('gray.600', 'gray.400')}
              textDecoration="underline"
              onClick={() => close()}
            >
              No, I don&apos;t want any discounts
            </Button>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
