import React from 'react'
import {
  Avatar,
  Grid,
  Box,
  Container,
  Typography,
} from '@material-ui/core'
import { Button, TextField, Copyright, Link, PeekPassword } from 'Components'
import { batch, useDispatch } from 'react-redux'
import { startLoading, finishLoading } from 'Redux/ducks/loading'
import { setEmail, setPassword, cleanCredentials } from 'Redux/ducks/login'
import { setPlayer } from 'Redux/ducks/me'
import { useTypedSelector } from 'Redux'
import { setAuthenticated } from 'Redux/ducks/authenticated'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import { useStyles } from '../styles'

function LoginFields() {
  const { email, password, loading } = useTypedSelector(state => {
    return {
      ...state.login,
      loading: state.loading
    }
  })
  const dispatch = useDispatch()
  const onChange = (handler: (arg0: string) => void) => { 
    return (event: React.ChangeEvent<HTMLInputElement>) => dispatch(handler(event.target.value)) 
  }
  const LOGIN = gql`
    mutation {
      login(email: "${email}", password: "${password}") {
        player {
          id
          email
          handle
        }
        token
      }
    }
  `
  const [login, {error, data}] = useMutation(LOGIN)
  if (loading && data) {
    if (!error) {
      const { player } = data.login
      console.log(player)
      batch(() => {
        dispatch(cleanCredentials())
        dispatch(setAuthenticated())
        dispatch(setPlayer(player))
      })
    }
    dispatch(finishLoading())
  }
  var errors = null
  if (error) {
    errors = error.graphQLErrors.map(({ message }, i) => (<span key={i}>{message}</span>) )
  }
  return (
    <>
      <TextField
        margin="normal"
        label="Email Address"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={onChange(setEmail)}
      />
      <PeekPassword
        margin="normal"
        label="Password"
        autoComplete="current-password"
        value={password}
        onChange={onChange(setPassword)}
      /> 
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Button
            color="primary"
            onClick={() => {
              dispatch(startLoading())
              login().catch(err => {
                dispatch(finishLoading())
              })
            }}
          >
            Log In
          </Button>
        </Grid>
      </Grid>
      <pre>
        {errors !== null && errors}
      </pre>
    </>
  )
}

const Login = () => {
  const classes = useStyles()
  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar} />
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} autoComplete={"on"} onSubmit={event => event.preventDefault()} noValidate>
          <LoginFields />
          <Grid container>
            {/*
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>   
            </Grid>
            */}
            <Grid item xs>
              <Link to="/signup" variant="body2">
                {"Don't have an account? Register here"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  )
}

export default Login
