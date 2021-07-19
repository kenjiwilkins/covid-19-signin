import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { LinearProgress } from '@material-ui/core'

import axios from 'axios'

const PrivateRoute = ({Component:Component, ...props}) => {
  const [auth, setAuth] = React.useState(false);
  const handleAuth = value => {
    setAuth(value)
  }
  React.useEffect(async () => {
      try {
        axios.get('https://signin-demo.herokuapp.com/api/auth',{headers:{Authorization:`Bearer ${props.user.token}`}}).then(res => {
          if(res.data.message === "Auth Successful"){
            handleAuth(true)
          } else {
            window.location.replace("/login")
          }
        }).catch(err => {
          props.logout()
          window.location.replace('/login')
        })
      } catch (error) {
        props.logout()
        window.location.replace('/login')
      }
  }, [])
  return (
    <div>
      {auth ? 
          <Route 
          {...props}
          render={props => 
            props ? (<Component {...props} />): (<Redirect to={{pathname:"/login", state: {from: props.location}}} />)
          }
        >
        </Route> : <LinearProgress />
      }
    </div>
  )
}

export default PrivateRoute