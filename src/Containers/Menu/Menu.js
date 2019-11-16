import React from 'react'
import {Button, TextField, Container, Typography, Grid} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { userActions, loadingActions } from '../../Redux/Actions'
import { connect } from 'react-redux'

const styles = theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  paper: {
    marginTop: theme.spacing(16),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
});


class Menu extends React.Component {
  constructor(props){
    super(props)
    this.performLogout = this.performLogout.bind(this)
    this.state = { roomid: '' }
  }

  performLogout = (e) => {
    e.preventDefault()
    this.props.startLoading()
    this.props.logout()
  }

  createRoom = (event) => {
    const apiURL = process.env.REACT_APP_API_URL
    const token = this.props.token
    const options = {
      headers : {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json',
        'Authorization' : `Bearer ${token}`
      },
      method : 'POST',
      body : JSON.stringify({"query": "mutation{room{id}}"})
    }
    this.props.startLoading()
    fetch(`${apiURL}`, options)
    .then(response => response.json())
    .then(json => {
      const roomid = json.data.room.id
      this.props.connect(roomid, token)
    })
    .catch(error => {
    })
  }
  
  joinRoom = (event) => {
    event.preventDefault()
    const { roomid } = this.state
    const token = this.props.token
    this.props.startLoading()
    this.props.connect(roomid, token)
  }

  handleChange = (event, name) => {
    event.preventDefault()
    this.setState({[name] : event.target.value})
  }

  render() {
    const { classes } = this.props
    console.log(this.props.loading)
    return (
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Typography  variant="h2">
            τrus
          </Typography>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                  <Button 
                    fullWidth 
                    disabled={this.props.loading}
                    variant="contained" 
                    color="primary" 
                    className={classes.customBtn} 
                    onClick={this.createRoom}>
                    Create Room
                  </Button>
              </Grid>
              <Grid item container direction='row' justify='space-between'>
                <Grid item>
                  <TextField
                    variant="outlined"
                    required
                    name="roomId"
                    label="Room Id"
                    type="string"
                    id="roomid"
                    onChange={(event) => this.handleChange(event, "roomid")}
                    value={this.state.roomid}
                  />
                </Grid>
                <Grid item>
                    <Button
                      style={{height: "100%"}}
                      disabled={this.props.loading}
                      fullWidth 
                      variant="contained" 
                      color="primary" 
                      size="large"
                      onClick={this.joinRoom}>
                      Join Room
                    </Button>
                </Grid>  
              </Grid>
              <Grid item xs={12}>
                <Button 
                  fullWidth 
                  disabled={this.props.loading}
                  variant="contained" 
                  color="secondary" 
                  className={classes.customBtn} 
                  onClick={this.performLogout}>
                      Logout
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  const { logginIn, user } = state.authentication
  return { logginIn, token: user.token, loading: state.loading }
}

export default connect(mapStateToProps, {
  logout: userActions.logout,
  startLoading: loadingActions.startLoading,
  finishLoading: loadingActions.finishLoading,
}) ( withStyles(styles)(Menu))
