import { webSocketConstants, webSocketActions } from 'Redux/ducks/websockets'
import { finishLoading } from 'Redux/ducks/loading'
import { addGameServerMessage } from '../ducks/gameServer'
import { w3cwebsocket as WebSocket } from "websocket"


const socketMiddleware = () => {
  let socket = null
  const { wsConnected, wsDisconnected } = webSocketActions


  const onopen = store => () => {
    //console.log('WS opened')
    store.dispatch(wsConnected())
    store.dispatch(finishLoading())
  }

  const onclose = store => () => {
    console.log('WS closed')
    store.dispatch(wsDisconnected())
  }

  const onmessage = store => (event) => {
    const messages = event.data.split("\n")
    for (var i = 0; i < messages.length - 1; ++i) {
      const message = JSON.parse(messages[i])
      store.dispatch(addGameServerMessage(message))
    }
  }
  
  const onerror = store => (err) => {
    console.log('WS error', err)
    store.dispatch(finishLoading())
    alert('Error connecting to Server')
  }

  return store => next => action => {
    const { WS_CONNECT, WS_DISCONNECT, WS_MESSAGE } = webSocketConstants

    switch (action.type) {
      case WS_CONNECT:
        if (socket !== null) {
          socket.close()
        }
        const { url } = action.payload
        console.log('Connect to WS:', url)
        socket = new WebSocket(url)

        socket.onmessage = onmessage(store)
        socket.onclose = onclose(store)
        socket.onopen = onopen(store)
        socket.onerror = onerror(store)
        return next(action);
      case WS_DISCONNECT:
        if (socket !== null) {
          socket.close()
          socket = null
        }
        return next(action);
      case WS_MESSAGE:
        if (socket !== null) {
          socket.send(JSON.stringify(action.payload))
        } else {
          store.dispatch(wsDisconnected())
          console.error(`NO WS Connection can't send messages`)
        }
        return next(action)
      default:
        return next(action);
    }
  }
}

export default socketMiddleware()
