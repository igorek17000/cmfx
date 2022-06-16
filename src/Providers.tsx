import React from 'react';
import {
  createWeb3ReactRoot,
  Web3ReactProvider,
} from '@web3-react/core';
import { ApolloProvider } from '@apollo/client';
import { Provider } from 'react-redux';
import { getLibrary } from 'utils/web3React';
import getNetworkLibrary from './packages/dex/utils/getLibrary';
import { LanguageContextProvider } from 'contexts/Localisation/languageContext';
import { ThemeContextProvider } from 'contexts/ThemeContext';
import { RefreshContextProvider } from 'contexts/RefreshContext';
import store from 'state';
import { NetworkContextName } from './packages/dex/constants';
import { ModalProvider } from './packages/@pancakeswap-libs/uikit';
import client from 'subgraph';

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName);

const Providers: React.FC = ({ children }) => {
  return (
    <ApolloProvider client={client}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Web3ProviderNetwork getLibrary={getNetworkLibrary}>
          <Provider store={store}>
            <ThemeContextProvider>
              <LanguageContextProvider>
                <RefreshContextProvider>
                  <ModalProvider>{children}</ModalProvider>
                </RefreshContextProvider>
              </LanguageContextProvider>
            </ThemeContextProvider>
          </Provider>
        </Web3ProviderNetwork>
      </Web3ReactProvider>
    </ApolloProvider>
  );
};

export default Providers;
