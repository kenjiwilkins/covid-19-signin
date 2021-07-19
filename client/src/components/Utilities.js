import React, { useState } from 'react'
import { Button, Container, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, Typography } from '@material-ui/core'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers"
import { Alert } from '@material-ui/lab'
import DateFnsUtils from '@date-io/date-fns'
import moment from 'moment'
import { ExportToCsv } from "export-to-csv"
import axios from 'axios'
import "../App.css"

const Utilities = props => {
  const [startDate, setStartDate] = useState(moment().startOf('day'))
  const [endDate, setEndDate] = useState(moment().endOf('day'))
  const [period, setPeriod] = useState("Day")
  const [isError, setIsError] = useState(false)
  const [message, setMessage] = useState("")
  const handlePeriod = event => {
    setPeriod(event.target.value)
    if(event.target.value === "Day"){
      setStartDate(moment().startOf("day").format())
      setEndDate(moment(startDate).endOf('day').format())
    } else {
      setStartDate(moment(startDate).startOf("month").format())
      setEndDate(moment(startDate).endOf('month').format())
    }
  }
  const handleStartDate = date => {
    setStartDate(moment(date).startOf('day'))
  }
  const downloadcsv = async () => {
  const options = { 
    filename:moment(startDate).format("DD/MM/YYYY"),
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true, 
    showTitle: true,
    title: moment(startDate).format("DD/MM/YYYY"),
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: true,
  };

    const timePeriod = {
      startDate,
      endDate,
      period
    }
    
    await axios.post("https://signin-demo.herokuapp.com/api/download", timePeriod, {headers:{Authorization:`Bearer ${props.user.token}`}}).then(res => {
      const csvExporter = new ExportToCsv(options)
      csvExporter.generateCsv(res.data)
    }).catch(err => {
      if(err){
        setIsError(true)
        setMessage("Oops Something Went Wrong!")
      }
    })
  }

  return (
    <Container maxWidth="xl" className="Paper">
      <Grid container spacing={3} justify="center">
        {isError && 
        <Grid item xs={11}>
          <Alert severity="error">{message}</Alert>
        </Grid>}
        <Grid item xs={11} container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6">
              Download User Data
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <FormControl>
              <FormLabel>Download Period</FormLabel>
              <RadioGroup value={period} onChange={handlePeriod}>
                <FormControlLabel value="Day" label="Day" control={<Radio />} />
                <FormControlLabel value="Month" label="Month" control={<Radio />} />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            
            {period === "Day" && 
            <div>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                margin="normal"
                label="Date Select"
                value={startDate}
                onChange={handleStartDate}
              />
              </MuiPickersUtilsProvider>
            </div>}
            {period === "Month" && 
            <div>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                margin="normal"
                views={["year", "month"]}
                label="Month Select"
                minDate={new Date("2020-01-01")}
                maxDate={new Date()}
                value={startDate}
                onChange={handleStartDate}
              />
              </MuiPickersUtilsProvider>
            </div>}
          </Grid>
          <Grid item xs={12}>
            <Button color="primary" onClick={() => downloadcsv()}>download</Button>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Utilities