// require statements
const express = require("express")
const mongoose = require("mongoose")
const methodOverride = require("method-override")
const app = express()
const authorsController = require('./controllers/authors') 
const articlesController = require('./controllers/articles')

// database connection
const connectionString = 'mongodb://localhost/blog'

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})

mongoose.connection.on('connected', () => console.log(`Mongoose connected to ${connectionString}`))
mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'))
mongoose.connection.on('error', (err) => console.log('Mongoose error', err))

// middleware
// parses data from forms and adds it to the body object of the request
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))

// routes
app.get('/', (req, res) => {
    res.render('home.ejs')
})

// when requests with a pathname that begins with '/authors' comes in, mount those requests
// to the authors controller
app.use('/authors', authorsController)
app.use('/articles', articlesController)

// listen
const PORT = 3005
app.listen(PORT, () => {
    console.log('Listening on port: ' + PORT)
})