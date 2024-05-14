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

const token = async (req, res, next) => {
  res.status(200).json({
    data: `Token user ${req.auth} is authorized`
  })
}

export default {
  login,
  token
}