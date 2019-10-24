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

class SignUp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: 'Jonathan',
            handle: '',
            email: '',
            password: ''
        }
        this.performSignUp = this.performSignUp.bind(this);
    }

    performSignUp(e) {
        e.preventDefault()

        const url = 'http://localhost:3000/signup'

        var data = {
            user: this.state
        }

        var requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }

        fetch(url,requestOptions)
            .then(res => res.json())
            .catch(error=> console.log('Error:', error))
            .then( response => console.log('Success', response))
    }

    render () {
    const {classes} = this.props
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
                <Link href="/login" variant="body2">
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

export default withStyles(styles)(SignUp);