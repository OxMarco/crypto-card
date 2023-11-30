import { Stack, Box, Button, Container, Text } from '@chakra-ui/react';
import Menu from '../components/Menu';
import { OfferModal } from '../components/OfferModal';

const LandingPage = () => {
  return (
    <Box bgColor={'gray.100'}>
      <Menu />
      <OfferModal />
      <Container maxW={'3xl'}>
        <Stack
          direction="column"
          align="center"
          justify="center"
          height="100vh"
          as={Box}
          textAlign={'center'}
          spacing={{ base: '8', md: '10' }}
        >
          <Stack
            direction={'column'}
            spacing={{ base: 2, md: 4 }}
            fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
            lineHeight={'110%'}
          >
            <Text fontWeight={400}>Crypto cards typically suck...</Text>
            <Text
              fontWeight={600}
              as={'span'}
              color={'blue.400'}
              fontSize={'larger'}
            >
              This one doesn&apos;t!
            </Text>
          </Stack>
          <Text color={'gray.500'} fontSize={'large'}>
            The first DAO-managed, self-funded, free crypto card developed as a
            public good for the whole web3 community featuring the cheapest
            crypto-fiat conversion rates on the market.
          </Text>
          <Stack
            spacing="3"
            direction={{ base: 'column', sm: 'row' }}
            justify="center"
            position={'relative'}
          >
            <Button
              as="a"
              href="/login"
              colorScheme={'blue'}
              bg={'blue.400'}
              _hover={{
                bg: 'blue.500',
              }}
            >
              Get yours now
            </Button>
            <Button
              variant={'outline'}
              _hover={{
                bg: 'white',
              }}
              as="a"
              href="/about"
            >
              Learn more
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default LandingPage;
