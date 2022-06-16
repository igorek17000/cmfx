import React, { Suspense, useEffect, lazy } from 'react';
import { Router, Redirect, Route, Switch } from 'react-router-dom';

import BigNumber from 'bignumber.js';

import { ResetCSS } from './packages/@pancakeswap-libs/uikit';

import useEagerConnect from 'hooks/useEagerConnect';
import {
  useFetchPriceList,
  useFetchPublicData,
} from 'state/hooks';
import useGetDocumentTitlePrice from './hooks/useGetDocumentTitlePrice';

import GlobalStyle from './style/Global';
import Pools from './views/Pools';

import Menu from './components/Menu';
import SuspenseWithChunkError from './components/SuspenseWithChunkError';
import ToastListener from './components/ToastListener';
// import PageLoader from './components/PageLoader';
// import EasterEgg from './components/EasterEgg';

import Swap from './packages/dex/views/Swap';
import Pool from './packages/dex/views/Pool';
import PoolFinder from './packages/dex/views/PoolFinder';
import AddLiquidity from './packages/dex/views/AddLiquidity';
import RemoveLiquidity from './packages/dex/views/RemoveLiquidity';
import {
  RedirectDuplicateTokenIds,
  RedirectOldAddLiquidityPathStructure,
} from './packages/dex/views/AddLiquidity/redirects';
import { RedirectOldRemoveLiquidityPathStructure } from './packages/dex/views/RemoveLiquidity/redirects';
// import { RedirectPathToSwapOnly } from './packages/dex/views/Swap/redirects';

import Web3ReactManager from './packages/dex/components/Web3ReactManager';

import history from './routerHistory';

// Route-based code splitting
// Only pool is included in the main bundle because of it's the most visited page
const Home = lazy(() => import('./views/Home'));
const Farms = lazy(() => import('./views/Farms'));
const NotFound = lazy(() => import('./views/NotFound'));

// This config is required for number formating
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

const App: React.FC = () => {
  // Monkey patch warn() because of web3 flood
  // To be removed when web3 1.3.5 is released
  useEffect(() => {
    console.warn = () => null;
  }, []);

  useEagerConnect();
  useFetchPublicData();
  useFetchPriceList();
  useGetDocumentTitlePrice();

  return (
    <Suspense fallback={null}>
      <Router history={history}>
        <ResetCSS />
        <GlobalStyle />
        <Menu>
          <SuspenseWithChunkError fallback={<> </>}>
            <Web3ReactManager>
              <Switch>
                <Route path="/" exact>
                  <Home />
                </Route>
                <Route path="/swap" component={Swap} exact strict />
                <Route
                  path="/find"
                  component={PoolFinder}
                  exact
                  strict
                />
                <Route path="/pool" component={Pool} exact strict />
                <Route path="/add" component={AddLiquidity} exact />
                <Route
                  path="/remove/:currencyIdA/:currencyIdB"
                  component={RemoveLiquidity}
                  exact
                  strict
                />
                {/* Redirection: These old routes are still used in the code base */}
                <Route
                  path="/add/:currencyIdA"
                  component={RedirectOldAddLiquidityPathStructure}
                  exact
                />
                <Route
                  path="/add/:currencyIdA/:currencyIdB"
                  component={RedirectDuplicateTokenIds}
                  exact
                />
                <Route
                  path="/remove/:tokens"
                  component={RedirectOldRemoveLiquidityPathStructure}
                  exact
                  strict
                />
                {/* <Route
                  component={RedirectPathToSwapOnly}
                /> */}
                <Route path="/farms">
                  <Farms />
                </Route>
                <Route path="/pools">
                  <Pools />
                </Route>
                <Route path="/staking">
                  <Redirect to="/pools" />
                </Route>
                <Route path="/syrup">
                  <Redirect to="/pools" />
                </Route>
                <Route component={NotFound} />
              </Switch>
            </Web3ReactManager>
          </SuspenseWithChunkError>
        </Menu>
        <ToastListener />
        
      </Router>
    </Suspense>
  );
};

export default React.memo(App);
