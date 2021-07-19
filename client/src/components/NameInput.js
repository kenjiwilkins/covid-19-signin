import React from 'react'
import { TextField } from '@material-ui/core'

const NameInput = props => {
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
    <>
      {(props.value.length > 0 && valid) || !touched? 
        <TextField 
          required
          fullWidth
          id={props.input}
          placeholder={props.input}
          helperText="requied"
          label={props.input}
          value={props.value}
          onChange={e => validator(e)}
        />:
        <TextField 
          error
          required
          fullWidth
          id={props.input}
          placeholder={props.input}
          helperText="requied"
          label={`${props.input} required`}
          value={props.value}
          onChange={e => validator(e)}
        />
        }
    </>
  )
}

export default NameInput