import {
  Box,
  Container,
  Flex,
  HStack,
  Heading,
  IconButton,
  Spacer,
  Stack,
  useColorModeValue as mode,
} from '@chakra-ui/react';
import {
  BiCog,
  BiCreditCard,
  BiHome,
  BiLogOut,
  BiWallet,
} from 'react-icons/bi';
import { useLocation } from 'react-router-dom';
import { NavItem } from '../../components/NavItem';
import { AccountSwitcher } from '../../components/AccountSwitcher';
import { ReactNode } from 'react';
import { FiArrowLeft } from 'react-icons/fi';

const AuthRootPage = ({
  title,
  button,
  back,
  children,
}: {
  title: string;
  button?: any;
  back?: boolean;
  children: ReactNode;
}) => {
  const location = useLocation();

  const navItems = [
    { icon: BiHome, label: 'Dashboard', href: '/dashboard' },
    { icon: BiWallet, label: 'Vaults', href: '/vaults' },
    { icon: BiCreditCard, label: 'Cards', href: '/cards' },
  ];

  return (
    <Box height="100vh" overflow="hidden" position="relative">
      <Flex h="full" id="app-container">
        <Box w="64" bg="gray.900" color="white" fontSize="sm">
          <Flex h="full" direction="column" px="4" py="4">
            <AccountSwitcher />
            <Stack spacing="8" flex="1" overflow="auto" pt="8">
              <Stack spacing="1">
                {navItems.map((item: any, index: number) => (
                  <NavItem
                    key={index}
                    active={location.pathname === item.href}
                    icon={<item.icon />}
                    label={item.label}
                    href={item.href}
                  />
                ))}
              </Stack>
            </Stack>
            <Box>
              <Stack spacing="1">
                <NavItem subtle icon={<BiCog />} label="Settings" />
                <NavItem
                  subtle
                  icon={<BiLogOut />}
                  label="Logout"
                  href="/logout"
                />
              </Stack>
            </Box>
          </Flex>
        </Box>
        <Box bg={mode('white', 'gray.800')} flex="1" p="6">
          <Box
            w="full"
            h="full"
            rounded="lg"
            border="3px dashed currentColor"
            borderColor={mode('gray.200', 'gray.700')}
          >
            <Flex flex="1" direction="column" overflowY="auto">
              <Box
                flex="1"
                px="6"
                py="4"
                alignContent="center"
                justifyContent="center"
              >
                <Box as="header" bg={mode('white', 'gray.700')} px="6" py="4">
                  <HStack>
                    {back && (
                      <IconButton
                        aria-label="Back"
                        variant={'outline'}
                        icon={<FiArrowLeft />}
                        onClick={() => window.history.back()}
                      />
                    )}
                    <Heading size="lg">{title}</Heading>
                    <Spacer />
                    {button}
                  </HStack>
                </Box>
                <Container
                  maxW="container.xl"
                  maxHeight="350px"
                  overflowY="auto"
                >
                  {children}
                </Container>
              </Box>
            </Flex>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default AuthRootPage;
