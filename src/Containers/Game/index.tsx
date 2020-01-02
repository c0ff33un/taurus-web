import React from 'react'
import './Game.scss'
import { Container } from '@material-ui/core'
import WebSocketConnection from 'Components/WebSocketConnection'
import GameController from './GameController'
import MessageList from './MessageList'
import MessageForm from './MessageForm'
import Board from './Board'
import { useStyles } from '../styles'
import { useTypedSelector } from 'Redux'

const Game = () => {
  const classes = useStyles()
  const grid = useTypedSelector(state => state.gameController.grid)
  const shouldRenderBoard = grid.length !== 0
  return (
    <WebSocketConnection>
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <GameController />
          <MessageList />
          <MessageForm />
          {shouldRenderBoard && <Board />}
        </div>
      </Container>
    </WebSocketConnection>
  )
}

export default Game
