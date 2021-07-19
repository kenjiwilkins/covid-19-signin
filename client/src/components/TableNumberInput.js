import React from 'react'
import { TextField } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
  Paper:{
    paddingTop:"1em",
    paddingBottom:"1em"
  }
})

const TableNumberInput = props => {
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
  React.useEffect(() => {
    if(props.tableQuery){
      if(props.tableQuery.exists){
        props.handler(props.tableQuery.number)
      }
    }

  },[props.tableQuery])
  return (
    <div className={classes.Paper}>
      { props.tableQuery.exists ?
        <TextField
          disabled
          fullWidth
          value={props.value}
          helperText="prefilled"
          label="table number"
        />:
        ((props.value && valid) || !touched ?
        <TextField 
          required
          fullWidth
          id="table number"
          placeholder="table number"
          helperText="requied"
          label="table number"
          type="number"
          value={props.value}
          onChange={e => validator(e)}
        />:
        <TextField 
          required
          fullWidth
          error
          id="table number"
          placeholder="table number"
          helperText="required"
          label="table number"
          type="number"
          value={props.value}
          onChange={e => validator(e)}
        />)
      }
    </div>
  )
}

export default TableNumberInput