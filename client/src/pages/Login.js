import React, {useState} from 'react'
import { withRouter } from 'react-router-dom'
import { Button, Container, Grid, Paper, TextField, Typography } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { makeStyles } from '@material-ui/styles'
import axios from 'axios'

const useStyles = makeStyles({
  Container: {
    paddingTop:"2em",
    paddingBottom:"2em"
  },
  Paper:{
    paddingTop:"2m",
    paddingBottom:"2em",
    textAlign:"center",
    alignItems:"center"
  },
  Avatar:{
    alignItems:"center"
  }
})

const Login = props => {
  const classes = useStyles()
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [isError, setIsError] = useState(false)
  const [message, setMessage] = useState("")
  const login = () => {
    const data ={
      username:name,
      password:password
    }
    axios.post('https://signin-demo.herokuapp.com/api/login', data).then(res => {
      if(res.status === 201){
        props.login(res.data.user, res.data.token)
        window.location.replace('/manage')
      }
    }).catch(err => {
      if(err){
        setIsError(true)
        setMessage("Your username or password does'nt match")
      }
    })
  }
  return(
    <Container maxWidth="md" className={classes.Container}>
      <Paper className={classes.Paper}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6">
              Login
            </Typography>
          </Grid>
          {isError && 
            <Grid item xs={12}>
              <Alert severity="error">{message}</Alert>
            </Grid>
          }

          <Grid item xs={12}>
            <Container maxWidth="sm">
              <TextField
                value={name}
                onChange={e => setName(e.target.value)}
                fullWidth
                autoFocus
                placeholder="username"
                label="user name"
                type="text"
                onKeyDown={e => {
                  if(e.key === "Enter"){
                    login()
                  }
                }} 
              />
            </Container>
          </Grid>
          <Grid item xs={12}>
            <Container maxWidth="sm">
              <TextField
                value={password}
                onChange={e => setPassword(e.target.value)}
                fullWidth
                placeholder="password"
                label="password"
                type="password"
                onKeyDown={e => {
                  if(e.key === "Enter"){
                    login()
                  }
                }} 
              />
            </Container>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" onClick={() => login()}>
              Login
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  )
}

export default withRouter(Login)