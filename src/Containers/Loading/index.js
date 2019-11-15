import React from 'react'
import './Loading.css'
import { Typography, CircularProgress } from '@material-ui/core'
class Loading extends React.Component {
  render() {
    return (
      <div className='Loading'>
        <Typography variant='body2' color='textSecondary' align='center'>
          {'τrus '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>

        <CircularProgress />
      </div>
    );
  }
}

export default Loading
