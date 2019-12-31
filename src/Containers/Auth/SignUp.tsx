import React, { Fragment } from 'react'
import { Avatar, Grid, Box, Container, Typography } from '@material-ui/core'
import { Button, TextField, Link, Copyright } from 'Components'
import { WithStyles, withStyles } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'
import { startLoading, finishLoading } from 'Redux/ducks/loading'
import { setEmail, setHandle, setPassword } from 'Redux/ducks/registration'
import { RootState } from 'Redux'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import styles from '../styles'

function SignUpButton() {
  const { loading, email, handle, password } = useSelector(
    (state: RootState) => {
      const { loading, registration } = state
      return { loading, ...registration }
    }
  )
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
    console.log('data', data)
  }
  var errors = null
  if (error) {
    console.log(error)
    errors = error.graphQLErrors.map(({ message }, i) => (
      <span key={i}>{message}</span>
    ))
  }
  return (
    <Fragment>
      <Button
        color="primary"
        onClick={() => {
          dispatch(startLoading())
          signUp().catch(err => {
            dispatch(finishLoading())
          })
        }}
      >
        Sign Up
      </Button>
      <pre>{errors !== null && errors}</pre>
    </Fragment>
  )
}

function SignUpForm() {
  const { email, handle, password } = useSelector(
    (state: RootState) => state.registration
  )
  const dispatch = useDispatch()
  const onChange = (handler: (arg0: string) => void) => {
    return (event: React.ChangeEvent<HTMLInputElement>) =>
      dispatch(handler(event.target.value))
  }

  return (
    <Fragment>
      <Grid item xs={12}>
        <TextField
          id="email"
          label="Email"
          autoComplete="email"
          onChange={onChange(setEmail)}
          value={email}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          id="handle"
          label="Username"
          autoComplete="nickname"
          onChange={onChange(setHandle)}
          value={handle}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          id="password"
          label="Password"
          autoComplete="new-password"
          onChange={onChange(setPassword)}
          value={password}
          type="password"
        />
      </Grid>
    </Fragment>
  )
}

interface Props extends WithStyles<typeof styles> {}

class SignUp extends React.Component<Props> {
  render() {
    const { classes } = this.props
    return (
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Avatar className={classes.avatar} />
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <form
            className={classes.form}
            onSubmit={event => event.preventDefault()}
            noValidate
          >
            <Grid container spacing={2}>
              <SignUpForm />
              <Grid item xs={12}>
                <SignUpButton />
              </Grid>
            </Grid>
            <Grid container justify="flex-end">
              <Grid item>
                <Link to="/" variant="body2">
                  Already have an account? Register here
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
