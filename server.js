const express = require("express");
const bodyParser = require("body-parser");
const moment = require("moment");
const cookieParser = require('cookie-parser');
const sha512 = require('js-sha512');
const jwt = require("jsonwebtoken");
const path = require("path");
const models = require("./api/models");
const cors = require('cors');

const server = express();
const port = process.env.PORT || 3000;

server.use(express.static('./client/build'))
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(cors());
server.use(cookieParser());

const secret = process.env.JWT_SECRET

// authorisation path for management staff
server.get('/api/auth', async (req, res) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const data = jwt.verify(token, secret);
    // 冗長な処理
    let user
    await models.userModel.findById(data._id, (err, doc) => {
      user = doc
    })
    if(!user){
      throw new Error()
    }
    req.user = user
    req.token = token
    res.status(200).send({message: "Auth Successful"})
  } catch (error) {
    if(error){
      // better to add error status code
      return res.send({ error: 'Not authorized to access this resource' })
    }
  }
}) 

server.post("/api/login", async (req, res) => {
  try {
    const {username, password} = req.body
    // unnecessary declaration? better to use then-catch
    const user = await models.userModel.findOne({username})
    if(!user){
      return res.status(401).send({message:"login error check credentials"})
    }
    if(sha512(password) !== user.password){
      return res.status(401).send({message:"login error check password"})
    }
    const token = jwt.sign({_id: user._id}, secret)
    res.status(201).send({user, token})
  } catch (error) {
    res.status(400).send(error)
  }

})

// add user
server.post("/api/register", async (req, res) => {

  try {
    const user = models.userModel( {
      username:req.body.username,
      password:sha512(req.body.password),
      admin:req.body.admin
    })
    user.save()
    const token = jwt.sign({_id: user._id}, secret)
    res.status(201).send({user, token})
  } catch (error) {
    res.status(400).send(error)
  }
})

// delete users
server.post('/api/delete', async (req, res) => {
  try {
    await models.userModel.findByIdAndDelete(req.body.id, (err, users) => {
      if(err){
        return res.status(400).json({message:err})
      }
      return res.status(201).json({message:"successful", users:users})
    })
  } catch (error) {
    if(error){
      return res.status(401).send({message:error})
    }
  }
})

server.post("/api/checkin", async(req, res) => {
  const customer = {
    firstName:req.body.firstName,
    lastName:req.body.lastName,
    email:req.body.email,
    phoneNumber:req.body.phoneNumber,
    tableNumber:req.body.tableNumber,
    checkInTime:moment().format()
  }
  let status, message
  try {
    await models.customerModel.create(customer).then(val => {
      console.log('create success')
      status = 201
      message = "postSuccessful"
      res.status(status).json({status:message, user:val})
    }).catch(reason => {
      if(reason){
        console.log(reason)
        status = 500
        res.status(status).json({status:reason})
      }
    })
  } catch (error) {
    if(error){
      console.log(error)
    }
  }

})

server.get('/api/getlist', async (req, res) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const data = jwt.verify(token, secret);
    // Redundant should use then catch rather than declare "user" 
    let user
    await models.userModel.findById({_id:data._id}, (err, doc) => {
      user = doc
    })
    if(!user){
      res.send({message:"failed"})
    }
    const queryResult = await models.customerModel.find().sort("-checkInTime").limit(100).exec();
    res.json(queryResult)
  } catch (error) {
    if(error){
      // should return res.status(401).json(error)
      console.log(error)
    }
  }
})

server.get('/api/getlist/bydate', async (req, res) => {
  try {
    let day = moment(new Date(req.query.date)).startOf('day')
    const token = req.header('Authorization').replace('Bearer ', '')
    const data = jwt.verify(token, secret);
    // redundant. should use then-catch rather than declaring "user"
    let user
    await models.userModel.findById({_id:data._id}, (err, doc) => {
      user = doc
    })
    if(!user){
      // should add status
      return res.send({message:"failed"})
    }
    await models.customerModel.find({
      "checkInTime":{
        "$gte": day.toDate(),
        "$lte": moment(day).endOf('day').toDate()
      }
    }).sort("-checkInTime").exec((err, result) => {
      // should add status
      res.json(result)
    });
    
  } catch (error) {
    //should return res.status(400).json(error)
    console.log(error)
  }
})

