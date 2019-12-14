import React from 'react'
import { connect } from 'react-redux'
import { wsMessage } from '../../Redux/ducks/websockets'
import { TextField } from '@material-ui/core'

class MessageForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''}
  }

  handleChange = (event) => {
    event.preventDefault();
    this.setState({value: event.target.value});
  }

  handleSubmit = (event) => {
    console.log( "Submitting ")
    event.preventDefault()
    const { value } = this.state
    const { dispatch } = this.props
    dispatch(wsMessage({type: "message", text: value }))
    this.setState({value: ''})
  }

  render () {
    const { classes } = this.props
    return (
      <form className={classes.form} noValidate onSubmit={this.handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          name="message form"
          label="Send message"
          type="string"
          id="send message"
          onChange={this.handleChange}
          value={this.state.value}
        />
      </form>
    );
  }
}

export default connect()(MessageForm)
