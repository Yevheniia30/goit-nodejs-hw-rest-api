const mongoose = require('mongoose')
const { Schema } = mongoose

const сontactSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  favorite: {
    type: Boolean,
    default: false
  }
},
{
  versionKey: false,
  timestamps: true,
  toObject: {
    virtuals: true,
    transform: function (doc, ret) {
      delete ret._id
      delete ret.fullName
      return ret
    }
  },
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      delete ret._id
      delete ret.fullName
      return ret
    }
  }
})

сontactSchema.virtual('fullName').get(function () {
  return `This is contact ${this.name} - phone number ${this.phone}`
})

сontactSchema.path('name').validate((value) => {
  const re = /[A-Z]\w+ [A-Z]\w+/
  //   const re = /^[-a-zA-Z ]*$/
  return re.test(String(value))
})

const Contact = mongoose.model('contact', сontactSchema)

module.exports = Contact
