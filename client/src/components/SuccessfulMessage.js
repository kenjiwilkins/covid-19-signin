import React from 'react'
import { Grid, List, ListItem, ListItemText, Typography } from '@material-ui/core'
import { CheckCircle } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import moment from 'moment'

const useStyles = makeStyles({
  Grid:{
    textAlign:"center"
  },
  Icon:{
    fontSize:200,
    color:"green"
  }
})

const SuccessfulMessage = props => {
  const classes = useStyles()
  return(
    <Grid container spacing={2} justify="center" className={classes.Grid}>
      <Grid item xs={8}>
        <CheckCircle className={classes.Icon}/>
      </Grid>
      <Grid item xs={8}>
        <Typography variant="h6">
          SignIn Successful!
        </Typography>
      </Grid>
      {props.user &&
        <Grid item xs={8} container spacing={3}>
          <List>
            <ListItem key="username">
              <ListItemText
                primary={`Your Name: ${props.user.firstName} ${props.user.lastName}`}
              />
            </ListItem>
            <ListItem key="email">
              <ListItemText
                primary={`Email: ${props.user.email}`}
              />
            </ListItem>
            <ListItem key="time">
              <ListItemText
                primary={`Check in Time: ${moment(props.user.checkInTime).format("DD/MM hh:mm:ss")}`}
              />
            </ListItem>
          </List>
        </Grid>
      }
    </Grid>
  )
}

export default SuccessfulMessage