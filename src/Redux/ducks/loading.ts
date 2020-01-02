const START_LOADING='START_LOADING'
const FINISH_LOADING='FINISH_LOADING'

type Loading = boolean

interface startLoadingAction { type: typeof START_LOADING }
interface finishLoadingAction { type: typeof FINISH_LOADING }
type LoadingActionTypes = startLoadingAction | finishLoadingAction

export function startLoading(): LoadingActionTypes { return { type: START_LOADING } }
export function finishLoading(): LoadingActionTypes { return { type: FINISH_LOADING } }
export const loadingActions = {
  startLoading,
  finishLoading,
}

const initialState: Loading = false
export default function loading(state=initialState, action: LoadingActionTypes ) : Loading {
  switch (action.type) {
    case START_LOADING:
      return true
    case FINISH_LOADING:
      return false
    default:
      return state
  }
}
