/* eslint-disable import/prefer-default-export */
import { useQuery } from '@apollo/client';
import useGetPriceData from 'components/Menu/getPrice';
import { get, isEqual, pickBy, sortBy, toLower } from 'lodash';
import { Currency } from 'packages/@pancakeswap-libs/sdk/dist';
import { ETH } from 'packages/dex/constants';
import { useEffect, useMemo, useState } from 'react';
import {
  ALL_PAIRS,
  TRADES_HISTORY,
  LIQUIDITY_HISTORY,
  CMFX_PAIR,
} from './queries';

export const useCmfxPrice = () => {
  const [price, setPrice] = useState(null);
  const { loading, data } = useQuery(CMFX_PAIR);
  const astarPrice = useGetPriceData();

  useEffect(() => {
    if (get(data, 'pair.token0Price') && astarPrice)
      setPrice(astarPrice * data.pair.token0Price);
  }, [data, astarPrice, loading]);

  return price;
};

type Currencies = {
  INPUT?: Currency;
  OUTPUT?: Currency;
};

const getTokenIdOrWrapped = (token: Currency) => {
  if (!token) return '';
  if (token.name === Currency.ETHER.name) return ETH.address;
  return token.address;
};

const getNotNullBigDecimalStr = (str: string, str2: string) => {
  if (!str || str === '0') return str2;

  return str;
};

export const useTradesHistory = (pair: Currencies, liquidity?: boolean) => {
  const currencies = useMemo(
    () =>
      sortBy([pair.INPUT, pair.OUTPUT].map(getTokenIdOrWrapped).map(toLower)),
    [pair.INPUT, pair.OUTPUT],
  );

  const [lpId, setLpId] = useState(null);
  const { data: pairsData, loading: pairsDataLoading } = useQuery(ALL_PAIRS);
  const { data: tradesData, loading: tradesDataLoading } = useQuery(
    TRADES_HISTORY,
    {
      variables: { id: lpId },
      skip: !lpId,
      pollInterval: 10000,
    },
  );

  const { data: liquidityData, loading: liquidityDataLoading } = useQuery(
    LIQUIDITY_HISTORY,
    {
      variables: { id: lpId },
      skip: !lpId,
      pollInterval: 10000,
    },
  );

  useEffect(() => {
    if (get(pairsData, 'pairs')) {
      const normalizedPairs = pairsData.pairs.map((data) => ({
        ...data,
        tokens: [data.token0.id, data.token1.id].map(toLower),
      }));
      setLpId(
        normalizedPairs.find((data) =>
          data.tokens.every((t) => currencies.includes(t)),
        )?.id,
      );
    }
  }, [pairsDataLoading, pairsData, currencies]);

  const tradesHistory = (tradesData?.pair?.swaps || []).map((trade) => ({
    transaction: trade.transaction,
    symbol0: trade.pair.token0.symbol,
    symbol1: trade.pair.token1.symbol,
    amount0: getNotNullBigDecimalStr(trade.amount0In, trade.amount0Out),
    amount1: getNotNullBigDecimalStr(trade.amount1In, trade.amount1Out),
    amountUSD: trade.amountUSD,
    type: +trade.amount0In > 0 ? 'buy' : 'sell',
  }));

  const liquidityPair = (pairsData?.pairs || []).find(
    (p) => p?.id?.toLowerCase() === lpId?.toLowerCase(),
  );

  const liquidityBurns = (liquidityData?.burns || []).map((burn) => ({
    symbol0: liquidityPair?.token0?.symbol,
    symbol1: liquidityPair?.token1?.symbol,
    amount0: burn.amount0,
    amount1: burn.amount1,
    amountUSD: burn.amountUSD,
    transaction: burn.transaction,
    type: 'sell',
  }));

  const liquidityMints = (liquidityData?.mints || []).map((mint) => ({
    symbol0: liquidityPair?.token0?.symbol,
    symbol1: liquidityPair?.token1?.symbol,
    amount0: mint.amount0,
    amount1: mint.amount1,
    amountUSD: mint.amountUSD,
    transaction: mint.transaction,
    type: 'buy',
  }));

  const liquidityHistory = [...liquidityBurns, ...liquidityMints].sort(
    (a, b) => b.transaction.timestamp - a.transaction.timestamp,
  );

  return {
    data: liquidity ? liquidityHistory : tradesHistory,
    loading: liquidity ? liquidityDataLoading : tradesDataLoading,
  };
};
