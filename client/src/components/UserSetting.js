import React, {useState, useEffect} from 'react'
import { 
  Button, Checkbox, Container, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid, List, ListItem, ListItemSecondaryAction, ListItemText, TextField, Typography 
} from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import axios from 'axios'

const UserSetting = props => {
  const [users, setUsers] = useState([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState(true)
  const [statusMessage, setStatusMessage] = useState("")
  const [openDelete, setOpenDelete] = useState(false)
  const [userToDelete, setUserToDelete] = useState()
  const registerUser = () => {
    const user = {
      username: username,
      password: password,
      admin: isAdmin
    }
    cancelInput()
    axios.post("https://signin-demo.herokuapp.com/api/register", user).then(res => {
      if(res.status === 201){
        if(!props.user.admin){return}
        setStatus(true)
        setStatusMessage("User Creation Successful")
        axios.get("https://signin-demo.herokuapp.com/api/getusers", {headers:{Authorization:`Bearer ${props.user.token}`}}).then(res => {
          setUsers(res.data)
        }).catch(error => {
          if(error){
            setStatus(false)
            setStatusMessage("Communication Failed")
          }
        })
      } else {
        setStatus(false)
        setStatusMessage(res.data.message)
      }
    })
  }
  const cancelInput = () => {
    setOpen(false)
    setUsername("")
    setPassword("")
    setIsAdmin(false)
  }
  const deleteUser = id => {
    cancelDelete()
    if(!props.user.admin){return}
    axios.post("https://signin-demo.herokuapp.com/api/delete", {id:id}, {headers:{Authorization:`Bearer ${props.user.token}`}}).then(res => {
      if(res.status === 201){
        setStatus(true)
        setStatusMessage("Deletion Successful")
        axios.get("https://signin-demo.herokuapp.com/api/getusers", {headers:{Authorization:`Bearer ${props.user.token}`}}).then(res => {
          console.log(res.data)
          setUsers(res.data)
        }).catch(error => {
          if(error){
            setStatus(false)
            setStatusMessage("Communication Failed")
          }
        })
      } else {
        setStatus(false)
        setStatusMessage(res.data.message)
      }
    })
  }
  const cancelDelete = () => {
    setOpenDelete(false)
    setUserToDelete(undefined)
  }
  const processDelete = user => {
    setOpenDelete(true)
    setUserToDelete(user)
  }
  useEffect(() => {
    axios.get("https://signin-demo.herokuapp.com/api/getusers", {headers:{Authorization:`Bearer ${props.user.token}`}}).then(res => {
      console.log(res.data)
      if(res.data.message === "failed"){
        window.location.replace("/login")
      }
      setUsers(res.data)
    }).catch(error => {
      if(error){
        setStatus(false)
        setStatusMessage("Communication Failed")
      }
    })
  }, [props.user.token])
  return (
    <Container maxWidth="xl">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6">Users Setting</Typography>
        </Grid>
        {statusMessage.length > 0 &&
          <Grid item xs={12}>
            {status ? <Alert severity="success">{statusMessage}</Alert> : <Alert severity="error">{statusMessage}</Alert>}
          </Grid>
        }
        <Dialog open={openDelete} onClose={() => cancelDelete()}>
          <DialogTitle>Delete User</DialogTitle>
          <DialogContent>
            {userToDelete &&
            <Typography variant="h6">
              {`Are you sure delete user: ${userToDelete.username}?`}
            </Typography>
            }
          </DialogContent>
          <DialogActions>
            <Button color="secondary" onClick={() => cancelDelete()}>Cancel</Button>
            {userToDelete && <div>
            <Button color="primary" onClick={() => deleteUser(userToDelete._id)}>Delete</Button>
            </div>}
          </DialogActions>
        </Dialog>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Add New User</DialogTitle>
          <DialogContent>
            <div>
              <TextField
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="user name"
                label="user name"
                type="text"
              />
            </div>
            <div>
              <TextField
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="password"
                label="password"
                type="password"
              />
            </div>
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isAdmin}
                    onChange={e => setIsAdmin(e.target.checked)}
                  />
                }
                label="admin"
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button color="secondary" onClick={() => cancelInput()}>Cancel</Button>
            <Button color="primary" onClick={() => registerUser()}>Add</Button>
          </DialogActions>
        </Dialog>
        <Grid item xs={12}>
          <List>
            {props.user.admin &&
            <ListItem>
              <Button variant="contained" color="primary" onClick={() => setOpen(true)}>Add New User</Button>
            </ListItem>
            }
            {users.length > 0 ? <div>{
              users.map((user) => 
              <ListItem key={user._id}>
                <ListItemText primary={user.username} secondary={user.admin ? "admin" : "" } />
                <ListItemSecondaryAction>
                  {props.user.admin &&
                    <Button color="secondary" onClick={() => processDelete(user) }>Delete</Button>
                  }
                </ListItemSecondaryAction>
              </ListItem>) }</div> :
              <ListItem>
                <ListItemText>loading...</ListItemText>
              </ListItem>
              
            }
          </List>
        </Grid>
      </Grid>
    </Container>
  )
}

export default UserSetting