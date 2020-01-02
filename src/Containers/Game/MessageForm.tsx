import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { wsMessage } from 'Redux/ducks/websockets'
import { TextField } from 'Components'
import { useStyles } from 'Containers/styles'

const MessageForm = () => {
  const [message, setMessage] = useState('')
  const dispatch = useDispatch()
  const classes = useStyles()
  return (
    <form className={classes.form} noValidate onSubmit={e => {
        e.preventDefault()
        dispatch(wsMessage({type: "message", text: message }))
        setMessage('')
      }}>
      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        name="message form"
        label="Send message"
        type="string"
        id="send message"
        onChange={e => setMessage(e.target.value)}
        value={message}
      />
    </form>
  );
}

export default MessageForm
