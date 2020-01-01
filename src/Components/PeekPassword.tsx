import React, { useState } from 'react'
import TextField from './TextField'
import { InputAdornment, IconButton, TextFieldProps } from '@material-ui/core'
import { Visibility, VisibilityOff } from '@material-ui/icons'

type Props = TextFieldProps
const PeekPassword = ({ InputProps: IP, ...rest }: Props) => {
  const [showPassword, setShowPassword] = useState(false)
  const InputProps = {
    endAdornment: (
      <InputAdornment position="end">
        <IconButton
          aria-label="toggle password visibility"
          onClick={() => {
            setShowPassword(!showPassword)
          }}
          onKeyDown={e => {
            e.preventDefault()
          }}
        >
          {showPassword ? <Visibility /> : <VisibilityOff />}
        </IconButton>
      </InputAdornment>
    ),
    ...IP,
  }
  return (
    <TextField
      type={showPassword ? 'text' : 'password'}
      InputProps={InputProps}
      {...rest}
    />
  )
}

export default PeekPassword
