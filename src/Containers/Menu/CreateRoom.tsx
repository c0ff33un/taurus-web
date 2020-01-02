import React from 'react'
import { Button } from 'Components'
import { useDispatch } from 'react-redux'
import { useTypedSelector } from 'Redux'
import { startLoading, finishLoading } from 'Redux/ducks/loading'
import { invalidateGame } from 'Redux/ducks/gameController'
import { invalidateMessages } from 'Redux/ducks/messageLog'
import { wsConnect } from 'Redux/ducks/websockets'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'


const CreateRoom = () => {
  const CREATE_ROOM = gql`
    mutation {
      room {
        id
      }
    }
  `
  const [createRoom, { data }] = useMutation(CREATE_ROOM)

  const dispatch = useDispatch()
  const loading = useTypedSelector(state => state.loading)
  if (loading && data) {
    dispatch(finishLoading())
    console.log(data)
    const roomId = data.room.id
    dispatch(wsConnect(roomId))
  }
  return (
    <Button
      color="primary"
      onClick={() => {
        dispatch(startLoading())
        dispatch(invalidateGame())
        dispatch(invalidateMessages())
        createRoom()
      }}
    >
      Create Game
    </Button>
  )
}

export default CreateRoom
