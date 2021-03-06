import { createStore, applyMiddleware } from 'redux'
import { useSelector, TypedUseSelectorHook } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { persistStore, persistReducer } from 'redux-persist'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import storage from 'redux-persist/lib/storage'
import wsMiddleware from './Middleware/websocket'
import rootReducer, { RootState as DucksRootState } from './ducks'

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2,
  blacklist: ['websockets', 'gameController', 'loading']
}

const loggerMiddleware = createLogger()
const persistedReducer = persistReducer(persistConfig, rootReducer)
const log = process.env.NODE_ENV === 'development'

const middleware = [
  thunkMiddleware,
  wsMiddleware,
]

if (log) {
  middleware.push(loggerMiddleware)
}

export type RootState = DucksRootState
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector
export const store = createStore(persistedReducer, applyMiddleware(...middleware))
export const persistor = persistStore(store)
