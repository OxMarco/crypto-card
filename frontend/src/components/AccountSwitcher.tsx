import { Box, Flex, HStack } from '@chakra-ui/react';
import { FiLock } from 'react-icons/fi';
import { useAccount, useNetwork } from 'wagmi';

export const AccountSwitcher = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();

  const truncateEthereumAddress = (address: string | undefined) => {
    if (!address || address.length < 12) {
      return '0x00000';
    }

    const start = address.substring(0, 7); // '0x' + first 5 characters
    const end = address.substring(address.length - 5); // last 5 characters
    return `${start}...${end}`;
  };

  return (
    <Flex
      w="full"
      display="flex"
      alignItems="center"
      rounded="lg"
      bg="gray.700"
      px="3"
      py="2"
      fontSize="sm"
      userSelect="none"
      outline="0"
      transition="all 0.2s"
      _active={{ bg: 'gray.600' }}
      _focus={{ shadow: 'outline' }}
    >
      <HStack flex="1" spacing="3">
        <Box textAlign="start">
          <Box noOfLines={1} fontWeight="semibold">
            {truncateEthereumAddress(address)}
          </Box>
          <Box fontSize="xs" color="gray.400">
            {chain?.name}
          </Box>
        </Box>
      </HStack>
      <Box fontSize="lg" color="gray.400">
        <FiLock />
      </Box>
    </Flex>
  );
};
