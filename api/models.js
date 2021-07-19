const mongoose = require("mongoose");
const sha512 = require("js-sha512")

mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true, retryWrites:false }
);

const db = mongoose.connection;
db.once("open", () => console.log("connected to the database"));
db.on("error", console.error.bind(console, "MongoDB connection error:"));
const Schema = mongoose.Schema;

const customerSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    email:String,
    phoneNumber:String,
    tableNumber:Number,
    checkInTime:Date
  },
  {versionKey:false}
);

const openingHoursSchema = new Schema({
  lunchOpen: {
    h:String,
    m:String  
  },
  lunchClose: {
    h: String,
    m:String
  },
  dinnerOpen: {
    h:String,
    m:String
  },
  dinnerClose: {
    h:String,
    m:String
  }
})

const userSchema = new Schema(
  {
    username: String,
    password: String,
    admin:Boolean,
    tokens:[{
      token:{
        type:String,
      }
    }]
  }
);

userSchema.methods.generateAuthToken = async () => {
  const user = this
  const token = jwt.sign({_id: user._id}, "Asukaisalwaysfunny")
  user.tokens = user.tokens.concat({token})
  await user.save()
  return token
}

const customerModel = db.model("tatsu-signin", customerSchema, "tatsu-signin");
const userModel = db.model("tatsu-user", userSchema, "tatsu-user");
const openHourModel = db.model("tatsu-opening-hours", openingHoursSchema, "tatsu-opening-hours");

module.exports = {
  customerModel,
  userModel,
  openHourModel,
}