import React from 'react'
import { connect } from 'react-redux'
import { wsConnect } from '../Redux/ducks/websockets'

class WebSocketConnection extends React.Component {
  componentDidMount() {
    const { dispatch, url, connected } = this.props
    if (!connected) {
      dispatch(wsConnect({ url }))
    }
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}

function mapStateToProps(state) {
  const { url, connected } = state.websockets
  return { url, connected }
}

export default connect(mapStateToProps)(WebSocketConnection)
