import { combineReducers } from 'redux'
import gameController from './gameController'
import messageLog from './messageLog'
import loading from './loading'
import websockets from './websockets'
import login from './login'
import authenticated from './authenticated'
import registration from './registration'



export default combineReducers({
  loading,
  registration,
  login,
  gameController,
  messageLog,
  websockets,
  authenticated
})
