import React, { useRef, useEffect } from 'react'
import { Grid, ListItem, ListItemText } from '@material-ui/core'
import { FixedSizeList, ListChildComponentProps } from 'react-window'
import { useTypedSelector } from 'Redux'

const MessageList = () => {
  const messageLog = useTypedSelector(state => state.messageLog)
  const ListRef = useRef<FixedSizeList>(null)
  const length = messageLog.length
  
  const scrollToBottom = () => {
    const current = ListRef.current
    if (current) {
      current.scrollToItem(length - 1, 'start')
    }
  }
  useEffect(scrollToBottom, [messageLog])
  
  const renderRow = (props: ListChildComponentProps) => {
    const { index, style } = props
    return (
      <ListItem style={style} key={index}>
        <ListItemText primary={`${index + 1}: ${messageLog[index]}`}/>
      </ListItem>
    )
  }

  return (
    <Grid container item xs={12} spacing={1}>
      <FixedSizeList height={200} width={500} itemSize={25} itemCount={length} ref={ListRef} >
        {renderRow}
      </FixedSizeList>
    </Grid>
  );
}

export default MessageList
