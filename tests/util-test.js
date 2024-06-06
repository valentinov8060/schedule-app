import bycrypt from 'bcrypt'
import mysql from 'mysql'

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

export {
  createUserTest,
  removeUserTest
}