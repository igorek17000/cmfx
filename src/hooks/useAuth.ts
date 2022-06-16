import { useCallback } from 'react'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { useToast } from 'state/hooks'
import { connectorsByName } from 'utils/web3React'
import { setupNetwork } from 'utils/wallet'
import { ConnectorNames } from '../packages/@pancakeswap-libs/uikit'
import { NetworkContextName } from 'packages/dex/constants'

const useAuth = () => {
  const { activate, deactivate } = useWeb3React()
  const { toastError } = useToast()
  const {
    activate: networkActivate,
  } = useWeb3React(NetworkContextName);

  const login = useCallback((connectorID: ConnectorNames) => {
    const connector = connectorsByName[connectorID]
    if (connector) {
      activate(connector, async (error: Error) => {
        if (error instanceof UnsupportedChainIdError) {
          const hasSetup = await setupNetwork()
          if (hasSetup) {
            activate(connector)
            networkActivate(connector)
          }
        } else {
          toastError(error.name, error.message)
        }
      })
    } else {
      toastError("Can't find connector", 'The connector config is wrong')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { login, logout: deactivate }
}

export default useAuth
