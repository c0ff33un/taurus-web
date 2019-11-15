import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { persistStore, persistReducer } from 'redux-persist'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import storage from 'redux-persist/lib/storage'

import rootReducer from './Reducers'

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2
}
const loggerMiddleware = createLogger()
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = createStore(persistedReducer, applyMiddleware(thunkMiddleware, loggerMiddleware))
export const persistor = persistStore(store)
