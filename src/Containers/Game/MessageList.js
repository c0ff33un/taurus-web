import React from 'react'
import { connect } from 'react-redux'
import { List, ListItem, Typography } from '@material-ui/core'

class MessageList extends React.Component {

  scrollToBottom = () => {
    // this.messagesEnd.scrollTo({top:this.messagesEnd.top-100})
    this.messagesEnd.scrollIntoView({ block: "nearest", behavior: "smooth", inline: "nearest" });
  }
  
  componentDidMount() {
    //this.scrollToBottom();
  }
  
  componentDidUpdate() {
    //this.scrollToBottom();
  }

  render() {
    const { messageLog } = this.props
    return (
      <List component="ul" style={{maxHeight: "150px", overflow: "auto"}}>

        <ListItem>
        <div style={{ float:"left", clear: "both" }}
          ref={(el) => { this.messagesEnd = el; }}>
        </div> 
          <Typography component="div">
            { messageLog.map((item, index) => <p key = {index} > {item} </p>) }
          </Typography>
        </ListItem>
      </List>
    );
  }
}

function mapStateToProps(state)  {
  const { messageLog } = state
  return { messageLog }
}

export default connect(mapStateToProps, {

})(MessageList)
