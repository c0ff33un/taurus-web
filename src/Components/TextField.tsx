import React from 'react' 
import { TextField as MaterialTextField, TextFieldProps } from '@material-ui/core'

function TextField(props: TextFieldProps) {
  const modifiedProps: TextFieldProps = {
    variant: "outlined",
    required: true,
    fullWidth: true,
    ...props
  }
  return (
    <MaterialTextField {...modifiedProps}/>
  )
}

export default TextField
