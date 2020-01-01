import React from 'react'
import { Redirect } from 'react-router-dom'
import { ButtonLink } from 'Components'
import { Container, Typography, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useTypedSelector } from 'Redux'
import styles from '../styles'

const useStyles = makeStyles(styles)

const Stats = () =>{
  const classes = useStyles()
  const { me, connected } = useTypedSelector(state => {
    return { me: state.me, connected: state.websockets.connected }
  })
  console.log(me)
  return (
    <>
      {connected? (
        <Redirect to={'/game'} />
      ) : (
        <Container component="main" maxWidth="xs">
          <div className={classes.paper}>
            <Typography  variant="h2">
              {me.handle}
            </Typography>
            <Typography  variant="h2">
              {me.email}
            </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <ButtonLink
                    color='primary'
                    to='menu'
                  >
                      Return to menu
                  </ButtonLink>
                </Grid>  

                <Grid item xs={12}>
                </Grid>
            </Grid>
          </div>
        </Container>
      )}
    </>
  );
}

export default Stats
