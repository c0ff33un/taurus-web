const ADD_MESSAGE='ADD_MESSAGE'
const INVALIDATE_MESSAGES='INVALIDATE_MESSAGES'

type Message = { text: string }
type Messages = string[]

interface addMessageAction {
  type: typeof ADD_MESSAGE,
  payload: {
    text: string
  }
}
interface invalidateMessagesAction {
  type: typeof INVALIDATE_MESSAGES
}
type MessagesActionTypes = addMessageAction | invalidateMessagesAction

export function addMessage(message: Message): MessagesActionTypes {
  return { type: ADD_MESSAGE, payload: message }
}
export function invalidateMessages(): MessagesActionTypes {
  return { type: INVALIDATE_MESSAGES }
}

const initialState: Messages = []
function messageLog(state=initialState, action: MessagesActionTypes): Messages {
  switch(action.type) {
    case INVALIDATE_MESSAGES:
      return []
    case ADD_MESSAGE:
      const message = action.payload
      return [...state, message.text] 
    default:
      return state
  }
}

export default messageLog
