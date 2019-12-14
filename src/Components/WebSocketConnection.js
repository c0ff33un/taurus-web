import React from 'react'
import { connect } from 'react-redux'
import { wsConnect } from '../Redux/ducks/websockets'

class WebSocketConnection extends React.Component {
  componentDidMount() {
    const { dispatch, url, roomId, connected } = this.props
    if (!connected && url) {
      alert('Connection Lost, attempting to Reconnect')
      dispatch(wsConnect({ url, roomId }))
    }
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}

function mapStateToProps(state) {
  const { url, roomId, connected } = state.websockets
  return { url, roomId, connected }
}

export default connect(mapStateToProps)(WebSocketConnection)
