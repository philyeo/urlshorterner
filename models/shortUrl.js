//Model for shortUrl document
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const urlSchema = new Schema({
  original_url: {type: String, required: true},
  short_url: Number
}, {timestamps: true});

let Model = mongoose.model('Url', urlSchema)

module.exports = Model;