server.get('/api/getlist/bylunch', async (req, res) => {
  try {
    let day = moment(new Date(req.query.date)).startOf('day')
    let end = moment(new Date(req.query.date)).startOf('day')
    const token = req.header('Authorization').replace('Bearer ', '')
    const data = jwt.verify(token, "Asukaisalwaysfunny");
    // better to use then catch
    let user
    await models.userModel.findById({_id:data._id}, (err, doc) => {
      if(err){console.log(err)}
      user = doc
    })
    if(!user){
      // add status
      return res.send({message:"failed"})
    }
    await models.openHourModel.find().exec((err, opening) => {
      day.set({
        h:opening[0].lunchOpen.h, m:opening[0].lunchOpen.m
      })
      end.set({
        h:opening[0].lunchClose.h, m:opening[0].lunchClose.m
      }).format()
      models.customerModel.find({
        "checkInTime":{
          "$gte": day.toDate(),
          "$lte": end.toDate()
        }
      }).sort("-checkInTime").exec((err, result) => {
        res.json(result)
      });
    })
    
  } catch (error) {
    // should return res.status.json
    console.log(error)
  }
})

server.get('/api/getlist/bydinner', async (req, res) => {
  try {
    let day = moment(new Date(req.query.date)).startOf('day')
    let end = moment(new Date(req.query.date)).startOf('day')
    const token = req.header('Authorization').replace('Bearer ', '')
    const data = jwt.verify(token, secret);
    // better to use then catch
    let user
    await models.userModel.findById({_id:data._id}, (err, doc) => {
      if(err){console.log(err)}
      user = doc
    })
    if(!user){
      return res.send({message:"failed"})
    }
    await models.openHourModel.find().exec((err, opening) => {
      day.set({
        h:opening[0].dinnerOpen.h, m:opening[0].dinnerOpen.m
      })
      end.set({
        h:opening[0].dinnerClose.h, m:opening[0].dinnerClose.m
      }).format()
      models.customerModel.find({
        "checkInTime":{
          "$gte": day.toDate(),
          "$lte": end.toDate()
        }
      }).sort("-checkInTime").exec((err, result) => {
        res.json(result)
      });
    })
    
  } catch (error) {
    // should return res.status.json
    console.log(error)
  }
})

server.post('/api/download', async (req, res) => {
  const token = req.header('Authorization').replace('Bearer ', '')
  const data = jwt.verify(token, secret);
  // use then catch
  let user
  await models.userModel.findById({_id:data._id}, (err, doc) => {
    user = doc
  })
  if(!user){
    // should return error status
    res.send({message:"failed"})
  }
  let day = moment(new Date(req.body.startDate)).startOf('day')
  let end = moment(new Date(req.body.endDate)).startOf('day')
  await models.customerModel.find({
    "checkInTime":{
      "$gte": day.toDate(),
      "$lte": end.toDate()
    }
  }).sort("-checkInTime").exec((err, result) => {
    if(err){
      res.status(401).send({message:err})
    }
    res.status(201).json(result)
  })
})

server.get('/api/getusers', async (req, res) => {
  try {

    const token = req.header('Authorization').replace('Bearer ', '')
    const data = jwt.verify(token, secret);
    // use then catch
    let user
    await models.userModel.find({_id: data._id}, (err, doc) => {
      user = doc
    })
    if(!user){
      // add status
      return res.send({message:"failed"})
    }
    await models.userModel.find().exec((err, result) => {
      // add status
      res.json(result)
    });
  } catch (error) {
    if(error){
      // return res status json
      console.log(error)
    }
  }
})

server.use((req, res) => {
  res.sendFile(path.join(__dirname, './client/build', 'index.html'))
})

server.listen(port, () => {
  console.log(`server listening at port: ${port}`)
})