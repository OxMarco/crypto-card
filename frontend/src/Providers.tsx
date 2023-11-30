import { ChakraProvider } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, base, zora } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { AppProvider } from './context';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import '@rainbow-me/rainbowkit/styles.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, base, zora],
  [publicProvider()],
);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ChakraProvider>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>
          <AppProvider>{children}</AppProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </ChakraProvider>
  );
};
