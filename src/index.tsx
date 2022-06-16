import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Providers from './Providers';
import ApplicationUpdater from './packages/dex/state/application/updater';
import ListsUpdater from './packages/dex/state/lists/updater';
import MulticallUpdater from './packages/dex/state/multicall/updater';
import TransactionUpdater from './packages/dex/state/transactions/updater';

ReactDOM.render(
  <React.StrictMode>
    <Providers>
      <>
        <ListsUpdater />
        <ApplicationUpdater />
        <TransactionUpdater />
        <MulticallUpdater />
      </>
      <App />
    </Providers>
  </React.StrictMode>,
  document.getElementById('root')
);
