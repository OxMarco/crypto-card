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

export const LoginPage = () => {
  const navigate = useNavigate();
  const { isConnected } = useAccount();
  const [recoveredAddress, setRecoveredAddress] = useState<string>('');
  const {
    data: signMessageData,
    error,
    isLoading,
    signMessage,
    variables,
  } = useSignMessage();
  const { accessToken, saveId, saveCardholderId, saveAccessToken } =
    useContext(AppContext);

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
        setRecoveredAddress(addr);
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

  const signTos = (event: any) => {
    const formData = new FormData(event.target);
    const message =
      'I, ' +
      formData.get('firstName') +
      ' ' +
      formData.get('lastName') +
      ', living in ' +
      formData.get('address') +
      ' ' +
      formData.get('poBox') +
      ', ' +
      formData.get('city') +
      ' (' +
      formData.get('country') +
      ')' +
      ' agree to the terms and conditions of this service.';
    signMessage({ message });
  };

  const signUp = () => {};

  return (
    <>
      <Menu />
      <Box
        bgGradient={{ base: 'white', sm: 'linear(to-r, blue.600, blue.400)' }}
        py={{ base: '12', md: '24' }}
        minH={'100vh'}
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
              <TabPanel  h={{
                base: '80vh',
                sm: '30vh'
                }} display={'flex'} alignItems={'center'} justifyContent={'center'}>
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
                  <Stack spacing="6" alignItems={'center'} >
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
                            defaultValue="John"
                            id="firstName"
                            name="firstName"
                          />
                        </FormControl>
                        <FormControl id="lastName">
                          <FormLabel>Last Name</FormLabel>
                          <Input
                            defaultValue="Doe"
                            id="lastName"
                            name="lastName"
                          />
                        </FormControl>
                      </Stack>
                      <FormControl id="address">
                        <FormLabel>Street</FormLabel>
                        <Input
                          defaultValue="Am Kreuzberg 3"
                          id="address"
                          name="address"
                        />
                      </FormControl>
                      <Stack
                        spacing="6"
                        direction={{ base: 'column', md: 'row' }}
                      >
                        <FormControl id="city">
                          <FormLabel>City</FormLabel>
                          <Input defaultValue="Berlin" id="city" name="city" />
                        </FormControl>
                        <FormControl id="country">
                          <FormLabel>Country</FormLabel>
                          <Input
                            defaultValue="Germany"
                            id="country"
                            name="country"
                          />
                        </FormControl>
                        <FormControl id="poBox">
                          <FormLabel>ZIP/PoBox</FormLabel>
                          <Input defaultValue="10961" id="poBox" name="poBox" />
                        </FormControl>
                      </Stack>
                      <FormControl id="dob">
                        <FormLabel>Date of Birth</FormLabel>
                        <Input size="md" type="date" id="dob" name="dob" />
                      </FormControl>
                      <Stack spacing={4}>
                        <FormLabel>Contacts</FormLabel>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <Icon as={FiPhone} color="gray.300" />
                          </InputLeftElement>
                          <Input
                            type="tel"
                            placeholder="+49123456..."
                            id="phone"
                            name="phone"
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
                            placeholder="john@example.com"
                            id="email"
                            name="email"
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
