import { executeQuery, executeParameterizedQuery } from "../model/query.js"

const authMiddleware = async (req, res, next) => {
  const token = req.get('Authorization')
  if(!token) {
    res.status(401).json({ 
      error: 'Unauthorized' 
    }).end()
  } else {
    const user = await executeParameterizedQuery(`SELECT user FROM \`schedule-app\`.\`users\` WHERE token = ?`, [token])
      .then(result => result)
    if (!user) {
      res.status(401).json({ 
        error: 'Unauthorized' 
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