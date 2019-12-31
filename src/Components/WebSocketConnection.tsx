import React from 'react'
import { connect } from 'react-redux'
import { wsConnect } from 'Redux/ducks/websockets'


type Props = {
  url: string,
  roomId: string,
  connected: boolean,
  children: React.ReactNode,
  dispatch: any
}

class WebSocketConnection extends React.Component<Props> {
  componentDidMount() {
    const { dispatch, roomId, connected } = this.props
    if (!connected) {
      alert('Connection Lost, attempting to Reconnect')
      dispatch(wsConnect(roomId))
    }
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}

function mapStateToProps(state: any) {
  const { roomId, connected } = state.websockets
  return {  roomId, connected }
}

export default connect(mapStateToProps)(WebSocketConnection)
