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

interface wsMessageAction {
  type: typeof WS_MESSAGE
  payload: any
}

interface wsConnectAction {
  type: typeof WS_CONNECT 
  payload: {
    roomId: string,
    url: string
  }
}

export function wsConnect(roomId: string): WebSocketsActions {
  console.log(process.env.REACT_APP_DOMAIN)
  const calurl = `ws://localhost:4000/ws/${roomId}`
  return { type: WS_CONNECT, payload: {roomId, url: calurl} }
}

interface wsConnectedAction {
  type: typeof WS_CONNECTED
}
export function wsConnected(): WebSocketsActions {
  return { type: WS_CONNECTED }
}


interface wsDisconnect {
  type: typeof WS_DISCONNECT
}
export function wsDisconnect() {
  return { type: WS_DISCONNECT }
}

interface wsDisconnectedAction {
  type: typeof WS_DISCONNECTED
}
export function wsDisconnected(): WebSocketsActions {
  return { type: WS_DISCONNECTED }
}

export function wsMessage(message: any): WebSocketsActions  {
  return { type: WS_MESSAGE, payload: message }
}

type WebSocketsActions = wsConnectAction | wsConnectedAction | wsDisconnect | wsDisconnectedAction | wsMessageAction

export const webSocketActions = {
  wsConnect,
  wsConnected,
  wsDisconnect,
  wsDisconnected,
  wsMessage
}

type WebSockets = {
  connected: boolean,
  url: string,
  roomId: string
}

const initialState: WebSockets = { connected: false, url: '', roomId: '' }
function websockets(state=initialState, action: WebSocketsActions): WebSockets {
  switch(action.type) {
  case WS_CONNECT:
    const { roomId, url } = action.payload
    return { ...state, roomId, url }
  case WS_CONNECTED:
    return { ...state, connected: true }
  case WS_DISCONNECT:
    return initialState
  case WS_DISCONNECTED:
    return { ...state, connected: false }
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
