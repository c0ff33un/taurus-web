import React from 'react'
import { connect } from 'react-redux'
import { wsMessage } from '../../Redux/ducks/websockets'

class Board extends React.Component {
  constructor(props) {
    super(props)
    this.gameContainer = React.createRef()
    this.state = { lastPressed: new Date().getTime() }
  }

  componentDidMount() {
    this.gameContainer.current.focus()
  }

  moveMessage = direction => {
    const { dispatch, gameRunning } = this.props
    if (gameRunning) {
      dispatch(wsMessage({ type: 'move', direction: direction }))
    }
  }

  keyPressed = event => {
    event.preventDefault()
    const { lastPressed } = this.state
    if (new Date().getTime() - lastPressed < 200) {
      return
    }
    this.setState({ lastPressed: new Date().getTime() })
    switch (event.key) {
      case 'a':
      case 'A':
      case 'ArrowLeft':
        this.moveMessage('left')
        break
      case 's':
      case 'S':
      case 'ArrowDown':
        this.moveMessage('down')
        break
      case 'w':
      case 'W':
      case 'ArrowUp':
        this.moveMessage('up')
        break
      case 'd':
      case 'D':
      case 'ArrowRight':
        this.moveMessage('right')
        break
      default:
        break
    }
  }

  render() {
    const { gridItems } = this.props
    return (
      <div
        ref={this.gameContainer}
        className="Container"
        tabIndex="0"
        onKeyDown={this.keyPressed}
      >
        <div className="Board">{this.props.gridItems}</div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { gameRunning } = state.gameController
  return { gameRunning }
}

export default connect(mapStateToProps)(Board)
