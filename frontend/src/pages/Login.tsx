import { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  Select,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useSignMessage } from 'wagmi';
import { recoverMessageAddress } from 'viem';
import { useNavigate } from 'react-router-dom';
import SignInButton from '../components/SignInButton';
import Menu from '../components/Menu';
import { AppContext } from '../context';
import { FiPhone } from 'react-icons/fi';
import api from '../utils/axios.interceptor';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { isConnected } = useAccount();
  const {
    data: signMessageData,
    error,
    isLoading,
    signMessage,
    variables,
  } = useSignMessage();
  const { accessToken, saveId, saveCardholderId, saveAccessToken } =
    useContext(AppContext);

  const [firstName, setFirstName] = useState<string>('John');
  const [lastName, setLastName] = useState<string>('Doe');
  const [dob, setDob] = useState<Date>();
  const [email, setEmail] = useState<string>('john@doe.com');
  const [phone, setPhone] = useState<string>('+420123456789');
  const [address, setAddress] = useState<string>('Am Kreuzberg 3');
  const [city, setCity] = useState<string>('Berlin');
  const [countryCode, setCountryCode] = useState<string>('DE');
  const [poBox, setPoBox] = useState<string>('10212');

  useEffect(() => {
    if (accessToken !== '') {
      navigate('/dashboard');
    }
  }, [accessToken, navigate]);

  useEffect(() => {
    (async () => {
      if (variables?.message && signMessageData) {
        const addr = await recoverMessageAddress({
          message: variables?.message,
          signature: signMessageData,
        });

        console.log('performing signup');

        await signUp({
          firstName,
          lastName,
          wallet: addr,
          dob,
          email,
          phone,
          address,
          city,
          countryCode,
          poBox,
          signature: signMessageData,
        });
      }
    })();
  }, [signMessageData, variables?.message]);

  const loginSuccessful = (data: any) => {
    saveId(data.id);
    saveCardholderId(data.cardholderId);
    saveAccessToken(data.accessToken);

    navigate('/dashboard');
  };

  const loginFailed = (error: { error: Error }) => {
    console.log(error);
  };

  const signTos = () => {
    const message =
      'I, ' +
      firstName +
      ' ' +
      lastName +
      ', living in ' +
      address +
      ' ' +
      poBox +
      ', ' +
      city +
      ' (' +
      countryCode +
      ')' +
      ' agree to the terms and conditions of this service.';
    signMessage({ message });
  };

  const signUp = async (data: any) => {
    const res = await api.post('/user', JSON.stringify(data));
    console.log(res);
    const user = await res.data;
    console.log(user);
    console.log(res.status);
    console.log(res);
  };

  return (
    <>
      <Menu />
      <Box
        bgGradient={{ base: 'white', sm: 'linear(to-r, blue.600, blue.400)' }}
        py={{ base: '12', md: '24' }}
      >
        <Container
          maxW="md"
          py={{ base: '0', sm: '8' }}
          px={{ base: '4', sm: '10' }}
          bg={{ base: 'transparent', sm: 'white' }}
          boxShadow={{ base: 'none', sm: 'xl' }}
          borderRadius={{ base: 'none', sm: 'xl' }}
        >
          <Tabs variant="enclosed">
            <TabList>
              <Tab>Login</Tab>
              <Tab>Register</Tab>
            </TabList>
            <TabPanels>
              <TabPanel
                display={'flex'}
                alignItems={'center'}
                justifyContent={'center'}
              >
                {/* <Flex > */}
                <Stack spacing="8">
                  <Stack spacing="6" align="center">
                    <Stack spacing="3" textAlign="center">
                      <Heading size="lg">Sign in your account</Heading>
                      <Text fontSize={'medium'}>
                        Start making your dreams come true
                      </Text>
                    </Stack>
                  </Stack>
                  <Stack spacing="6" alignItems={'center'}>
                    {isConnected ? (
                      <SignInButton
                        onSuccess={loginSuccessful}
                        onError={loginFailed}
                      />
                    ) : (
                      <ConnectButton />
                    )}
                  </Stack>
                  <Text textStyle="sm" textAlign="center">
                    Having trouble logging in?{' '}
                    <Link href="#" color="teal">
                      Get Help
                    </Link>
                  </Text>
                  <Text
                    fontWeight="300"
                    textStyle="xs"
                    fontSize="small"
                    textAlign="center"
                  >
                    By continuing, you acknowledge that you have read,
                    understood, and agree to our terms and condition
                  </Text>
                </Stack>
                {/* </Flex> */}
              </TabPanel>
              <TabPanel>
                <Stack spacing="8">
                  <Stack spacing="6" align="center">
                    <Stack spacing="3" textAlign="center">
                      <Heading size="lg">Create a new account</Heading>
                      <Text fontSize={'medium'}>
                        Start making crypto work for you
                      </Text>
                    </Stack>
                  </Stack>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      signTos(e);
                    }}
                  >
                    <Stack spacing="6">
                      <Stack
                        spacing="6"
                        direction={{ base: 'column', md: 'row' }}
                      >
                        <FormControl id="firstName">
                          <FormLabel>First Name</FormLabel>
                          <Input
                            id="firstName"
                            name="firstName"
                            onChange={(e) => setFirstName(e.target.value)}
                            value={firstName}
                          />
                        </FormControl>
                        <FormControl id="lastName">
                          <FormLabel>Last Name</FormLabel>
                          <Input
                            id="lastName"
                            name="lastName"
                            onChange={(e) => setLastName(e.target.value)}
                            value={lastName}
                          />
                        </FormControl>
                      </Stack>
                      <FormControl id="address">
                        <FormLabel>Street</FormLabel>
                        <Input
                          id="address"
                          name="address"
                          onChange={(e) => setAddress(e.target.value)}
                          value={address}
                        />
                      </FormControl>
                      <Stack
                        spacing="6"
                        direction={{ base: 'column', md: 'row' }}
                      >
                        <FormControl id="city">
                          <FormLabel>City</FormLabel>
                          <Input
                            id="city"
                            name="city"
                            onChange={(e) => setCity(e.target.value)}
                            value={city}
                          />
                        </FormControl>
                        <FormControl id="country">
                          <FormLabel>Country</FormLabel>
                          <Select
                            id="country"
                            name="country"
                            onChange={(e) => setCountryCode(e.target.value)}
                            value={countryCode}
                          >
                            <option value="DE">Germany</option>
                            <option value="IT">Italy</option>
                            <option value="FR">France</option>
                            <option value="ES">Spain</option>
                            <option value="HU">Hungary</option>
                            <option value="LT">Lithuania</option>
                          </Select>
                        </FormControl>
                        <FormControl id="poBox">
                          <FormLabel>Po. Box</FormLabel>
                          <Input
                            id="poBox"
                            name="poBox"
                            onChange={(e) => setPoBox(e.target.value)}
                            value={poBox}
                          />
                        </FormControl>
                      </Stack>
                      <FormControl id="dob">
                        <FormLabel>Date of Birth</FormLabel>
                        <Input
                          size="md"
                          type="date"
                          id="dob"
                          name="dob"
                          onChange={(e) => setDob(new Date(e.target.value))}
                          value={dob?.toISOString().substr(0, 10)}
                        />
                      </FormControl>
                      <Stack spacing={4}>
                        <FormLabel>Contacts</FormLabel>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <Icon as={FiPhone} color="gray.300" />
                          </InputLeftElement>
                          <Input
                            type="tel"
                            id="phone"
                            name="phone"
                            onChange={(e) => setPhone(e.target.value)}
                            value={phone}
                          />
                        </InputGroup>

                        <InputGroup>
                          <InputLeftElement
                            pointerEvents="none"
                            color="gray.300"
                            fontSize="1.2em"
                            children="@"
                          />
                          <Input
                            type="email"
                            id="email"
                            name="email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                          />
                        </InputGroup>
                      </Stack>
                      <Button type="submit">Submit</Button>
                    </Stack>
                  </form>
                </Stack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Container>
      </Box>
    </>
  );
};

export default LoginPage;
