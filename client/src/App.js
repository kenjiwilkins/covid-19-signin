import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { login, logout } from './actions/index'
import { connect } from 'react-redux';

import Main from './pages/Main'
import Login from './pages/Login'
import Manage from './pages/Manage'
import NotFound from './pages/NotFound'
import PrivateRoute from './components/PrivateRoute'
import "./App.css"

class App extends React.Component{

  render(){
    return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/login" exact>
            <Login {...this.props}/>
          </Route>
          <PrivateRoute path="/manage" component={Manage} {...this.props}/>
          <Route path="/" exact>
            <Main {...this.props}/>
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </BrowserRouter>
      
    </div>
  );}
}

const mapStateToProps = state => ({
  user:state.user_state.user
})

const mapDispatchToProps = {
  login,
  logout
}

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

export default AppContainer;
