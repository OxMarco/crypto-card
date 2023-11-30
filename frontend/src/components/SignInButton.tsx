import * as React from 'react';
import { useAccount, useNetwork, useSignMessage } from 'wagmi';
import { SiweMessage } from 'siwe';
import { Button, Icon, Spinner } from '@chakra-ui/react';
import { FiLock } from 'react-icons/fi';

const SignInButton = ({
  onSuccess,
  onError,
}: {
  onSuccess: (args: { data: any }) => void;
  onError: (args: { error: Error }) => void;
}) => {
  const [state, setState] = React.useState<{
    loading?: boolean;
    nonce?: string;
  }>({});
  const [processing, setProcessing] = React.useState<boolean>(false);

  const fetchNonce = async () => {
    try {
      const nonceRes = await fetch('http://localhost:3000/auth/' + address);
      const res = await nonceRes.json();
      const nonce = res.nonce;

      setState((x) => ({ ...x, nonce }));
    } catch (error) {
      setState((x) => ({ ...x, error: error as Error }));
    }
  };

  // Pre-fetch random nonce when button is rendered
  // to ensure deep linking works for WalletConnect
  // users on iOS when signing the SIWE message
  React.useEffect(() => {
    fetchNonce();
  }, []);

  const { address } = useAccount();
  const { chain } = useNetwork();
  const { signMessageAsync } = useSignMessage();

  const signIn = async () => {
    setProcessing(true);

    try {
      const chainId = chain?.id;
      if (!address || !chainId) return;

      setState((x) => ({ ...x, loading: true }));
      // Create SIWE message with pre-fetched nonce and sign with wallet
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in with Ethereum to the app.',
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce: state.nonce,
      });
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });

      // Verify signature
      const verifyRes = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet: address,
          message: JSON.stringify(message),
          signature,
        }),
      });
      if (!verifyRes.ok) {
        const errorResponse = await verifyRes.json();
        console.error(errorResponse);
        throw new Error(errorResponse);
      }

      const data = await verifyRes.json();

      setState((x) => ({ ...x, loading: false }));
      onSuccess(data);
    } catch (error) {
      setState((x) => ({ ...x, loading: false, nonce: undefined }));
      onError({ error: error as Error });
      fetchNonce();
    }

    setProcessing(false);
  };

  return (
    <Button
      variant="outline"
      disabled={!state.nonce || state.loading}
      onClick={signIn}
      bg={{ base: 'white', sm: 'blue' }}
    >
      {processing ? (
        <Spinner />
      ) : (
        <Icon as={FiLock} mr={2} />
      )}
      Sign-In with Ethereum
    </Button>
  );
};

export default SignInButton;
