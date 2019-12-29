import * as React from 'react'
import { Link as MaterialLink, LinkProps as MaterialLinkProps } from '@material-ui/core'
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom'

type Props = RouterLinkProps & MaterialLinkProps
const Link = (props: Props) => {
  const { to, ...rest } = props
  return <MaterialLink component={RouterLink} to={to} {...rest}/>
}

export default Link
