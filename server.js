require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')

//middleware

app.use(cors())
app.use(express.json())

//routes

app.use('/auth', require('./routes/jwtAuth'))

app.use('/dashboard', require('./routes/dashboard'))

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`Server is starting on port ${port}`)
})
