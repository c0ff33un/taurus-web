const ADD_MESSAGE='ADD_MESSAGE'
const INVALIDATE_MESSAGES='INVALIDATE_MESSAGES'
const initialState = []

export function addMessage(message) {
  return { type: ADD_MESSAGE, payload: { message }}
}

export function invalidateMessages() {
  return { type: INVALIDATE_MESSAGES }
}

function messageLog(state=initialState, action) {
  switch(action.type) {
    case INVALIDATE_MESSAGES:
      return []
    case ADD_MESSAGE:
      const { message } = action.payload
      return [...state, message.text] 
    default:
      return state
  }
}

export default messageLog
