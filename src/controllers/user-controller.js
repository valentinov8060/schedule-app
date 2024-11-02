import {
  loginUser,
} from "../services/user-services.js";

const login = async (req, res, next) => {
  try {
    const view = await loginUser(req.body)
    res.status(200).json({
      data: view
    })
  } catch (error) {
    next(error)
  }
}

const authentication = async (req, res, next) => {
  const view = `Token user ${req.auth} is authorized`
  res.status(200).json({
    data: view
  })
}

export default {
  login,
  authentication
}