const router = require('express').Router()
const authorize = require('../middleware/authorize')
const pool = require('../db')

//all todos and name

router.get('/', authorize, async (req, res) => {
  try {
    // const user = await pool.query(
    //   "SELECT user_name FROM users WHERE user_id = $1",
    //   [req.user.id]
    // );

    const user = await pool.query(
      'SELECT u.user_name, t.todo_id, t.description FROM users AS u LEFT JOIN todos AS t ON u.user_id = t.user_id WHERE u.user_id = $1',
      [req.user.id]
    )

    res.json(user.rows)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

//create a todo

router.post('/todos', authorize, async (req, res) => {
  try {
    const { description } = req.body
    const newTodo = await pool.query(
      'INSERT INTO todos (user_id, description) VALUES ($1, $2) RETURNING *',
      [req.user.id, description]
    )

    res.json(newTodo.rows[0])
  } catch (err) {
    console.error(err.message)
  }
})

//update a todo

router.put('/todos/:id', authorize, async (req, res) => {
  try {
    const { id } = req.params
    const { description } = req.body
    const updateTodo = await pool.query(
      'UPDATE todos SET description = $1 WHERE todo_id = $2 AND user_id = $3 RETURNING *',
      [description, id, req.user.id]
    )

    if (updateTodo.rows.length === 0) {
      return res.json('This todo is not yours')
    }

    res.json('Todo was updated')
  } catch (err) {
    console.error(err.message)
  }
})

//delete a todo

router.delete('/todos/:id', authorize, async (req, res) => {
  try {
    const { id } = req.params
    const deleteTodo = await pool.query(
      'DELETE FROM todos WHERE todo_id = $1 AND user_id = $2 RETURNING *',
      [id, req.user.id]
    )

    if (deleteTodo.rows.length === 0) {
      return res.json('This Todo is not yours')
    }

    res.json('Todo was deleted')
  } catch (err) {
    console.error(err.message)
  }
})

module.exports = router

/*
GET http://localhost:5000/dashboard/
header
  jwt_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo0fSwiaWF0IjoxNjAxNzUyMzk2LCJleHAiOjE2MDE3NTU5OTZ9.wRWYE1leDTPC-Kq_DucEU5koxHWIrGRWiq_SB4Vx6vY

output:
[
    {
        "user_name": "test22",
        "todo_id": null,
        "description": null
    }
]

------------------------
POST http://localhost:5000/dashboard/todos
jwt_token: same as above
body
{
 "description":"I need to take a nap."             
}
output
200 OK
{
    "todo_id": 4,
    "user_id": 4,
    "description": "I need to take a nap."
}

---------
GET http://localhost:5000/dashboard/
header
  jwt_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo0fSwiaWF0IjoxNjAxNzUyMzk2LCJleHAiOjE2MDE3NTU5OTZ9.wRWYE1leDTPC-Kq_DucEU5koxHWIrGRWiq_SB4Vx6vY

output:
[
    {
        "user_name": "test22",
        "todo_id": 4,
        "description": "I need to take a nap."
    }
]

*/
