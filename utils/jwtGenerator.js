const jwt = require('jsonwebtoken')

function jwtGenerator(user_id) {
  const payload = {
    user: {
      id: user_id,
    },
  }

  //the code below was the code written from the tutorial
  //Look at file server/routes/dashboard.js to see the change code for this code

  //   function jwtGenerator(user_id) {
  //   const payload = {
  //     user: user_id
  //   };

  const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1h',
  })

  return jwtToken
}

module.exports = jwtGenerator
