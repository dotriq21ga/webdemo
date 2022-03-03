const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);


// option Schema
const OptionSchema = mongoose.Schema({
  game: {
    type: String,
    required: true
  },
  img: {
    type: String,
    required: true
  },
  slug: { 
    type: String, 
    slug: "game" 
  }
});
const Option = mongoose.model('Option', OptionSchema);
module.exports.Option = Option;