import React from 'react'
import { Checkbox, FormControlLabel } from '@material-ui/core'

const CheckForm = props => {
  return(
    <>
      <FormControlLabel
        label={props.label}
        control={
          <Checkbox name="correctness" value={props.value} onChange={e => props.handler(e.target.value)}/>
        }
      />
    </>
  )
}

export default CheckForm