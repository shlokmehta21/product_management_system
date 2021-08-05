const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    prodid: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    manufacturer: {
        type: String,
        required: true
    },
    qty:{
        type: Number,
        default: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
    },
    prange:{
        type: String
    },
    pdate:{
        type: Date
    },
    wdate:{
        type: Date
    },
    desc: {
       type: String 
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    coverImage: {
        type: Buffer,
        required: true
    },
    coverImageType: {
        type: String,
        required: true
    }
}, { timestamps: true });

productSchema.virtual('coverImagePath').get(function() {
    if (this.coverImage != null && this.coverImageType != null) {
      return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
  });

const Prodcut = mongoose.model('Prodcut',productSchema);

module.exports = Prodcut;