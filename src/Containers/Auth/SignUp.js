import React from 'react';
import {Avatar, Button, CssBaseline, TextField,
  Link, Grid, Box, Container, Typography} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
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

class SignUp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            handle: '',
            email: '',
            password: ''
        }
        this.performSignUp = this.performSignUp.bind(this);
    }

    performSignUp(e) {
        e.preventDefault()
        this.props.register(this.state)
        .then(response => {
          console.log(response)
          if(!response.error) {
            this.props.history.push("/")
          } else {
            alert("Register Error")
          }
        })
    }

    render () {
    const { classes } = this.props
    return (
        <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
            <Avatar className={classes.avatar}>
            </Avatar>
            <Typography component="h1" variant="h5">
            Sign up
            </Typography>
            <form className={classes.form} noValidate>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="handle"
                    label="User Handle"
                    name="handle"
                    autoComplete="handle"
                    onChange={ (e) => this.setState({handle:e.target.value }) }
                    vaule = {this.state.handle}
                />
                </Grid>
                <Grid item xs={12}>
                <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    onChange={ (e) => this.setState({email:e.target.value }) }
                    vaule = {this.state.email}
                />
                </Grid>
                <Grid item xs={12}>
                <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    onChange={ (e) => this.setState({password:e.target.value }) }
                    vaule = {this.state.password}
                />
                </Grid>
            </Grid>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={this.performSignUp}
            >
                Sign Up
            </Button>
            <Grid container justify="flex-end">
                <Grid item>
                <Link href="/" variant="body2">
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
    );
   } 
}

function mapState(state) {
  const { registering } = state.registration;
  return { registering };
}

const registerConnection = connect( mapState, { register: userActions.register } )( withStyles(styles)(SignUp) )
export default registerConnection
