import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import { useDispatch, batch } from 'react-redux'
import { invalidateGame } from 'Redux/ducks/gameController'
import { invalidateMessages } from 'Redux/ducks/messageLog'
import { wsMessage, wsDisconnect } from 'Redux/ducks/websockets'
import { useTypedSelector } from 'Redux'
import {
  Grid,
  Typography,
} from '@material-ui/core'
import { Button, Dialog } from 'Components'

import SetupGame from './SetupGame'
import StartGame from './StartGame'

const GameController = () => {
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()
  const { connected, roomId, length } = useTypedSelector(state => {
    const websockets = state.websockets
    return { connected: websockets.connected, roomId: websockets.roomId, length: state.gameController.length }
  })

  const goToMenu = () => {
    batch(() => {
      dispatch(wsMessage({ type: 'leave' }))
      dispatch(wsDisconnect())
      dispatch(invalidateGame())
      dispatch(invalidateMessages())
    })
  }

  const goToMenuDialog = () => {
    if (length === 1) {
      setOpen(true)
      return
    }
    goToMenu()
  }

  const handleAgree = () => {
    goToMenu()
  }

  return (
    <>
      {connected ? (
        <>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle1">
                RoomId: {roomId}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <SetupGame />
            </Grid>
            <Grid item xs={6}>
              <StartGame />
            </Grid>
            <Grid item xs={12}>
              <div>
                <Button color="secondary" onClick={goToMenuDialog}>
                  Return to menu
                </Button>
                <Dialog
                  title={"Leave Room"}
                  text={"You are the last player in the room. The room will be destroyed."}
                  agreeText='Leave'
                  open={open}
                  setOpen={setOpen}
                  handleAgree={handleAgree}
                />
              </div>
            </Grid>
          </Grid>
        </>
      ) : (
        <Redirect to={'/menu'} />
      )}
    </>
  )
}

export default GameController
