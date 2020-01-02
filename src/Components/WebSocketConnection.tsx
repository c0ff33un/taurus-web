import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useTypedSelector } from 'Redux'
import { wsConnect } from 'Redux/ducks/websockets'

type Props = {
  children: React.ReactNode
}

const WebSocketConnection = ({ children }: Props) => {
  const dispatch = useDispatch()
  const { roomId, connected } = useTypedSelector(state => state.websockets)
  useEffect(() => {
    if (!connected && roomId !== '') {
      dispatch(wsConnect(roomId))
    }
  })
  return <div>{children}</div>
}

export default WebSocketConnection
