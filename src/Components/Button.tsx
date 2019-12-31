import React from 'react'
import { Button as MaterialButton, ButtonProps } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'

const styles = (theme: Theme) => ({
  submit: {
    margin: theme.spacing(2, 0, 1),
  },
})

const useStyles = makeStyles(styles)

function Button(props: ButtonProps) {
  const classes = useStyles()
  const loading = useSelector((state: any) => state.loading)
  const { disabled, ...rest } = props
  const modifiedProps: ButtonProps = {
    className: classes.submit,
    disabled: (loading || (disabled !== undefined && disabled)),
    variant: "contained",
    fullWidth: true,
    ...rest
  }
  if (!modifiedProps.disabled) {
    delete modifiedProps.disabled
  }
  return (
    <MaterialButton {...modifiedProps}>
      {props.children}
    </MaterialButton>
  )
}


export default Button
