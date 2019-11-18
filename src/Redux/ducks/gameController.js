import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const GAME_SETUP='GAME_SETUP'
const GAME_START='GAME_START'
const INVALIDATE_GAME='INVALIDATE_GAME'
const ADD_PLAYER='ADD_PLAYER'
const UPDATE_PLAYER='UPDATE_PLAYER'

export const GameControllerActions = {
  setupGame,
  startGame,
  invalidateGame,
  addPlayer,
  updatePlayer
}

export function setupGame() {
  return { type: GAME_SETUP }
}

export function startGame(message) {
  return { type: GAME_START, payload: message }
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

const initialState={ gameSetup: false, focusGame: false, grid: null, players: {} }

function gameController(state=initialState, action) {
  switch(action.type) {
    case INVALIDATE_GAME:
      return { ...state, focusGame: false, gameSetup: false, grid: null, players: {}}
    case GAME_SETUP:
      return { ...state, gameSetup: true }
    case GAME_START:
      const { grid } = action.payload
      return { ...state, grid, focusGame: true}
    case ADD_PLAYER: {
      const { id } = action.payload
      return { ...state, players: {
        ...state.players,
        [id] : {}
      }}
    }
    case UPDATE_PLAYER:
      const { id, x, y } = action.payload
      return {...state, players: {
        ...state.players,
        [id] : {x, y}
      }}
    default:
      return state
  }
}

const persistConfig = {
  key : 'gameController',
  storage: storage,
  blacklist: ['focusGame']
}

export default persistReducer(persistConfig, gameController)
