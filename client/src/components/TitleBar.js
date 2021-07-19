import React from 'react'
import {Container, Paper, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'

const useStyles = makeStyles({
  TopPaper:{
    backgroundColor:"#3F51B5",
    color:"white",
    textAlign:"center",
  }
})

const TitleBar = props => {
  const classes=useStyles()
  return (
    <Paper className={classes.TopPaper}>
      <Container maxWidth="lg">
        <Typography variant="h6">
          Your Restaurant
        </Typography>
        <Typography variant="caption">
          according to COVID-19 Safe Checklist
        </Typography>
      </Container>
    </Paper>
  )
}

export default TitleBar