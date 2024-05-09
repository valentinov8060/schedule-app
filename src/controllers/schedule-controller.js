import {
  createSchedule,
  updateSchedule,
  removeSchedule,
  listSchedule,
  getUserSchedule
} from "../services/schedule-services.js";

const create = async (req, res, next) => {
  try {
    const view = await createSchedule(req.token, req.body)
    res.status(200).json({
      data: view
    })
  } catch (error) {
    next(error)
  }
} 

const update = async (req, res, next) => {
  try {
    const view = await updateSchedule(req.token, req.body, req.params.id_mata_kuliah)
    res.status(200).json({
      data: view
    })
  } catch (error) {
    next(error)
  }
}

const remove = async (req, res, next) => {
  try {
    await removeSchedule(req.token, req.params.id_mata_kuliah)
    res.status(200).json({
      data: "Mata Kuliah Berhasil Dihapus"
    })
  } catch (error) {
    next(error)
  }
}

const list = async (req, res, next) => {
  try {
    const view = await listSchedule()
    res.status(200).json({
      data: view
    })
  } catch (error) {
    next(error)
  }
}

const getUser = async (req, res, next) => {
  try {
    const view = await getUserSchedule(req.params.user)
    res.status(200).json({
      data: view
    })
  } catch (error) {
    next(error)
  }
}

export default {
  create,
  update,
  remove,
  list,
  getUser
}