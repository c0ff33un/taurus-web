import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const GAME_SETUP='GAME_SETUP'
const GAME_START='GAME_START'
const GAME_FINISH='GAME_FINISH'
const INVALIDATE_GAME='INVALIDATE_GAME'
const ADD_PLAYER='ADD_PLAYER'
const REMOVE_PLAYER='REMOVE_PLAYER'
const UPDATE_PLAYER='UPDATE_PLAYER'


type Player = {
  x: number,
  y: number
}
type GameController = {
  gameSetup: boolean
  gameRunning: boolean
  grid: boolean[],
  length: number
  players: Record<string, Player>
}

interface setupGameAction {
  type: typeof GAME_SETUP
}
interface startGameAction {
  type: typeof GAME_START
  payload: boolean[]
}
interface finishGameAction {
  type: typeof GAME_FINISH
}
interface invalidateGameAction {
  type: typeof INVALIDATE_GAME
}
interface addPlayerAction {
  type: typeof ADD_PLAYER
  payload: {
    id: string,
    length: number
  }
}
interface removePlayerAction {
  type: typeof REMOVE_PLAYER
  payload: {
    id: string,
    length: number
  }
}
interface updatePlayerAction {
  type: typeof UPDATE_PLAYER
  payload: Player & { id: string }
}

type gameControllerActionTypes = setupGameAction | startGameAction | finishGameAction | invalidateGameAction | addPlayerAction | removePlayerAction | updatePlayerAction

export function setupGame() {
  return { type: GAME_SETUP }
}

export function startGame(message: { grid: boolean[] }) {
  return { type: GAME_START, payload: message.grid }
}

export function finishGame() {
  return { type: GAME_FINISH }
}

export function invalidateGame() {
  return { type: INVALIDATE_GAME }
}

export function addPlayer(id: string, length: number) {
  return { type: ADD_PLAYER, payload: { id, length }}
}

export function removePlayer(id: string, length: number) {
  return { type: REMOVE_PLAYER, payload: { id, length } }
}

export function updatePlayer(player: Player & { id: string }) {
  return { type: UPDATE_PLAYER, payload: player }
}

export const GameControllerActions = {
  setupGame,
  startGame,
  finishGame,
  invalidateGame,
  addPlayer,
  removePlayer,
  updatePlayer
}

const initialState: GameController ={ gameSetup: false, length: 0, gameRunning: false, grid: [], players: {} }


function gameController(state=initialState, action: gameControllerActionTypes): GameController {
  switch(action.type) {
    case INVALIDATE_GAME:
      return { ...state, gameSetup: false, gameRunning: false, grid: [], players: {}}
    case GAME_SETUP:
      return { ...state, gameSetup: true, gameRunning: false, grid: [], players: {} }
    case GAME_START:
      const grid = action.payload
      return { ...state, grid, gameRunning: true }
    case GAME_FINISH:
      return { ...state, gameSetup: false, gameRunning: false }
    case ADD_PLAYER: {
      const { length } = action.payload
      return { ...state, length }
    }
    case REMOVE_PLAYER: {
      const { length } = action.payload
      return { ...state, length }
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
}

export default persistReducer(persistConfig, gameController)
