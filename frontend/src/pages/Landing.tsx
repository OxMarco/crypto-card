import { Stack, Box, Button, Container, Text, Flex } from '@chakra-ui/react';
import Menu from '../components/Menu';
import { OfferModal } from '../components/OfferModal';

const LandingPage = () => {
  return (
    <Box bgColor={'gray.100'}>
      <Menu />
      <OfferModal />
      <Container maxW={'8xl'} w="full">
        <Flex
          direction={{ base: 'column', lg: 'row' }}
          justifyContent="center"
          alignItems="center"
        >
          <Stack
            direction="column"
            align={{ base: 'center', lg: 'start' }}
            justify="center"
            height="100vh"
            as={Box}
            textAlign={{ base: 'center', lg: 'start' }}
            spacing={{ base: '8', md: '10' }}
          >
            <Stack
              direction={'column'}
              spacing={{ base: 2, md: 4 }}
              fontSize={{ base: '3xl', md: '5xl', lg: '6xl' }}
              lineHeight={'110%'}
            >
              <Text fontWeight={400}>
                Crypto cards typically suck...
              </Text>
              <Text
                fontWeight={600}
                as={'span'}
                color={'blue.400'}
                fontSize={'larger'}
              >
                This one doesn&apos;t!
              </Text>
            </Stack>
            <Text
              color={'gray.500'}
              fontSize={'large'}
              maxW={{ base: '100%', lg: '75%' }}
            >
              The first DAO-managed, self-funded, free crypto card developed as
              a public good for the whole web3 community featuring the cheapest
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

          <Box h="fit" display={{ base: 'none', lg: 'block' }}>
            <Box
              className="card constant-tilt-shake"
              shadow="md"
              bg="linear-gradient(to right, #667db6, #0082c8, #0082c8, #667db6)"
            >
              <Box className="visa_logo">
                <img
                  src="https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/visa.png"
                  alt=""
                />
              </Box>
              <Box className="visa_info">
                <img
                  src="https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/chip.png"
                  alt=""
                />
                <p>1234 **** **** 0987</p>
              </Box>
              <Box className="visa_crinfo">
                <p>08/26</p>
                <p>Daniel Lite</p>
              </Box>
            </Box>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default LandingPage;
