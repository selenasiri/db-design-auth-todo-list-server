-- CREATE DATABASE authtodo;

-- CREATE TABLE users(
--   user_id uuid DEFAULT uuid_generate_v4(),
--   user_name VARCHAR(255) NOT NULL,
--   user_email VARCHAR(255) NOT NULL UNIQUE,
--   user_password VARCHAR(255) NOT NULL,
--   PRIMARY KEY(user_id)
-- );

-- CREATE TABLE todo(
--   todo_id SERIAL,
--   user_id UUID ,
--   description VARCHAR(255),
--   PRIMARY KEY (todo_id),
--   FOREIGN KEY (user_id) REFERENCES users(user_id)
-- );


CREATE DATABASE authtodolist;

--users

CREATE TABLE users(
  user_id SERIAL PRIMARY KEY,
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL UNIQUE,
  user_password VARCHAR(255) NOT NULL
);

--todos

CREATE TABLE todos(
  todo_id SERIAL,
  user_id INTEGER,
  description VARCHAR(255) NOT NULL,
  PRIMARY KEY (todo_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

--fake users data

insert into users (user_name, user_email, user_password) values ('test1', 'test1@gmail.com', 'test123');

--fake todos data

insert into todos (user_id, description) values (1, 'clean room');

-------
authtodolist=> \d
               List of relations
 Schema |       Name        |   Type   | Owner
--------+-------------------+----------+-------
 public | todos             | table    | dba
 public | todos_todo_id_seq | sequence | dba
 public | users             | table    | dba
 public | users_user_id_seq | sequence | dba
(4 rows)


authtodolist=> insert into users (user_name, user_email, user_password) values (
'test1', 'test1@gmail.com', 'test123');
INSERT 0 1
authtodolist=> select * from users;
 user_id | user_name |   user_email    | user_password
---------+-----------+-----------------+---------------
       1 | test1     | test1@gmail.com | test123
(1 row)


authtodolist=> insert into todos (user_id, description) values (2, 'clean room')
;
ERROR:  insert or update on table "todos" violates foreign key constraint "todos
_user_id_fkey"
DETAIL:  Key (user_id)=(2) is not present in table "users".
authtodolist=>
authtodolist=>
authtodolist=>
authtodolist=>
authtodolist=> insert into todos (user_id, description) values (1, 'clean room')
;
INSERT 0 1
authtodolist=> select * from todos;
 todo_id | user_id | description
---------+---------+-------------
       2 |       1 | clean room

