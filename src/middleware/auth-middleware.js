import mysql from 'mysql'
import jwt from 'jsonwebtoken'
import Joi from 'joi'

import { executeQuery, executeParameterizedQuery } from "../model/query.js"

const authMiddleware = async (req, res, next) => {
  const token = req.get('Authorization')
  const tokenValidationSchema = Joi.string().pattern(
    /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/,
    'JWT'
  )
  if(tokenValidationSchema.validate(token).error) {
    res.status(401).json({
      error: `${tokenValidationSchema.validate(token).error.message}` 
    }).end()
  } else {
    const tokenDecoded = jwt.verify(token, 'valentinov', (err, decoded) => (err ? err : decoded)) 
    if(tokenDecoded.expiredAt) {
      res.status(401).json({ 
        error: `Error: your token expired at ${tokenDecoded.expiredAt}` 
      }).end()
    } else {
      const connection = mysql.createConnection('mysql://root@localhost:3306/schedule-app');
      const user = await executeParameterizedQuery(connection, `SELECT user FROM \`users\` WHERE user = ?`, [tokenDecoded.user])
        .then(result => result[0].user)
      connection.end()

      if (!user) {
        res.status(401).json({ 
          error: 'Unauthorized no user from database'
        }).end()
      } else {
        req.auth = user
        next()
      }
    }

  }

}

export {
  authMiddleware
}