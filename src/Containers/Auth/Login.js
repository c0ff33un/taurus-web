import React from 'react'
import {
  Avatar,
  Button,
  TextField,
  Link,
  Grid,
  Box,
  Container,
  Typography,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { login, guestLogin } from '../../Redux/ducks/authentication'
import { startLoading } from '../../Redux/ducks/loading'
import { connect } from 'react-redux'
import ReCaptcha from '../../Components/ReCaptcha'

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'τrus '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

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

  performLogin = e => {
    e.preventDefault()
    const { dispatch } = this.props
    const { email, password } = this.state
    dispatch(startLoading())
    dispatch(login(email, password))
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
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={e => {
                this.setState({ email: e.target.value })
              }}
              value={this.state.email}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={e => {
                this.setState({ password: e.target.value })
              }}
              value={this.state.password}
            /> 
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
                <Link href="signup" variant="body2">
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
