import { Box, Text, Stack } from '@chakra-ui/react';
import Menu from '../components/Menu';

const FaqPage = () => {
  return (
    <Box bgColor={'gray.100'}>
      <Menu />
      <Stack as={Box} textAlign={'center'} spacing={{ base: '8', md: '10' }}>
        <Stack fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}>
          <Text fontWeight={600}>FAQ</Text>
          <Text fontSize="large">All you wanted to ask but never dared to</Text>
        </Stack>
      </Stack>
    </Box>
  );
};

export default FaqPage;
