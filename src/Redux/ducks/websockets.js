import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const WS_CONNECT='WS_CONNECT'
const WS_CONNECTING='WS_CONNECTING'
const WS_CONNECTED='WS_CONNECTED'
const WS_DISCONNECT='WS_DISCONNECT'
const WS_DISCONNECTED='WS_DISCONNECTED'
const WS_MESSAGE='WS_MESSAGE'
const WS_ERROR='WS_ERROR'


export const webSocketConstants = {
  WS_CONNECT,
  WS_ERROR,
  WS_CONNECTING,
  WS_CONNECTED,
  WS_DISCONNECT,
  WS_DISCONNECTED,
  WS_MESSAGE
}


export const webSocketActions = {
  wsConnect,
  wsConnected,
  wsDisconnected,
  wsMessage
}

export function wsConnect(parameters) {
  const { token, roomId, url } = parameters
  if (url === undefined) {
    const gameWSURL = process.env.REACT_APP_GAME_WS_URL
    const calurl = `${gameWSURL}/ws/${roomId}?token=${token}`
    return { type: WS_CONNECT, payload: { url: calurl, roomId }}
  }
  //const apiURL = process.env.REACT_APP_GAME_URL
  //url = `ws://${apiURL}/ws/${roomId}?token=${token}`
  return { type: WS_CONNECT, payload: { url, roomId }}
}

export function wsConnected() {
  return { type: WS_CONNECTED }
}

export function wsDisconnect() {
  return { type: WS_DISCONNECT }
}

export function wsDisconnected() {
  return { type: WS_DISCONNECTED }
}

export function wsMessage(message) {
  return { type: WS_MESSAGE, payload: message }
}

const initialState = { connected: false, url: null, roomId: null  }
function websockets(state=initialState, action) {
  switch(action.type) {
    case WS_CONNECT: {
      const { url, roomId } = action.payload
      return { ...state, url, roomId }
    }
    case WS_CONNECTED:
      return { ...state, connected: true }
    case WS_DISCONNECTED:
      return { ...state, connected: false, url: null, roomId: null }
    default:
      return state
  }
}

const persistConfig = {
  key: 'websockets',
  storage: storage,
  blacklist: ['connected']
}

export default persistReducer(persistConfig, websockets)
