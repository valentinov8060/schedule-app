import mysql from 'mysql'
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import { executeQuery, executeParameterizedQuery } from "../model/query.js";
import { validation } from "../validation/validation.js";
import { 
  loginUserValidationSchema
} from "../validation/user-validation.js";
import { ResponseError } from "../error/error.js";

const loginUser = async (reqBody) => {
  // create connection
  const connection = mysql.createConnection('mysql://root@localhost:3306/schedule-app');

  // check request body
  const reqBodyValidation = validation(loginUserValidationSchema, reqBody)
  // check user from request body
  const queryGetUserPasswordByReqBodyUser = `
    SELECT * FROM \`users\` 
    WHERE user = ?;
  `
  const valuesGetUserPasswordByReqBodyUser = [reqBodyValidation.user]
  const getUserPasswordByReqBodyUser = await executeParameterizedQuery(connection, queryGetUserPasswordByReqBodyUser, valuesGetUserPasswordByReqBodyUser)
    .then(result => result[0])
    .catch(error => {
      return error.message
    });
  if (!getUserPasswordByReqBodyUser) {
    throw new ResponseError (401, "Invalid user")
  }
  // check password from request body
  const checkPassword = await bcrypt.compare(reqBodyValidation.password, getUserPasswordByReqBodyUser.password)
  if (!checkPassword) {
    throw new ResponseError (401, "Invalid password")
  }

  // generate token
  const payload = {
    user : reqBodyValidation.user
  };

  connection.end()
  return jwt.sign(payload, 'valentinov', { expiresIn: '1h' });
} 

export {
  loginUser
}