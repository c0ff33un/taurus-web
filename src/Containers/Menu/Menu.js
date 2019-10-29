import React from 'react';
import {Avatar, Button, CssBaseline, TextField,
  Link, Grid, Box, Container, Typography} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import { userActions } from '../../Redux/Actions'
import { connect } from 'react-redux';

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
  customBtn: {
    margin: theme.spacing(1, 0, 2),
  },
});


class Menu extends React.Component {
  constructor(props){
    super(props);
    this.performLogout = this.performLogout.bind(this);
  }

  performLogout(e)
  {
    e.preventDefault()
    this.props.logout()
    this.props.history.push('/menu')
  }

  render() {
    const { classes } = this.props;
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography  variant="h2">
            τrus
          </Typography>
          <Button fullWidth variant="contained" color="primary" className={classes.customBtn}>
            Join Room
          </Button>
          <Button fullWidth variant="contained" color="primary" className={classes.customBtn}>
            Create Room
          </Button>
          <Button fullWidth variant="contained" color="secondary" className={classes.customBtn} onClick={this.performLogout}>
            Logout
          </Button>
        </div>
      </Container>
    );
  }
}

function mapState(state) {
  const { logginIn } = state.authentication;
  return { logginIn }
}

const menuConnection = connect(mapState, {
  logout: userActions.logout
}) ( withStyles(styles)(Menu))

export default menuConnection