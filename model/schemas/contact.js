const mongoose = require('mongoose')
const { Schema, SchemaTypes } = mongoose
const mongoosePaginate = require('mongoose-paginate-v2')

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
  },
  owner: {
    type: SchemaTypes.ObjectId,
    ref: 'user'
  },
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

сontactSchema.plugin(mongoosePaginate)

const Contact = mongoose.model('contact', сontactSchema)

module.exports = Contact
