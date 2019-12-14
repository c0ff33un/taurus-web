import { combineReducers } from 'redux'
import gameController from './gameController'
import messageLog from './messageLog'
import loading from './loading'
import websockets from './websockets'
import authentication from './authentication'
import registration from './registration'

export default combineReducers({
  loading,
  registration,
  authentication,
  gameController,
  messageLog,
  websockets
})
