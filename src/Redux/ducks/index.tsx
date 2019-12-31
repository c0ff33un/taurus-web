import { Reducer, combineReducers } from 'redux'
import gameController from './gameController'
import messageLog from './messageLog'
import loading from './loading'
import websockets from './websockets'
import login from './login'
import authenticated from './authenticated'
import registration from './registration'
import me from './me'

const rootReducer = combineReducers({
  loading,
  registration,
  login,
  gameController,
  messageLog,
  websockets,
  authenticated,
  me
})

export default rootReducer as Reducer<unknown>
export type RootState = ReturnType<typeof rootReducer> 
