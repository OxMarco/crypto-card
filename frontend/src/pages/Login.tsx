import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react'
import { FiLock } from 'react-icons/fi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Menu from '../components/Menu'

export const LoginPage = () => (
  <>
    <Menu />
  <Box bgGradient={{ base: 'linear(to-r, blue.600, blue.400)' }}
  height='100vh'
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
      <Stack spacing="8">
        <Stack spacing="6" align="center">
          <Stack spacing="3" textAlign="center">
            <Heading size="lg">Log in to your account</Heading>
            <Text fontSize={"medium"}>Start making your dreams come true</Text>
          </Stack>
        </Stack>
        <Stack spacing="6">
          <ConnectButton />
          <Divider />
          <Stack spacing="4">
            <Stack spacing="-px">
          <FormControl id="email">
            <FormLabel srOnly>Email address</FormLabel>
            <Input name="email" type="email" placeholder="Email" roundedBottom="0" />
          </FormControl>
          <FormControl id="password">
            <FormLabel srOnly>Password</FormLabel>
            <Input name="password" type="password" placeholder="Password" roundedTop="0" />
          </FormControl>
        </Stack>
            <Button>Continue</Button>
          </Stack>
        </Stack>
        <Text textStyle="sm" textAlign="center">
          Having trouble logging in? <Link href="#" color="teal">Reset Password</Link>
        </Text>
        <Text fontWeight="300" textStyle="xs" fontSize="small" textAlign="center">
          By continuing, you acknowledge that you have read, understood, and agree to our terms and
          condition
        </Text>
      </Stack>
    </Container>
  </Box>
  </>
)

export default LoginPage
