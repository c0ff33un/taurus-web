import React from 'react' 
import { TextField as MaterialTextField } from '@material-ui/core'

function TextField(props) {
  return (
    <MaterialTextField
      variant="outlined"
      required
      fullWidth
      {...props}
    />
  )
}

export default TextField
