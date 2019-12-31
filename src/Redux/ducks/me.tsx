const SET_PLAYER='SET_PLAYER'
const INVALIDATE_PLAYER='INVALIDATE_PLAYER'

type Player = {
  id: string
  handle: string
}

interface setPlayerAction {
  type: typeof SET_PLAYER
  payload: Player
}
interface invalidatePlayerAction {
  type: typeof INVALIDATE_PLAYER
}
type MeActionTypes = setPlayerAction | invalidatePlayerAction

export function setPlayer(player: Player): MeActionTypes { return { type: SET_PLAYER, payload: player }}
export function invalidatePlayer(): MeActionTypes { return { type: INVALIDATE_PLAYER }}

const initialState : Player = {id: '', handle: ''}
export default function me(state=initialState, action: MeActionTypes): Player {
  switch(action.type) {
    case SET_PLAYER:
      return { ...action.payload }
    case INVALIDATE_PLAYER:
      return initialState
    default:
      return state
  }
}
