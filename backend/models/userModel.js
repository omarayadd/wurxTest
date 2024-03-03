const mongoose = require('mongoose')


const workingHoursSchema = new mongoose.Schema({
    start: {
      type: String,
    },
    end: {
      type: String,
    }
  });

const userSchema = mongoose.Schema({
    name:{
        type: String,
       // required:[true, 'Please add your name'],
        minlength: 2, 
        maxlength: 50 
    },
    phone:{
        type: [String],
       // required:[true, 'Please add phone number']
    },
    email:{
        type: String,
       // required: [true, 'Please add email'],
        unique: true
    },
    position:{
        type: String,
       // required:[true, 'Please add a position']
    },
    companyName:{
        type: String,
        default:""
    },
    website: {
        type: String,
        validate: {
          validator: function(value) {
            return /^(ftp|http|https):\/\/[^ "]+$/.test(value);
          },
          message: props => `${props.value} is not a valid URL!`
        },
      },
    workingHours: {
        type: workingHoursSchema,
        //default:""
      },
     
    languages: {
        type: [String],
        default: []
      },
    facebook:{
        type:String,
        validate: {
            validator: function(value) {
              return /^(ftp|http|https):\/\/[^ "]+$/.test(value);
            },
            message: props => `${props.value} is not a valid URL!`
          },

    },
    instagram:{
        type:String,
        validate: {
            validator: function(value) {
              return /^(ftp|http|https):\/\/[^ "]+$/.test(value);
            },
            message: props => `${props.value} is not a valid URL!`
          },
    },
    xTwitter:{
        type:String,
        validate: {
            validator: function(value) {
              return /^(ftp|http|https):\/\/[^ "]+$/.test(value);
            },
            message: props => `${props.value} is not a valid URL!`
          },

    },
    linkedIn:{
        type:String,
        validate: {
            validator: function(value) {
              return /^(ftp|http|https):\/\/[^ "]+$/.test(value);
            },
            message: props => `${props.value} is not a valid URL!`
          },
    },

},{
    timestamps: true,
}
)

module.exports = mongoose.model('User', userSchema)