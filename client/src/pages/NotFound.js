import React from 'react'
import { Container, Grid, Typography } from '@material-ui/core'

const NotFound = () => {
  return(
    <Container maxWidth="md">
      <Grid container spacing={3} justify="center">
        <Grid item xs={8}>
          <Typography variant="h6">
            404 Not Found Sorry
          </Typography>
        </Grid>
      </Grid>
    </Container>
  )
}

export default NotFound