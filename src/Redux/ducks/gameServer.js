import { addMessage } from './messageLog'
import { GameControllerActions }from './gameController' 
import { batch } from 'react-redux'

const ADD_GAMESERVER_MESSAGE='ADD_GAMESERVER_MESSAGE'
//should be moved to middleware
export function addGameServerMessage(message) {
  const { setupGame, startGame, updatePlayer, addPlayer, finishGame } = GameControllerActions
  return (dispatch) => {
    console.log('THE MESSAGE:', message)
    switch(message.type) {
      case "message":
        dispatch(addMessage(message))
        break;
      case "connect": {
        const { id, handle } = message
        batch(() => {
          dispatch(addPlayer(id))
          dispatch(addMessage({ text: `User ${handle} Connected`}))
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
      case "win": {
        const { handle } = message
        batch(() => {
          dispatch(addMessage({ text: `User ${handle} Won` }))
          dispatch(finishGame(message))
        })
        break;
      }
      default:
        dispatch({ type: ADD_GAMESERVER_MESSAGE, payload: { message }})
    }
  }
}
