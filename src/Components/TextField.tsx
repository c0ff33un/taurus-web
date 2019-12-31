import React from 'react' 
import { TextField as MaterialTextField, TextFieldProps } from '@material-ui/core'
import { useSelector } from 'react-redux'

function TextField(props: TextFieldProps) {
  const loading = useSelector((state: any) => state.loading)
  const { disabled, ...rest } = props
  const modifiedProps: TextFieldProps = {
    variant: "outlined",
    required: true,
    fullWidth: true,
    disabled: (loading || (disabled !== undefined && disabled)),
    ...rest
  }
  return (
    <MaterialTextField {...modifiedProps}/>
  )
}

export default TextField
