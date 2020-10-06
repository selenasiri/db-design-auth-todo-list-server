const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const pool = require('../db')
const validInfo = require('../middleware/validInfo')
const jwtGenerator = require('../utils/jwtGenerator')
const authorize = require('../middleware/authorize')

//authorizeentication

router.post('/register', validInfo, async (req, res) => {
  const { email, name, password } = req.body

  try {
    const user = await pool.query('SELECT * FROM users WHERE user_email = $1', [
      email,
    ])

    if (user.rows.length > 0) {
      return res.status(401).json('User already exist!')
    }

    const salt = await bcrypt.genSalt(10)
    const bcryptPassword = await bcrypt.hash(password, salt)

    let newUser = await pool.query(
      `INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) 
          RETURNING user_id,user_name, user_email`,
      [name, email, bcryptPassword]
    )

    const { user_id, user_name, user_email } = newUser.rows[0]
    const token = jwtGenerator(user_id)

    return res.json({
      token,
      user: { id: user_id, name: user_name, email: user_email },
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

router.post('/login', validInfo, async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await pool.query('SELECT * FROM users WHERE user_email = $1', [
      email,
    ])

    if (user.rows.length === 0) {
      return res.status(401).json('Invalid Credential')
    }

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    )

    if (!validPassword) {
      return res.status(401).json('Invalid Credential')
    }

    const { user_id, user_name, user_email } = user.rows[0]
    const token = jwtGenerator(user_id)

    return res.json({
      token,
      user: { id: user_id, name: user_name, email: user_email },
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

router.get('/verify', authorize, (req, res) => {
  try {
    res.json(true)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

module.exports = router

/*
POST http://localhost:5000/auth/register
input
{
    "name": "test22",
     "email": "test22@gmail.com",
     "password":"test123"         
}
out:
200 OK
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo0fSwiaWF0IjoxNjAxNzUyMjQxLCJleHAiOjE2MDE3NTU4NDF9.IBEiIuEtriRNFpXcQS8ly4bB8xPKWiML8PaQc6RloBE"
}

---------------------------------
POST http://localhost:5000/auth/login
input
{
     "email": "test22@gmail.com",
     "password":"test123"         
}
out:
200 OK
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo0fSwiaWF0IjoxNjAxNzUyMzk2LCJleHAiOjE2MDE3NTU5OTZ9.wRWYE1leDTPC-Kq_DucEU5koxHWIrGRWiq_SB4Vx6vY"
}

-------------------
GET http://localhost:5000/auth/verify
header
token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo0fSwiaWF0IjoxNjAxNzUyMzk2LCJleHAiOjE2MDE3NTU5OTZ9.wRWYE1leDTPC-Kq_DucEU5koxHWIrGRWiq_SB4Vx6vY

output
200 PL
true
*/
