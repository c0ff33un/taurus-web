import React from 'react'
import Game from '../Game/Game'

class CreateRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {code: ''}
  }

  handleClick = () => {
    console.log('try get room')
    const options = {
      method : 'POST',
    }
    const apiURL = process.env.REACT_APP_API_URL
    console.log("apiURL: " + apiURL)
    fetch(`http://${apiURL}/room`, options)
    .then(response => {
      console.log(response.body)
      return response.json()
    })
    .then(json => {
      this.setState({code: json.id})
    })
  }

  render () {
    return (
      <div>
        <button onClick={this.handleClick}>
          Create Room
        </button>
      {this.state.code !== '' && 
        <p>Code:{this.state.code} </p>
      }
      </div>
    );
  }
}

class JoinRoomForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {"roomId": '', "token": ''}
  }

  handleChange = (event, name) => {
    this.setState({[name] : event.target.value});
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { roomId, token } = this.state;
    this.props.connect(roomId, token);
  }

  render () {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Room:
          <input type="text" value={this.state.roomId} 
          onChange={(event) => this.handleChange(event, "roomId")} />
        </label>
        <input type="submit" value="Join Room" />
      </form>
    );
  }
}

class Lobby extends React.Component {
  render() {
    const room = true;
    return (
      <div>
        Lobby:
        <CreateRoom />
        <JoinRoomForm />
        {room &&
          <Game />
        }
      </div>
    );
  }
}



export default Lobby;
