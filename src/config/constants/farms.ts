import contracts from "./contracts";
import { FarmConfig, QuoteToken } from "./types";

const farms: FarmConfig[] = [
  {
    multiplier: "150",
    pid: 0,
    lpSymbol: "CMFX",
    lpAddresses: {
      97: "",
      56: "0x2B36570251C4c0218F07c870EC16720d64B03f47",
      592: "0x2B36570251C4c0218F07c870EC16720d64B03f47",
    },
    tokenSymbol: "SYRUP",
    tokenAddresses: {
      97: "",
      56: "0x2B36570251C4c0218F07c870EC16720d64B03f47",
      592: "0x2B36570251C4c0218F07c870EC16720d64B03f47",
    },
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
  },

  {
    multiplier: "40",
    pid: 2,
    lpSymbol: "ASTR-CMFX LP",
    lpAddresses: {
      97: "",
      592: "0xFD57bC615b52Cd6EA7bD764c4A33d040E583daEA", // lp address token-bnb
    },
    tokenSymbol: "CMFX",
    tokenAddresses: {
      97: "",
      592: "0x2B36570251C4c0218F07c870EC16720d64B03f47", // token address
    },
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
    hot: true,
  }
];

export default farms;
