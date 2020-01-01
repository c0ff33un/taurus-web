import React, { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { wsMessage } from 'Redux/ducks/websockets'
import { useTypedSelector } from 'Redux'
import Swipe from 'react-easy-swipe'

type Props = {
  gridItems: any
}
const Board = ({ gridItems }: Props) => {
  const gameContainer = useRef<HTMLDivElement>(null)
  const [lastPressed, setLastPressed] = useState(new Date().getTime())
  const dispatch = useDispatch()
  const gameRunning = useTypedSelector(state => state.gameController.gameRunning)
  
  useEffect(() => {
    const current = gameContainer.current
    if (current) {
      current.focus()
    }
  })

  const moveMessage = (direction: string) => {
    if (gameRunning) {
      dispatch(wsMessage({ type: 'move', direction: direction }))
    }
  }

  const keyPressed = (event: any) => {
    event.preventDefault()
    if (new Date().getTime() - lastPressed < 50) {
      return
    }
    setLastPressed(new Date().getTime())
    switch (event.key) {
      case 'a':
      case 'A':
      case 'ArrowLeft':
        moveMessage('left')
        break
      case 's':
      case 'S':
      case 'ArrowDown':
        moveMessage('down')
        break
      case 'w':
      case 'W':
      case 'ArrowUp':
        moveMessage('up')
        break
      case 'd':
      case 'D':
      case 'ArrowRight':
        moveMessage('right')
        break
      default:
        break
    }
  }

  const onSwipeStart = () => {
    //this.setState({ swipe: 'start' })
    //console.log(event)
    //this.setState({ swipeStart: position })
  }

  const onSwipeEnd = () => {
    //this.setState({ swipe: 'end' })
    //console.log(event)
    //console.log(this.state.swipeStart, position)
  }

  const onSwipeMove = (position: any, event: any) => {
    event.preventDefault()
    if (new Date().getTime() - lastPressed < 50) {
      return
    }
    setLastPressed(new Date().getTime())
    if (Math.abs(position.x) > Math.abs(position.y)) {
      if (position.x > 0) {
        console.log('move right')
        moveMessage('right')
      } else {
        console.log('move left')
        moveMessage('left')
      }
    } else {
      if (position.y > 0) {
        console.log('move up')
        moveMessage('down')
      } else {
        console.log('move down')
        moveMessage('up')
      }
    }
  }

  // const { gridItems } = this.props
  return (
    <>
      <Swipe
        onSwipeStart={onSwipeStart}
        onSwipeEnd={onSwipeEnd}
        onSwipeMove={onSwipeMove}
      >
        <div
          ref={gameContainer}
          className="Container"
          tabIndex={0}
          onKeyDown={keyPressed}
        >
          <div className="Board">{gridItems}</div>
        </div>
      </Swipe>
    </>
  )
}

export default Board
