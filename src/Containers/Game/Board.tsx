import React, { useEffect, useRef } from 'react'
import Swipe from 'react-easy-swipe'
import useControls from './useControls'
import Grid from './Grid'
import Players from './Players'

const Board = () => {
  const gameContainer = useRef<HTMLDivElement>(null)
  const { onKeyDown, onSwipeMove } = useControls()
  useEffect(() => {
    const current = gameContainer.current
    if (current) {
      current.focus()
    }
  })

  return (
    <>
      <Swipe onSwipeMove={onSwipeMove}>
        <div
          ref={gameContainer}
          className="Container"
          tabIndex={0}
          onKeyDown={onKeyDown}
        >
            <div className="Board">
              <Grid />
              <Players />
            </div>
        </div>
      </Swipe>
    </>
  )
}

export default Board
