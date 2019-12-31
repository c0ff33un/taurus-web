import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { wsMessage } from 'Redux/ducks/websockets'
import Swipe from 'react-easy-swipe'

class Board extends React.Component {
  constructor(props) {
    super(props)
    this.gameContainer = React.createRef()
    this.state = { lastPressed: new Date().getTime() }
  }

  componentDidMount() {
    console.log('focus')
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
    if (new Date().getTime() - lastPressed < 50) {
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

  onSwipeStart = event => {
    this.setState({ swipe: 'start' })
    console.log(event)
    //this.setState({ swipeStart: position })
  }

  onSwipeEnd = event => {
    this.setState({ swipe: 'end' })
    console.log(event)
    //console.log(this.state.swipeStart, position)
  }

  onSwipeMove = (position, event) => {
    event.preventDefault()
    const { lastPressed } = this.state
    if (new Date().getTime() - lastPressed < 50) {
      return
    }
    this.setState({ lastPressed: new Date().getTime() })
    if (Math.abs(position.x) > Math.abs(position.y)) {
      if (position.x > 0) {
        console.log('move right')
        this.moveMessage('right')
      } else {
        console.log('move left')
        this.moveMessage('left')
      }
    } else {
      if (position.y > 0) {
        console.log('move up')
        this.moveMessage('down')
      } else {
        console.log('move down')
        this.moveMessage('up')
      }
    }
  }


  render() {
    // const { gridItems } = this.props
    return (
      <Fragment>
      <Swipe
        onSwipeStart={this.onSwipeStart}
        onSwipeEnd={this.onSwipeEnd}
        onSwipeMove={this.onSwipeMove}
      >
        <div
          ref={this.gameContainer}
          className="Container"
          tabIndex="0"
          onKeyDown={this.keyPressed}
        >
          <div className="Board">{this.props.gridItems}</div>
        </div>
      </Swipe>
      </Fragment>
    )
  }
}

function mapStateToProps(state) {
  const { gameRunning } = state.gameController
  return { gameRunning }
}

export default connect(mapStateToProps)(Board)
