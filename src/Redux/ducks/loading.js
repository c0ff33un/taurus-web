const START_LOADING='START_LOADING'
const FINISH_LOADING='FINISH_LOADING'

export const loadingActions = {
  startLoading,
  finishLoading,
}

export function startLoading() {
  return { type: START_LOADING }
}

export function finishLoading() {
  return { type: FINISH_LOADING }
}

export default function loading(state=false, action) {
  switch (action.type) {
    case START_LOADING:
      return true
    case FINISH_LOADING:
      return false
    default:
      return state
  }
}
