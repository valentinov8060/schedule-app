import bycrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import {
  executeQuery,
} from '../src/model/query'

const createUserTest = async () => {
  const user = "test"
  const password = bycrypt.hashSync("test", 10)

  await executeQuery(`INSERT INTO \`users\` (user, password) VALUES ('${user}', '${password}')`)
}

const removeUserTest = async () => {
  await executeQuery(`DELETE FROM \`users\` WHERE user = 'test'`)
}

const getTokenUserTest = () => {
  const user = "test"
  const payload = { user: user }
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })
  return token
}

const removeScheduleTest = async () => {
  await executeQuery(`DELETE FROM \`schedules\` WHERE mata_kuliah  = 'Test'`)
}

const getIdScheduleTest = async () => {
  const idMataKuliah = await executeQuery(`SELECT id_mata_kuliah FROM \`schedules\` WHERE user = 'test'`)
    .then(result => result[0].id_mata_kuliah)

  return idMataKuliah
}

export {
  createUserTest,
  removeUserTest,
  getTokenUserTest,
  removeScheduleTest,
  getIdScheduleTest
}