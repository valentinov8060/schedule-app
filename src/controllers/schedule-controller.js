import {
  createSchedule,
  updateSchedule,
  removeSchedule,
  listSchedule
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
    const queryParamsValues = {
      page: req.query.page,
      size: req.query.size
    }
    const view = await listSchedule(queryParamsValues)
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
  list
}