import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { wsMessage } from 'Redux/ducks/websockets'

const useControls = () => {
  const [lastUsed, setLastUsed] = useState(new Date().getTime())
  const dispatch = useDispatch()

  const moveMessage = (direction: string) => {
    dispatch(wsMessage({ type: 'move', direction: direction }))
  }

  const onKeyDown = (event : React.KeyboardEvent<HTMLDivElement>) => {
    event.preventDefault()
    if (new Date().getTime() - lastUsed < 100) {
      return
    }
    setLastUsed(new Date().getTime())
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


  const onSwipeMove = (position: any, event: any) => {
    event.preventDefault()
    if (new Date().getTime() - lastUsed < 50) {
      return
    }
    setLastUsed(new Date().getTime())
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

  return { onKeyDown, onSwipeMove }
}

export default useControls
