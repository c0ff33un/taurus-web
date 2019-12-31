import React from 'react'
import { Button } from 'Components'
import { useDispatch } from 'react-redux'
import { startLoading, finishLoading } from 'Redux/ducks/loading'
import { useTypedSelector } from 'Redux'
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag'

const StartGame = () => {
  const { room, loading, gameRunning, gameSetup } = useTypedSelector(state => { 
    const { websockets, gameController, loading } = state
    return { room: websockets.roomId, loading, gameRunning: gameController.gameRunning, gameSetup: gameController.gameSetup } 
  })

  const START_GAME = gql`
    mutation {
      roomStart(room: "${room}") {
        id
      }
    }
  `
  const [ startGame, { /*loading : loadingMutation,*/ data } ] = useMutation(START_GAME)
  const dispatch = useDispatch()
  if (loading && data) {
    dispatch(finishLoading())
  }
  return (
    <Button
      disabled={gameRunning || !gameSetup }
      color="primary"
      onClick={() => {
        dispatch(startLoading())
        startGame()
      }}
    >
      Start Game
    </Button>
  )
}

export default StartGame
