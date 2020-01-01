import * as React from 'react'
import Button from './Button'
import { ButtonProps } from '@material-ui/core'
import { Link, LinkProps } from 'react-router-dom'
type Props = LinkProps & ButtonProps
const ButtonLink = (props: Props) => {
  return <Button component={Link} {...props} />
}

export default ButtonLink

