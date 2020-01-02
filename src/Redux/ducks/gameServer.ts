import { addMessage } from './messageLog'
import { GameControllerActions }from './gameController' 
import { batch } from 'react-redux'
import { Dispatch } from 'redux'

const capitalize = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const ADD_GAMESERVER_MESSAGE='ADD_GAMESERVER_MESSAGE'
//should be moved to middleware
export function addGameServerMessage(message: any) {
  const { setupGame, startGame, updatePlayer, addPlayer, removePlayer, finishGame } = GameControllerActions
  return (dispatch: Dispatch) => {
    switch(message.type) {
      case "message": {
        const { handle, text } = message
        dispatch(addMessage(`${handle}: ${text}`))
        break;
      }
      case "status": {
        const { id, handle, length, state } = message
        batch(() => {
          switch (state) {
          case "connect":
          case "reconnect":
            dispatch(addPlayer(id, length))
              break
          case "left":
            dispatch(removePlayer(id, length))
          }
          dispatch(addMessage(`> ${handle} ${capitalize(state)}.`))
        })
        break;
      }
      case "move":
        dispatch(updatePlayer(message))
        break;
      case "setup":
        dispatch(setupGame())
        break;
      case "start":
        dispatch(startGame(message))
        break;
      case "won": {
        const { handle } = message
        batch(() => {
          dispatch(addMessage(`User ${handle} Won`))
          dispatch(finishGame())
        })
        break;
      }
      default:
        dispatch({ type: ADD_GAMESERVER_MESSAGE, payload: { message }})
    }
  }
}
