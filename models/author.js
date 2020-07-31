const mongoose = require("mongoose")
const Article = require('./article')

const authorSchema = new mongoose.Schema({
    name: String,
    // creating a relationship through a reference
    articles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    }]
})

const Author = mongoose.model('Author', authorSchema)

module.exports = Author
