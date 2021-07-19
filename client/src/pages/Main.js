import React from 'react'
import { withRouter } from 'react-router-dom'
import { Container, Grid, Paper, Button, FormGroup, LinearProgress, Typography} from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import emailValidator from 'email-validator'
import axios from 'axios'
import queryString from 'query-string'
import TitleBar from '../components/TitleBar'
import SuccessfulMessage from '../components/SuccessfulMessage'
import NameInput from '../components/NameInput'
import EmailInput from '../components/EmailInput'
import NumberInput from '../components/NumberInput'
import Checkbox from '../components/Checkbox'
import TableNumberInput from '../components/TableNumberInput'


class Main extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      firstName: "",
      lastName:"",
      email:"",
      number:"",
      tableNumber:"",
      status:"input",
      correctnessChecked:false,
      healthChecked:false,
      errors:[],
      postSuccessful:false,
      postError:false,
      postErrorMessage:"",
      tableQuery:{
        number: 0,
        exists: false
      },
      user:undefined,
    }
  }

  handleFirstName = value => {
    this.setState(prevState => {
      return {
        ...prevState,
        firstName:value
      }
    })
  }
  handleLastName = value => {
    this.setState(prevState => {
      return {
        ...prevState,
        lastName:value
      }
    })
  }
  handleEmail = value => {
    this.setState(prevState => {
      return {
        ...prevState,
        email:value
      }
    })
  }
  handleNumber = value => {
    this.setState(prevState => {
      return {
        ...prevState,
        number:value
      }
    })
  }
  handleTableNumber = value => {
    this.setState(prevState => {
      return {
        ...prevState,
        tableNumber:value
      }
    })
  }
  handleCorrectnessChecked = value => {
    this.setState(prevState => {
      return {
        ...prevState,
        correctnessChecked:value
      }
    })
  }
  handleHealthChecked = value => {
    this.setState(prevState => {
      return {
        ...prevState,
        healthChecked:value
      }
    })
  }

  handleSubmit = value => {
    this.setState(prevState => {
      return {
        ...prevState,
        status: "submitted"
      }
    })
  }

  apiCall = customer => {
    axios.post('https://signin-demo.herokuapp.com/api/checkin', customer).then(res => {
      if(res.status === 201){
        this.setState(prevState => {
          return {
            ...prevState,
            postSuccessful:true,
            status:res.data.status,
            user:res.data.user
          }
        })
      }
    }).catch(error => {
      this.setState(prevState => {
        return {
          ...prevState,
          postError: true,
          postErrorMessage:"Communication Error"
        }
      })
    })
  }

  sendData = () => {
    let newErrors = []
    if(this.state.firstName.length === 0){
      newErrors.push("Please fill in your first name")
    }
    if(this.state.lastName.length === 0){
      newErrors.push("Please fill in your last name")
    }
    if(this.state.email.length > 0){
      if(!emailValidator.validate(this.state.email)){
        newErrors.push("Your email address is invalid")
      }
    } else {
      newErrors.push("Please fill in your email address")
    }
    if(this.state.number.length === 0){
      newErrors.push("Please fill in your phone number")
    }
    if(!this.state.correctnessChecked){
      newErrors.push("Please declare the information is correct")
    }
    if(!this.state.healthChecked){
      newErrors.push("We cannot allow you to dine in if you're sick")
    }
    if(newErrors.length > 0){
      this.setState(prevState => {
        return {
          ...prevState,
          errors:newErrors
        }
      })
    } else {
      const customer = {
        firstName:this.state.firstName,
        lastName:this.state.lastName,
        email:this.state.email,
        phoneNumber:this.state.number,
        tableNumber:this.state.tableNumber,
      }
      this.setState(prevState => {
        return {
          ...prevState,
          status:"submit"
        }
      })
      this.apiCall(customer)
    }
    window.scrollTo(0,0)
  }

  componentDidMount(){
    let qs = queryString.parse(this.props.location.search)
    if(Object.keys(qs).length === 1){
      if(Object.keys(qs)[0] === "table"){
        this.setState({tableQuery:{
          number:qs.table,
          exists:true
        }})
      }
    }
  }

  render(){
    return(
    <div>
      {this.state.status === "submit" &&
        <LinearProgress />
      }
      <Container maxWidth="lg">
        <FormGroup className="topGrid">
          <Grid container spacing={3} >
            <Grid item xs={12} >
              <TitleBar />
            </Grid>
            {this.state.errors.length > 0 && this.state.errors.map((message, index) => 
              <Grid item xs={12}>
                <Alert severity="error">{message}</Alert>
              </Grid> )}
            {this.state.postError && 
              <Grid item xs={12}>
                <Alert severity="error">{this.state.postErrorMessage}</Alert>
              </Grid>
            }
            {this.state.postSuccessful ? <SuccessfulMessage user={this.state.user}/>:
            <React.Fragment>
              <Grid item xs={12}>
                <Paper>
                  <Container maxWidth="lg">
                    <div className="Paper">
                      <NameInput input="first name" value={this.state.firstName}  handler={this.handleFirstName}/>
                      <NameInput input="last name" value={this.state.lastName} handler={this.handleLastName} />
                    </div>
                  </Container>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper>
                  <Container maxWidth="lg">
                    <EmailInput value={this.state.email} handler={this.handleEmail} />
                  </Container>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper>
                  <Container maxWidth="lg">
                    <NumberInput value={this.state.number} handler={this.handleNumber} />
                  </Container>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper>
                  <Container maxWidth="lg">
                    <TableNumberInput value={this.state.tableNumber} handler={this.handleTableNumber} tableQuery={this.state.tableQuery}/> 
                  </Container>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper>
                  <Container maxWidth="lg">
                    <div className="Paper">
                      <Checkbox  
                        label="I declare that the details above are correct and acurate"
                        value={this.state.correctnessChecked}
                        handler={this.handleCorrectnessChecked}
                      />
                      <Checkbox
                        label="I am not currently suffering from any flu or COIVD-19 like symptoms"
                        value={this.state.healthChecked}
                        handler={this.handleHealthChecked}
                      />
                    </div>
                  </Container>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Button size="large" variant="contained" color="primary" onClick={() => this.sendData()}>Submit</Button>
              </Grid>
            </React.Fragment>}
          </Grid>
        </FormGroup>
        <Typography variant="caption" color="textPrimary">Contact information is to be used only for the purposes of contact tracing.</Typography>
        <Typography variant="caption" color="textSecondary">© Michael Kenji Wilkins 2020</Typography>
      </Container>  
    </div>)
  }
}

export default withRouter(Main)