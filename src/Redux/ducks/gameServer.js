import { addMessage } from './messageLog'
import { GameControllerActions }from './gameController' 

const ADD_GAMESERVER_MESSAGE='ADD_GAMESERVER_MESSAGE'

export function addGameServerMessage(message) {
  const { setupGame, updatePlayer, addPlayer } = GameControllerActions
  return (dispatch) => {
    console.log('THE MESSAGE:', message)
    switch(message.type) {
      case "message":
        dispatch(addMessage(message))
        break;
      case "connect":
        const { id, handle } = message
        console.log(handle)
        dispatch(addPlayer(id))
        dispatch(addMessage({ text: "User " + handle + " Connected"}))
        break;
      case "move":
        dispatch(updatePlayer(message))
        break;
      case "setup":
        dispatch(setupGame(message))
        break;
      default:
        dispatch({ type: ADD_GAMESERVER_MESSAGE, payload: { message }})
    }
  }
}



const initialState={}
function gameServer(state=initialState, action) {
}

export default gameServer
