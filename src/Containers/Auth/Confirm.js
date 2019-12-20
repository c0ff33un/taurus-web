import React from 'react';
import { Box, Container, Typography, CircularProgress } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { register } from '../../Redux/ducks/registration'
import { connect } from 'react-redux';

import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';


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

function ConfirmHook(props) {
  const { token } = props
  const CONFIRMATION = gql`
    mutation {
      confirmAccount(token: "${token}") {
        id
        handle
        email
        guest
      }
    }
  `;
  const [confirmation, { error, data, loading, called }] = useMutation(CONFIRMATION, {errorPolicy: 'all', onError: (errors)=>{}})
  
  if (loading) {
    return <CircularProgress />
  }
  if (error) {
    return <div> Error! Sorry :( </div>
  }
  if (called) {
    if (data && data.confirmation.id){
      return <div> Confirmed!</div>
    } else {
      return <div> Error! Sorry2 :(</div>
    }
  } else {
    confirmation()
    return <CircularProgress />
  }
}

class Confirm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        token : this.props.match.params.token,
    }
  }
    
  render () {
    const { classes } = this.props

    return (
        <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <ConfirmHook token={this.state.token} />
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
  console.log("AAAAAA",registering)
  return { registering };
}

const registerConnection = connect( mapState, { register } )( withStyles(styles)(Confirm) )
export default registerConnection
