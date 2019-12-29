import React, { Fragment } from 'react'
import { Redirect } from 'react-router-dom'
import { Button, TextField } from '../../Components'
import { Container, Typography, Grid } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { connect, batch, useSelector, useDispatch } from 'react-redux'
import { startLoading, finishLoading } from '../../Redux/ducks/loading'
import { invalidateGame } from '../../Redux/ducks/gameController'
import { invalidateMessages } from '../../Redux/ducks/messageLog'
import { wsConnect } from '../../Redux/ducks/websockets'
import { setUnAuthenticated } from '../../Redux/ducks/authenticated'

import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks';

const styles = theme => ({
  body: {
      backgroundColor: theme.palette.common.white,
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

function CreateRoom(props) {
  const CREATE_ROOM = gql`
    mutation {
      room {
        id
      }
    }
  `
  const [ createRoom, { data } ] = useMutation(CREATE_ROOM)

  const dispatch = useDispatch()
  const loading = useSelector(state => { return state.loading })

  if (loading && data) {
    dispatch(finishLoading())
    const roomId = data.room.id
    dispatch(wsConnect(roomId))
  }
  return (
    <Button 
      color="primary" 
      onClick={() => { 
        dispatch(startLoading())
        dispatch(invalidateGame())
        dispatch(invalidateMessages())
        createRoom()
      }}>
      Create Room
    </Button>
  )
}

class Menu extends React.Component {
  constructor(props){
    super(props)
    this.performLogout = this.performLogout.bind(this)
    this.state = { roomId: '' }
  }

  performLogout = (e) => {
    e.preventDefault()
    const { dispatch } = this.props
    dispatch(startLoading())
    // still need to make request to API and clean Apollo Local Cache
    batch(() => {
      dispatch(setUnAuthenticated())
      dispatch(finishLoading())
    })
  }
  
  joinRoom = (event) => {
    event.preventDefault()
    const { roomId } = this.state
    const { dispatch } = this.props
    batch(() => {
      dispatch(startLoading())
      dispatch(invalidateGame())
      dispatch(invalidateMessages())
      dispatch(wsConnect({ roomId }))
    })
  }

  handleChange = (event, name) => {
    event.preventDefault()
    this.setState({[name] : event.target.value})
  }

  handleSubmit = (event) => {
    event.preventDefault()
  }

  render() {
    const { classes, connected } = this.props
    return (
      <Fragment>
        {connected? (
          <Redirect to={'/game'} />
        ) : (
          <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
              <Typography  variant="h2">
                τrus
              </Typography>
              <form className={classes.form} onSubmit={this.handleSubmit} noValidate>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <CreateRoom classes={classes} />
                  </Grid>
                  <Grid item container direction='row' justify='space-between'>
                    <Grid item>
                      <TextField
                        name="roomId"
                        label="Room Id"
                        type="string"
                        id="roomid"
                        onChange={(event) => this.handleChange(event, "roomId")}
                        value={this.state.roomId}
                      />
                    </Grid>
                    <Grid item>
                        <Button
                          style={{height: "100%"}}
                          disabled={this.state.roomId === ""}
                          color="primary" 
                          size="large"
                          className={"none"} 
                          onClick={this.joinRoom}>
                          Join Room
                        </Button>
                    </Grid>  
                  </Grid>
                  <Grid item xs={12}>
                    <Button 
                      color="secondary" 
                      onClick={this.performLogout}
                    >
                      Logout
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </div>
          </Container>
        )}
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  const { loading, websockets } = state
  return { loading, connected: websockets.connected }
}

export default connect(mapStateToProps) ( withStyles(styles)(Menu))
