import { gql } from "@apollo/client";
import getTradingViewTimeZone from "./timezone";

import { CMFXSWAP_URL, CMFXCANDLES_URL } from "../../subgraph";

export const CMFX_PAIR = gql`
  query CmfxPair {
    pair(id: "0x67a8768510c5499ca0dfd1Webe965b9df6d3924c") {
      id
      token0Price
      token1Price
    }
  }
`;

/* eslint-disable */

type SymbolInfo = {
  name: string;
  ticker: string;
  description: string;
  type: "crypto";
  session: "24x7";
  session_holidays: "";
  exchange: "CmfxSwap";
  listed_exchange: "CmfxSwap";
  timezone: string;
  minmov: 1;
  pointvalue: 4;
  pricescale: 1000000;
  "has-no-volume": true;
  has_daily: true;
  has_intraday: true;
  has_weekly_and_monthly: true;
  supported_resolutions: ["1", "5", "15", "60", "240", "D", "1W"];
  currency_code: "ASTAR";
};

class Datafeed {
  constructor({ usd }: { usd: boolean }) {
    this.usd = usd;
  }

  subcriptions: { [key: string]: any } = {};
  pairsCache: { [key: string]: any } = {};

  loadedResolutions: { [key: string]: any } = {};

  usd = false;

  readonly creationDexTimestamp = 1648937952;

  onReady = (callback) => {
    callback({
      exchanges: [
        {
          value: "cmfxswap",
          name: "CmfxSwap",
          desc: "",
        },
      ],
      symbols_types: [],
      supports_time: false,
      supported_resolutions: ["1", "5", "15", "60", "240", "D", "1W"],
      currency_codes: [],
    });
  };

  searchSymbols = (userInput, exchange, symbolType, onResultReadyCallback) => {
    console.log("searchSymbols");
  };

