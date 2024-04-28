import { getResult } from "../model/query.js"
import { connection } from "../model/connection.js"

const authMiddleware = async (req, res, next) => {
  const token = req.get('Authorization')
  if(!token) {
    res.status(401).json({ 
      error: 'Unauthorized auth' 
    }).end()
  } else {
    const user = await getResult(`SELECT user FROM \`schedule-app\`.\`users\` WHERE token = '${token}'`)
      .then(result => result)
    if (!user) {
      res.status(401).json({ 
        error: 'Unauthorized auth' 
      }).end()
    } else {
      req.token = token
      next()
    }
  }
}

export {
  authMiddleware
}