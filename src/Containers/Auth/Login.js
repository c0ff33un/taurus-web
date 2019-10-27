import React from 'react';
import {Avatar, Button, CssBaseline, TextField,
  Link, Grid, Box, Container, Typography} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';

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
      email: 'edwmapa@gmail.com',
      password: 'edwmapa'
    }
    this.performLogin = this.performLogin.bind(this);
  }

  performLogin(e){
    const url = "http://localhost:3000/login";
    const data = {
      'user':{
        'email': this.state.email,
        'password': this.state.password
      }
    }
    const fetchData = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        "Accept": "appplication/json",
        "Content-Type" : "application/json"
      }
    }

    fetch(url, fetchData)
    .then(response => {
      if (response.status !== 201){
        throw new Error(response.status);
      }else{
        return response.json();
      }
    })
    .catch(console.error)
    .then(json => {
      console.log(json)
    })
    
  }
  render() {
    const { classes } = this.props;
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
                  //type="submit"
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
                  //type="submit"
                  fullWidth
                  variant="contained"
                  color="secondary"
                  className={classes.submit}
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

export default withStyles(styles)(Login);