import {
  loginUser,
  logoutUser
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

const logout = async (req, res, next) => {
  try {
    await logoutUser(req.token)
    res.status(200).json({
      data: "Logout success"
    })
  } catch (error) {
    next(error)
  }
} 

export default {
  login,
  logout
}