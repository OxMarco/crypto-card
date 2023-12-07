import { Box, Spinner, Text } from '@chakra-ui/react';
import AuthRootPage from '../pages/auth/AuthRoot';

export const LoadingView = () => {
  return (
    <AuthRootPage title="Vaults">
      <Box textAlign="center" py={5}>
        <Spinner />
        <Text>Loading data...</Text>
      </Box>
    </AuthRootPage>
  );
};
