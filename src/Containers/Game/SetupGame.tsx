import React from 'react'
import { Button } from 'Components'
import { useDispatch } from 'react-redux'
import { startLoading, finishLoading } from 'Redux/ducks/loading'
import { useTypedSelector } from 'Redux'
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag'

const CELL_SIZE = 25
const WIDTH = 625
const HEIGHT = 625

const SetupGame = () => {
  const { room, loading, gameRunning } = useTypedSelector(state => { 
    return { room: state.websockets.roomId, loading: state.loading, gameRunning: state.gameController.gameRunning } 
  })
  const seed = Math.floor(Math.random() * Math.pow(10, 9)) 
  const rows = HEIGHT / CELL_SIZE
  const cols = WIDTH / CELL_SIZE

  const SETUP_GAME = gql`
    mutation {
      roomSetup(room: "${room}", seed: ${seed}, rows: ${rows}, cols: ${cols}) {
        id
      }
    }
  `
  const [ setupGame, { /*loading : loadingMutation,*/ data } ] = useMutation(SETUP_GAME)
  const dispatch = useDispatch()
  if (loading && data) {
    dispatch(finishLoading())
  }
  return (
    <Button
      disabled={gameRunning}
      color="primary"
      onClick={() => {
        dispatch(startLoading())
        setupGame()
      }}
    >
      Setup Game
    </Button>
  )
}

export default SetupGame
