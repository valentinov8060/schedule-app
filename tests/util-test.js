import bycrypt from 'bcrypt'
import mysql from 'mysql'
import jwt from 'jsonwebtoken'

import {
  executeQuery,
  executeParameterizedQuery
} from '../src/model/query'

const createUserTest = () => {
  const user = "test"
  const password = bycrypt.hashSync("test", 10)

  var connection = mysql.createConnection('mysql://root@localhost:3306/schedule-app');
  executeQuery(connection, `INSERT INTO \`users\` (user, password) VALUES ('${user}', '${password}')`)
  connection.end()
}

const removeUserTest = () => {
  var connection = mysql.createConnection('mysql://root@localhost:3306/schedule-app');
  executeQuery(connection, `DELETE FROM \`users\` WHERE user = 'test'`)
  connection.end()
}

const getTokenUserTest = () => {
  const user = "test"
  const password = bycrypt.hashSync("test", 10)
  const payload = {
    user : user
  }
  const token = jwt.sign(payload, 'valentinov', { expiresIn: '1h' })
  return token
}

export {
  createUserTest,
  removeUserTest,
  getTokenUserTest
}