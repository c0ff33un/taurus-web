import React from 'react';
import {Avatar, Button, CssBaseline, TextField,
  Link, Grid, Box, Container, Typography} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';

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
  }

  componentWillMount(){ // THis is Wrong.... Culpa de juan camilo :v
    const user = localStorage.getItem('user')
    if (!user.jwt){
      this.props.history.push('/login')
    }
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
          <Button fullWidth variant="contained" color="secondary" className={classes.customBtn}>
            Logout
          </Button>
        </div>
      </Container>
    );
  }
}

export default withStyles(styles)(Menu)