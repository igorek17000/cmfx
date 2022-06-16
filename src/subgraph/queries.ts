import { gql } from '@apollo/client';

export const CMFX_PAIR = gql`
  query CmfxPair {
    pair(id: "0x67a8768510c5499ca0dfd7debe965b9df6d3924c") {
      id
      token0Price
      token1Price
    }
  }
`;

export const ALL_PAIRS = gql`
  query AllPairs {
    pairs {
      id
      token1 {
        id,
        symbol
      }
      token0 {
        id,
        symbol
      }
    }
  }
`;

export const TRADES_HISTORY = gql`
  query MyQuery(
    $id: ID = "0x67a8768510c5499ca0dfd7debe965b9df6d3924c"
  ) {
    pair(id: $id) {
      swaps(orderBy: timestamp, orderDirection: desc, first: 20) {
        amount0In
        amount0Out
        amount1In
        amount1Out
        amountUSD
        transaction {
          id
          timestamp
        }
        pair {
          token1 {
            name
            symbol
          }
          token0 {
            name
            symbol
          }
        }
      }
    }
  }
`;

export const LIQUIDITY_HISTORY = gql`
  query($id: ID) {
    mints(
      first: 10
      orderBy: timestamp
      orderDirection: desc
      where: { pair: $id }
    ) {
      id
      transaction {
        id
        timestamp
      }
      timestamp
      sender
      amount0
      amount1
      amountUSD
    }
    burns(
      first: 10
      orderBy: timestamp
      orderDirection: desc
      where: { pair: $id }
    ) {
      id
      transaction {
        id
        timestamp
      }
      timestamp
      sender
      amount0
      amount1
      amountUSD
    }
  }
`;
