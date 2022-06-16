import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { save, load } from 'redux-localstorage-simple'

import farmsReducer from './farms'
import toastsReducer from './toasts'
import poolsReducer from './pools'
import pricesReducer from './prices'
import blockReducer from './block'

// dex
import application from '../packages/dex/state/application/reducer'
import { updateVersion } from '../packages/dex/state/global/actions'
import user from '../packages/dex/state/user/reducer'
import transactions from '../packages/dex/state/transactions/reducer'
import swap from '../packages/dex/state/swap/reducer'
import mint from '../packages/dex/state/mint/reducer'
import lists from '../packages/dex/state/lists/reducer'
import burn from '../packages/dex/state/burn/reducer'
import multicall from '../packages/dex/state/multicall/reducer'

import { getThemeCache } from '../packages/dex/utils/theme'

type MergedState = {
  user: {
    [key: string]: any
  }
  transactions: {
    [key: string]: any
  }
}
const PERSISTED_KEYS: string[] = ['user', 'transactions']

const loadedState = load({ states: PERSISTED_KEYS }) as MergedState

if (loadedState.user) {
  loadedState.user.userDarkMode = getThemeCache()
}

const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    farms: farmsReducer,
    toasts: toastsReducer,
    pools: poolsReducer,
    prices: pricesReducer,
    block: blockReducer,
    //
    // dex
    application,
    user,
    transactions,
    swap,
    mint,
    burn,
    multicall,
    lists,
  },
  middleware: [
    ...getDefaultMiddleware({ thunk: true }),
    save({ states: PERSISTED_KEYS }),
  ],
  preloadedState: loadedState,
})

store.dispatch(updateVersion())

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
