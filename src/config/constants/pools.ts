import { PoolConfig, QuoteToken, PoolCategory } from './types'

const pools: PoolConfig[] = [
  {
    sousId: 0,
    tokenName: 'CMFX',
    tokenAddress: '0x2B36570251C4c0218F07c870EC16720d64B03f47',   // token address
    stakingTokenName: QuoteToken.CAKE,
    stakingTokenAddress: '0x2B36570251C4c0218F07c870EC16720d64B03f47',  // token address
    contractAddress: {
      97: '',
      592: '0x6945d89F7a1851c8a5785C3083819525F916EdC5',  /// masterchef address
    },
    poolCategory: PoolCategory.CORE,
    projectLink: '/',
    harvest: true,
    tokenPerBlock: '0.4',
    sortOrder: 1,
    isFinished: false,
    tokenDecimals: 18,
  },
 
]

export default pools
