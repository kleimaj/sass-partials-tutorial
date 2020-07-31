// require statements
const express = require("express")
const mongoose = require("mongoose")
const methodOverride = require("method-override")
const app = express()



const PORT = 3005
app.listen(PORT, () => {
    console.log('Listening on port: ' + PORT)
})
