import mysql from 'mysql'
import jwt from 'jsonwebtoken'

import { executeQuery, executeParameterizedQuery } from "../model/query.js"

const authMiddleware = async (req, res, next) => {
  const token = req.get('Authorization')
  if(!token) {
    res.status(401).json({
      error: `Unauthorized: where is your token?` 
    }).end()
  } else {
    const tokenDecoded = jwt.verify(token, 'valentinov', (err, decoded) => (err ? err : decoded)) 

    if(!tokenDecoded.user) {
      res.status(401).json({ 
        error: `Unauthorized: no user or ${tokenDecoded.message}` 
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