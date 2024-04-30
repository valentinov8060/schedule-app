import bcrypt from "bcrypt"
import { v4 as uuidv4 } from 'uuid';

import { getResult } from "../model/query.js";
import { validation } from "../validation/validation.js";
import { 
  loginUserValidationSchema, 
  authorizationValidationSchema 
} from "../validation/user-validation.js";
import { ResponseError } from "../error/error.js";

const loginUser = async (reqBody) => {
  // check request body
  const reqBodyValidation = validation(loginUserValidationSchema, reqBody)
  // check user from request body
  const queryGetUserPasswordByReqBodyUser  = `SELECT * FROM \`schedule-app\`.\`users\` WHERE user = '${reqBodyValidation.user}'`
  const getUserPasswordByReqBodyUser = await getResult(queryGetUserPasswordByReqBodyUser)
    .then(result => result[0])
    .catch(error => {
      return error.message
    });
  if (!getUserPasswordByReqBodyUser) {
    throw new ResponseError (401, "User invalid")
  }
  // check password from request body
  const checkPassword = await bcrypt.compare(reqBodyValidation.password, getUserPasswordByReqBodyUser.password)
  if (!checkPassword) {
    throw new ResponseError (401, "Password invalid")
  }

  // generate token
  const token = uuidv4();
  const queryUpdateToken = `UPDATE \`schedule-app\`.\`users\` SET token = '${token}' WHERE user = '${reqBodyValidation.user}'`
  await getResult(queryUpdateToken)
    .catch(error => {
      throw new ResponseError (501, 'Error inserting token: ' + error.message)
    })
  return token
} 

const logoutUser = async (reqBody) => {
  // check request body
  const authorizationValidation = validation(authorizationValidationSchema, reqBody)
  // check user from authorization token
  const queryCheckUser = `SELECT user FROM \`schedule-app\`.\`users\` WHERE token = '${authorizationValidation}'`
  await getResult(queryCheckUser)
    .then(result => result[0].user)
    .catch(error => {
      throw new ResponseError (401, 'Error, user not found: ' + error.message) 
    })

  // remove token
  const queryRemoveToken = `UPDATE \`schedule-app\`.\`users\` SET token = NULL WHERE token = '${authorizationValidation}'`
  await getResult(queryRemoveToken)
    .catch(error => {
      throw new ResponseError (501, 'Error updating token: ' + error.message)
    })
}

export {
  loginUser,
  logoutUser
}