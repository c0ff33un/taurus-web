const GAME_SETUP='GAME_SETUP'
const INVALIDATE_GAME='INVALIDATE_GAME'
const ADD_PLAYER='ADD_PLAYER'
const UPDATE_PLAYER='UPDATE_PLAYER'

export const GameControllerActions = {
  setupGame,
  invalidateGame,
  addPlayer,
  updatePlayer
}

export function setupGame(message) {
  return { type: GAME_SETUP, payload: message }
}

export function invalidateGame() {
  return { type: INVALIDATE_GAME }
}

export function addPlayer(id) {
  return { type: ADD_PLAYER, payload: { id }}
}

export function updatePlayer(message) {
  return { type: UPDATE_PLAYER, payload: message }
}

const initialState={ gameSetup: false, grid: null, players: {} }

function gameController(state=initialState, action) {
  switch(action.type) {
    case INVALIDATE_GAME:
      return {...state, gameSetup: false, grid: null }
    case GAME_SETUP:
      console.log('GAME_SETUP')
      const { grid } = action.payload
      return {...state, gameSetup: true, grid }
    case ADD_PLAYER: {
      const { id } = action.payload
      return {...state, players: {
        ...state.players,
        [id] : {}
      }}
    }
    case UPDATE_PLAYER:
      const { id, x, y } = action.payload
      return {...state, players: {
        [id] : {x, y}
      }}
    default:
      return state
  }
}

export default gameController
