import { combineReducers } from 'redux'

const userState = {
  user: {
    username:"",
    admin:false,
    token:"",
  }
}

const user_state = (state = userState, action) => {
  switch(action.type){
    case "LOGIN" :
      let newUser = {username:action.user.username, admin:action.user.admin, token: action.token}
      return {
        ...state,
        user: newUser
      }
    case "LOGOUT" :
      return {
        user: {
          username:"",
          admin:false,
          token:""
        }
      }
    default:
      return state
  }
}

export const reducers = combineReducers({
  user_state
})