  resolveSymbol = async (
    symbolName,
    onSymbolResolvedCallback: (info: SymbolInfo) => void,
    onResolveErrorCallback,
    extension
  ) => {
    try {
      const pairInfoRes = await fetch(CMFXSWAP_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
        {
          pair(id: "${symbolName}") {
            id
            token0 {
              symbol
            }
            token1 {  
              symbol
            } 
          }
        }
          `,
        }),
      });

      const pairInfo = (await pairInfoRes.json()).data;

      onSymbolResolvedCallback({
        name: `${pairInfo.pair.token0.symbol}-${pairInfo.pair.token1.symbol}`,
        ticker: symbolName,
        description: `${pairInfo.pair.token0.symbol}-${pairInfo.pair.token1.symbol}`,
        type: "crypto",
        session: "24x7",
        session_holidays: "",
        exchange: "CmfxSwap",
        listed_exchange: "CmfxSwap",
        timezone: getTradingViewTimeZone(),
        minmov: 1,
        pointvalue: 4,
        pricescale: 1000000,
        "has-no-volume": true,
        has_daily: true,
        has_intraday: true,
        has_weekly_and_monthly: true,
        supported_resolutions: ["1", "5", "15", "60", "240", "D", "1W"],
        currency_code: "ASTAR",
      });
    } catch (e) {
      console.log(e);
    }
  };

  private async getPairTokensIds(address: string) {
    try {
      if (this.pairsCache[address]) {
        return this.pairsCache[address];
      }

      const pairInfoRes = await fetch(CMFXSWAP_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
        {
          pair(id: "${address}") {
            id
            token0 {
              id
            }
            token1 {
              id
            }
          }
        }
          `,
        }),
      });

      const pairInfo = await pairInfoRes.json();

      const ids = [pairInfo.data.pair.token0.id, pairInfo.data.pair.token1.id];

      this.pairsCache[address] = ids;

      return ids;
    } catch (e) {
      console.log(e);
    }
  }

  getBars = async (
    symbolInfo,
    resolution,
    periodParams,
    onHistoryCallback,
    onErrorCallback
  ) => {
    try {
      const numberResolution = this.getPeriodNumber(resolution);

      const [token0Id, token1Id] = await this.getPairTokensIds(
        symbolInfo.ticker
      );

      if (periodParams.to < this.creationDexTimestamp) {
        return onHistoryCallback([], { noData: true });
      }

      const barsRes = await fetch(CMFXCANDLES_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `{
          candles(where: { 
            token0: "${token0Id}", 
            token1: "${token1Id}", 
            time_lt: ${periodParams.to},
            period: ${numberResolution}
          }, 
          first: ${periodParams.countBack},
          orderBy: time, orderDirection: desc) 
          {
            id
            time
            period
            token0TotalAmount
            token1TotalAmount
            open
            close
            low 
            high 
            openUsd
            closeUsd
            lowUsd
            highUsd
            volumeUsd
          }
        }`,
        }),
      });

      const bars = await barsRes.json();

      bars.data.candles.reverse();

      if (this.usd) {
        onHistoryCallback(
          bars.data.candles.map((c) => ({
            ...c,
            open: c.openUsd,
            close: c.closeUsd,
            low: c.lowUsd,
            high: c.highUsd,
            time: c.time * 1000,
            volume: parseFloat(c.volumeUsd),
          })),
          { noData: !bars?.data?.candles?.length }
        );
        return;
      }

      this.loadedResolutions[resolution] = true;

      onHistoryCallback(
        bars.data.candles.map((c) => ({
          ...c,
          time: c.time * 1000,
          volume: parseFloat(c.volumeUsd),
        })),
        { noData: !bars?.data?.candles?.length }
      );
    } catch (e) {
      console.log(e);
    }
  };

  private getPeriodNumber(resolution: string) {
    let numberResolution;

    console.log(resolution);

    switch (resolution) {
      case "1":
        numberResolution = 60;
        break;
      case "5":
        numberResolution = 300;
        break;
      case "15":
        numberResolution = 900;
        break;
      case "60":
        numberResolution = 3600;
        break;
      case "240":
        numberResolution = 14400;
        break;
      case "1D":
        numberResolution = 86400;
        break;
      case "1W":
        numberResolution = 604800;
        break;
    }

    return numberResolution;
  }

  subscribeBars = async (
    symbolInfo,
    resolution,
    onRealtimeCallback,
    subscriberUID,
    onResetCacheNeededCallback
  ) => {
    try {
      const [token0Id, token1Id] = await this.getPairTokensIds(
        symbolInfo.ticker
      );

      this.subcriptions[subscriberUID] = setInterval(async () => {
        const barsRes = await fetch(CMFXCANDLES_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `    
        {
          candles(where: { 
            token0: "${token0Id}", 
            token1: "${token1Id}", 
            period: ${this.getPeriodNumber(resolution)} 
          }, 
          orderBy: time,
          orderDirection: desc,
          first: 1 ) 
          {
            id
            time
            period
            token0TotalAmount
            token1TotalAmount
            open
            close
            low
            high  
            openUsd
            closeUsd
            lowUsd
            highUsd
            volumeUsd
          }
        }
          `,
          }),
        });

        const bar = (await barsRes.json())?.data?.candles?.[0];

        if (!bar) {
          onRealtimeCallback(null);
        }

        if (this.usd) {
          onRealtimeCallback({
            ...bar,
            open: bar.openUsd,
            close: bar.closeUsd,
            low: bar.lowUsd,
            high: bar.highUsd,
            volume: bar.volumeUsd,
            time: bar.time * 1000,
          });
          return;
        }

        onRealtimeCallback({
          ...bar,
          time: bar.time * 1000,
          volume: parseFloat(bar.volumeUsd),
        });
      }, 15000);
    } catch (e) {
      console.log(e);
    }
  };

  unsubscribeBars = (subscriberUID) => {
    try {
      clearInterval(this.subcriptions[subscriberUID]);
    } catch (e) {
      console.log(e);
    }
  };

  getMarks = (symbolInfo, from, to, onDataCallback, resolution) => {
    //console.log("getMarks");
  };

  getTimescaleMarks = (symbolInfo, from, to, onDataCallback, resolution) => {
    //console.log("getTimescaleMarks");
  };

  getServerTime = (callback) => {
    // console.log("getServerTime");
  };

  getVolumeProfileResolutionForPeriod = (
    currentResolution,
    from,
    to,
    symbolInfo
  ) => {
    //console.log("getVolumeProfileResolutionForPeriod");
  };
}

export default Datafeed;
