import React, { Fragment } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Avatar,
  Button,
  Link,
  Grid,
  Box,
  Container,
  Typography,
} from '@material-ui/core'
import { TextField, Copyright } from '../../Components'
import { withStyles, makeStyles } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'
import { startLoading, finishLoading } from '../../Redux/ducks/loading'
import { setEmail, setHandle, setPassword } from '../../Redux/ducks/registration'

import { gql } from 'apollo-boost'
import { useMutation } from '@apollo/react-hooks'

const styles = theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
})

const useStyles = makeStyles(styles)

function SignUpButton(props) {
  const classes = useStyles()
  const { loading, email, handle, password }  = useSelector(state => {
    const { loading, registration } = state
    return { loading, ...registration }
  })
  const dispatch = useDispatch()

  const SIGN_UP = gql`
    mutation {
      signup(email: "${email}", handle: "${handle}", password: "${password}") {
        handle
        email
      }
    }
  `
  const [signUp, { error, data }] = useMutation(SIGN_UP, { errorPolicy: 'all' })
  if (loading && data) {
    dispatch(finishLoading())
  } 
  var errors = null
  if (error) {
    errors = error.graphQLErrors.map(({ message }, i) => (<span key={i}>{message}</span>) )
  }
  return (
    <Fragment>
      <Button
        disabled={loading}
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
        onClick={() => {
          dispatch(startLoading())
          signUp().catch(err => {
            dispatch(finishLoading())
          })
        }}
      >
        Sign Up
      </Button>
      <pre>
        {errors !== null && errors}
      </pre>
    </Fragment>
  )
}



function SignUpForm(props) {
  const { email, handle, password } = useSelector(state => state.registration)
  const dispatch = useDispatch()
  const onChange = handler => { return event => dispatch(handler(event.target.value)) }

  return (
    <Fragment>
      <Grid item xs={12}>
        <TextField label="Email" autoComplete="email" onChange={onChange(setEmail)} value={email} />
      </Grid>
      <Grid item xs={12}>
        <TextField label="Username" autoComplete="nickname" onChange={onChange(setHandle)} value={handle} />
      </Grid>
      <Grid item xs={12}>
        <TextField label="Password" autoComplete="new-password" onChange={onChange(setPassword)} value={password} type="password"/>
      </Grid>
    </Fragment>
  )
}

class SignUp extends React.Component {
  render() {
    const { classes } = this.props
    return (
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Avatar className={classes.avatar} />
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <form className={classes.form} onSubmit={event => event.preventDefault()} noValidate>
            <Grid container spacing={2}>
              <SignUpForm />
              <Grid item xs={12}>
                <SignUpButton />
              </Grid>
            </Grid>
            <Grid container justify="flex-end">
              <Grid item>
                <Link component={RouterLink} to="/" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={5}>
          <Copyright />
        </Box>
      </Container>
    )
  }
}

export default withStyles(styles)(SignUp)
