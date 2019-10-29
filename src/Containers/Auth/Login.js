import React from 'react';
import {Avatar, Button, CssBaseline, TextField,
  Link, Grid, Box, Container, Typography} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import { userActions } from '../../Redux/Actions'
import { connect } from 'react-redux';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'τrus '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

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
});


class Login extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      email: 't2@mail.com',
      password: '123456'
    }
    this.performLogin = this.performLogin.bind(this);
    this.performLoginGuest = this.performLoginGuest.bind(this);
  }

  performLogin(e){
    e.preventDefault();

    this.props.login(this.state.email, this.state.password)
    .then(resp => {
      if(!resp.error){
        console.log('jasdf')
        this.props.history.push('/menu')
      }
    }).catch(error => console.log(error))
    
  }

  performLoginGuest(e){
    e.preventDefault();
    
    this.props.guestLogin()
    .then(resp => {
      if(!resp.error){
        this.props.history.push('/menu')
      }
    }).catch(error => console.log(error))
    
  }

  render() {
    const { classes, logginIn } = this.props;
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
          </Avatar>
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
              onChange={(e)=>{
                this.setState({email: e.target.value});
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
              onChange={(e)=>{
                this.setState({password: e.target.value});
              }}
              value={this.state.password}
            />
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={this.performLogin}
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
                >
                  Guest
                </Button>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>   
              </Grid>
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
    );
  }
}

function mapState(state) {
  const { logginIn } = state.authentication;
  return { logginIn }
}

const loginConnection = connect(mapState, {
  login: userActions.login,
  guestLogin: userActions.guestLogin,
  logout: userActions.logout
}) ( withStyles(styles)(Login))

export default loginConnection