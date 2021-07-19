import React from 'react'
import { TextField } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
  Paper:{
    paddingTop:"1em",
    paddingBottom:"1em"
  }
})

const EmailInput = props => {
  const classes = useStyles()
  const [touched, setTouched] = React.useState(false)
  const [valid, setValid] = React.useState(true)
  const handleTouched = value => {
    setTouched(value)
  }
  const validator = (e) => {
    if(!touched){
      handleTouched(true)
      setValid(true)
    } else if(e.target.value.length === 0){
      setValid(false)
    } else {
      setValid(true)
    }
    props.handler(e.target.value)
  }
  return (
    <div className={classes.Paper}>
      {(props.value.length > 0 && valid) || !touched ?
      <TextField 
        required
        fullWidth
        id="email address"
        placeholder="email address"
        helperText="requied"
        label="email address"
        type="email"
        value={props.value}
        onChange={e => validator(e)}
      />:
      <TextField 
        required
        fullWidth
        error
        id="email address"
        placeholder="email address"
        helperText="invalid"
        label="email address"
        type="email"
        value={props.value}
        onChange={e => validator(e)}
      />
      }
    </div>
  )
}

export default EmailInput