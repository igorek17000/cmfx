import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { Card } from "../../packages/@pancakeswap-libs/uikit";

import { CMFXSWAP_URL } from "subgraph";
import gqlRequest from "utils/gqlRequest";
import Datafeed from "./datafeed";
import CurrencySwitch from "./CurrencySwitch";
import { Field } from "packages/dex/state/swap/actions";
import { Currency } from "packages/@pancakeswap-libs/sdk/dist";
import getTradingViewTimeZone from "./timezone";

const tvConfig = {
  interval: "15",
  container: "tv_chart_container",
  locale: "en",
  library_path: "charting_library/",
  timeframe: "1D",
  time_frames: [
    { text: "50y", resolution: "6M", description: "50 Years" },
    { text: "3y", resolution: "1W", description: "3 Years", title: "3yr" },
    { text: "8m", resolution: "1D", description: "8 Month" },
    { text: "3d", resolution: "5", description: "3 Days" },
    { text: "1000y", resolution: "1W", description: "All", title: "All" },
  ],
  timezone: getTradingViewTimeZone(),
  favorites: {
    intervals: ["1", "5", "15", "60", "240", "1D"],
  },
  has_intraday: false,
  width: "100%",
  height: "100%",
  disabled_features: [
    "timezone_menu",
    "go_on_date",
    "header_compare",
    "header_indicators",
    "header_undo_redo",
    "timeframes_toolbar",
    "header_symbol_search",
  ],
};

const ChartWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const ChartCard = styled(Card)`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const SwitchWrapper = styled.div``;

const STABLES = ["BUSD", "USDC"];

type Props = {
  pair: {
    INPUT?: Currency;
    OUTPUT?: Currency;
  };
};

const TvChart = ({ pair }: Props) => {
  const [currentCurrency, setCurrentCurrency] = useState("ASTAR");
  const [loadChart, setLoadChart] = useState(true);
  const [pairAddress, setPairAddress] = useState(null);

  const token0 = pair[Field.INPUT]?.symbol;
  const token1 = pair[Field.OUTPUT]?.symbol;

  useEffect(() => {
    const fetch = async () => {
      const getPairAddress = async (symbol0, symbol1) => {
        const [token0Id, token1Id] = await Promise.all([
          gqlRequest(
            CMFXSWAP_URL,
            `{
          tokens(where: {symbol: "${symbol0 === "ASTR" ? "WASTR" : symbol0}"}) {
            id
          }
          }`
          ).then((data) => data?.tokens?.[0]?.id),
          gqlRequest(
            CMFXSWAP_URL,
            `{
            tokens(where: {symbol: "${
              symbol1 === "ASTR" ? "WASTR" : symbol1
            }"}) {
            id
          }
          }`
          ).then((data) => data?.tokens?.[0]?.id),
        ]);

        const pairData = await gqlRequest(
          CMFXSWAP_URL,
          `{
            pairs(where: {
              token0: "${token0Id}",
              token1: "${token1Id}"
            }
              ) {
              id
            }
           }
            `
        );

        if (pairData?.pairs?.[0]?.id) {
          setPairAddress(pairData?.pairs?.[0]?.id);
        }

        return pairData?.pairs?.[0]?.id;
      };

      const id = await getPairAddress(token0, token1);
      if (!id) {
        await getPairAddress(token1, token0);
      }
    };

    fetch();
  }, [token0, token1]);

  const chart = useRef(null);

  useEffect(() => {
    if (!pairAddress) return;
    if (!loadChart) return;
    /* if (chart.current) {
      chart.current.setSymbol(pairAddress, chart.current.symbolInterval());
      return;
    } */
    chart.current?.remove();

    // eslint-disable-next-line
    chart.current = new (window as any).TradingView.widget({
      ...tvConfig,
      symbol: pairAddress,
      datafeed: new Datafeed({ usd: currentCurrency === "USD" }),
    });
    setLoadChart(false);
  }, [pairAddress, loadChart, currentCurrency]);

  useEffect(() => {
    chart.current?.remove();
    chart.current = null;
    setLoadChart(true);
  }, [currentCurrency]);

  useEffect(() => {
    if (pairAddress && !loadChart) {
      setLoadChart(true);
    }
  }, [pairAddress, currentCurrency]);

  const disabledUsd = STABLES.includes(token0) || STABLES.includes(token1);

  useEffect(() => {
    if (disabledUsd) {
      setCurrentCurrency("ASTAR");
    }
  }, [disabledUsd]);

  return (
    <ChartWrapper>
      <ChartCard>
        <SwitchWrapper>
          <CurrencySwitch
            value={currentCurrency}
            onChange={(curr) => setCurrentCurrency(curr)}
            disableUsd={disabledUsd}
          />
        </SwitchWrapper>
        <div id="tv_chart_container" style={{ flexGrow: 1 }} />
      </ChartCard>
    </ChartWrapper>
  );
};

export default TvChart;
