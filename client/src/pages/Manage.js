import React from 'react'
import { 
  AppBar, Container, FormControl, FormControlLabel, FormLabel,
  Grid, Paper, Radio, RadioGroup, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import DateFnsUtils from '@date-io/date-fns'
import { login, logout } from '../actions/index'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import { connect } from 'react-redux'
import moment from 'moment'
import UserSetting from '../components/UserSetting'
import Utilities from '../components/Utilities'
import axios from 'axios'
import "../App.css"

class Manage extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      data:undefined,
      date: new Date(),
      selectedTime: undefined,
      tab: 0,
      radio: "none",
      openingHours:[],
      isError:false,
      message:"",
    }
    this.handleTab = this.handleTab.bind(this)
    this.handleDate = this.handleDate.bind(this)
    this.handleRadio = this.handleRadio.bind(this)
    this.handleError = this.handleError.bind(this)
    this.getData = this.getData.bind(this)
  }
  handleTab(event, newValue){
    this.setState({tab:newValue})
  }
  handleDate(date){
    this.setState({date:date})
  }
  handleRadio(event){
    this.setState({radio:event.target.value})
  }
  handleError(value){
    this.setState(prevState => {
      return {
        ...prevState,
        isError:true,
        message:value
      }
    })
  }
  componentDidMount(){
    this.getData()
  }
  getData(){
    if(this.state.radio === "none"){
      axios.get('https://signin-demo.herokuapp.com/api/getlist', {headers:{Authorization:`Bearer ${this.props.user.token}`}}).then(res => {
        if(res.data.message === "failed"){
          window.location.replace("/login")
        }
        this.setState({data:res.data})
      }).catch(err => {
        if(err){
          this.handleError("Communication Error")
        }
      })
    } else if(this.state.radio === "allday"){
      axios.get(`https://signin-demo.herokuapp.com/api/getlist/bydate?date=${this.state.date}`, {headers:{Authorization:`Bearer ${this.props.user.token}`}}).then(res => {
        if(res.data.message === "failed"){
          window.location.replace("/login")
        }
        this.setState({data:res.data})
      }).catch(err => {
        if(err){
          this.handleError("Communication Error")
        }
      })
    } else if(this.state.radio === "lunch"){
      axios.get(`https://signin-demo.herokuapp.com/api/getlist/bylunch?date=${this.state.date}`, {headers:{Authorization:`Bearer ${this.props.user.token}`}}).then(res => {
        if(res.data.message === "failed"){
          window.location.replace("/login")
        }
        this.setState({data:res.data})
      }).catch(err => {
        if(err){
          this.handleError("Communication Error")
        }
      })
    } else if(this.state.radio === "dinner"){
      axios.get(`https://signin-demo.herokuapp.com/api/getlist/bydinner?date=${this.state.date}`, {headers:{Authorization:`Bearer ${this.props.user.token}`}}).then(res => {
        if(res.data.message === "failed"){
          window.location.replace("/login")
        }
        this.setState({data:res.data})
      }).catch(err => {
        if(err){
          this.handleError("Communication Error")
        }
      })
    }
  }

  componentDidUpdate(prevProps, prevState){
    if(this.state.radio === "allday"){
      if(prevState.date !== this.state.date){
        this.getData()
        return
      }
    }
    if(prevState.radio !== this.state.radio){
      this.getData()
    }
  }
  render(){
    return(
      <Container maxWidth="lg">
        <AppBar position="static">
          <Tabs value={this.state.tab} onChange={this.handleTab}>
            <Tab label="Signin List" />
            <Tab label="Users Setting" />
            <Tab label="Utilities" />
          </Tabs>
        </AppBar>
        {this.state.tab === 0 && 
        <Paper square className="Paper">
          <Grid container spacing={3}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              {this.state.isError && 
                <Grid item xs={12}>
                  <Alert severity="error">{this.state.message}</Alert>
                </Grid>
              }
              <Grid item xs={12} container justify="center" spacing={3}>
                <Grid item xs={3}>
                  <FormControl>
                    <FormLabel>First 100</FormLabel>
                    <RadioGroup value={this.state.radio} onChange={this.handleRadio}>
                      <FormControlLabel value={"none"} label="first 100" control={<Radio />} />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <FormControl>
                    <FormLabel>Search by Date</FormLabel>
                    <RadioGroup value={this.state.radio} onChange={this.handleRadio}>
                      <FormControlLabel value={"allday"} label="all day" control={<Radio />} />
                    </RadioGroup>
                    {this.state.radio === "none" ? 
                    <KeyboardDatePicker
                      disabled
                      margin="normal"
                      label="Search for"
                      value={this.state.date}
                    />:
                    <KeyboardDatePicker
                      label="Search for"
                      margin="normal"
                      value={this.state.date}
                      onChange={this.handleDate}
                    />}
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <FormControl>
                    <FormLabel>Filter</FormLabel>
                    <RadioGroup value={this.state.radio} onChange={this.handleRadio} >
                      <FormControlLabel value={"lunch"} label="lunch" control={<Radio />}/>
                      <FormControlLabel value={"dinner"} label="dinner" control={<Radio />}/>
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid container spacing={3} justify="center">
            {this.state.data && 
              <Grid item xs={11}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date/Time</TableCell>
                        <TableCell align="right">first name</TableCell>
                        <TableCell align="right">last name</TableCell>
                        <TableCell align="right">email</TableCell>
                        <TableCell align="right">phone no.</TableCell>
                        <TableCell align="right">table no.</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.data.map((dat, index) => 
                        <TableRow key={index}>
                          <TableCell>{moment(dat.checkInTime).format("DD/MM/YYYY hh:mm:ss")}</TableCell>
                          <TableCell align="right">{dat.firstName}</TableCell>
                          <TableCell align="right">{dat.lastName}</TableCell>
                          <TableCell align="right">{dat.email}</TableCell>
                          <TableCell align="right">{dat.phoneNumber}</TableCell>
                          <TableCell align="right">{dat.tableNumber}</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            }
          </Grid>
        </Paper>
        }
        {this.state.tab === 1 &&
        <Paper square className="Paper">
          <Grid container spacing={3}>
            <UserSetting {...this.props}/>
          </Grid>
        </Paper>
        }
        {this.state.tab === 2 &&
        <Paper square className="Paper">
          <Grid container spacing={3}>
            <Utilities {...this.props}/>
          </Grid>
        </Paper>
        }
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  user:state.user_state.user
})

const mapDispatchToProps = {
  login,
  logout
}

const ManageContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Manage)

export default ManageContainer