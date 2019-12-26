import React, { Fragment, useState } from 'react'
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
import { withStyles } from '@material-ui/core/styles'
import { login, guestLogin } from '../../Redux/ducks/authentication'
import { startLoading } from '../../Redux/ducks/loading'
import { connect } from 'react-redux'
import ReCaptcha from '../../Components/ReCaptcha'


const styles = theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(16),
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
    margin: theme.spacing(1, 0, 1),
  },
})

function LoginFields(props) {
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const onChange = handler => { return event => handler(event.target.value) }
  console.log(email, password)
  return (
    <Fragment>
      <TextField
        variant="outlined"
        margin="normal"
        label="Email Address"
        autoComplete="email"
        autoFocus
        onChange={onChange(setEmail)}
      />
      <TextField
        variant="outlined"
        margin="normal"
        label="Password"
        type="password"
        autoComplete="new-password"
        onChange={onChange(setPassword)}
      /> 
    </Fragment>
  )
}

class Login extends React.Component {
  constructor(props) {
    //const reCaptcha = process.env.REACT_APP_NO_AUTH === undefined
    const reCaptcha = false
    super(props)
    this.state = {
      email: '',
      password: '',
      disabled: reCaptcha,
      reCaptcha
    }
  }

  verifyCallback = (recaptchaToken) => {
    this.setState({disabled:false})
  }

  performLoginGuest = e => {
    e.preventDefault()
    const { dispatch } = this.props
    dispatch(startLoading())
    dispatch(guestLogin())
  }

  render() {
    const { classes, loading } = this.props
    const { disabled, reCaptcha } = this.state
    return (
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Avatar className={classes.avatar} />
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} onSubmit={event => event.preventDefault()} noValidate>
            <LoginFields />
            <Grid container justify='center'>
              <Grid container item justify='center' xs={12}>
                {reCaptcha && <ReCaptcha 
                  visible={reCaptcha}
                  verifyCallback={this.verifyCallback}
                />}
              </Grid>
            </Grid>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={this.performLogin}
                  disabled={loading || disabled}
                >
                  Log In
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  className={classes.submit}
                  onClick={this.performLoginGuest}
                  disabled={loading || disabled}
                >
                  Guest
                </Button>
              </Grid>
            </Grid>
            <Grid container>
              {/*
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>   
              </Grid>
              */}
              <Grid item>
                <Link component={RouterLink} to="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
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
}

function mapStateToProps(state) {
  const { logginIn } = state.authentication
  return { logginIn, loading: state.loading }
}

export default connect(mapStateToProps)(withStyles(styles)(Login))
