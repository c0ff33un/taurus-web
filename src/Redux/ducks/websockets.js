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
    const apiURL = process.env.REACT_APP_GAME_URL
    const calurl = `ws://${apiURL}/ws/${roomId}?token=${token}`
    console.log('calurl', calurl)
    return { type: WS_CONNECT, payload: { url: calurl }}
  }
  //const apiURL = process.env.REACT_APP_GAME_URL
  //url = `ws://${apiURL}/ws/${roomId}?token=${token}`
  return { type: WS_CONNECT, payload: { url }}
}

export function wsConnected(url) {
  const roomId = url.split("/")[5].split("?")[0]
  return { type: WS_CONNECTED, payload : { url, roomId }}
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
    case WS_CONNECTED:
      const { url, roomId } = action.payload
      return { ...state, connected: true, url, roomId }
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
