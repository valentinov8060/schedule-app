import Joi from "joi";

import { ResponseError } from "../error/error.js";

const createScheduleValidationSchema = Joi.object({
  mata_kuliah: Joi.string().max(255).required(),
  nama_kelas: Joi.string().max(10).required(),
  sks: Joi.number().min(1).max(6).required(),
  hari: Joi.string().valid('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu').required(),
  jam_mulai: Joi.string().pattern(/^([01]?[0-9]|2[0-3])[0-5][0-9][0-5][0-9]$/).required(),
  jam_selesai: Joi.string().pattern(/^([01]?[0-9]|2[0-3])[0-5][0-9][0-5][0-9]$/).required(),
  ruangan: Joi.string().max(255).required(),
});

const updateScheduleValidationSchema = Joi.object({
  mata_kuliah: Joi.string().max(255).required(),
  nama_kelas: Joi.string().max(10).required(),
  sks: Joi.number().min(1).max(6).required(),
  hari: Joi.string().valid('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu').required(),
  jam_mulai: Joi.string().pattern(/^([01]?[0-9]|2[0-3])[0-5][0-9][0-5][0-9]$/).required(),
  jam_selesai: Joi.string().pattern(/^([01]?[0-9]|2[0-3])[0-5][0-9][0-5][0-9]$/).required(),
  ruangan: Joi.string().max(255).required(),
})

const removeScheduleValidationSchema = Joi.string().min(36).max(36).required()

const getUserScheduleValidationSchema = Joi.string().max(255).required()

function clockValidation (jam_mulai, jam_selesai) {
  jam_mulai = parseFloat(jam_mulai);
  jam_selesai = parseFloat(jam_selesai);

  if (jam_mulai > jam_selesai) {
    throw new ResponseError (401, 'Jam selesai harus lebih besar dari jam mulai')
  } 
}

export {
  createScheduleValidationSchema,
  updateScheduleValidationSchema,
  removeScheduleValidationSchema,
  getUserScheduleValidationSchema,
  clockValidation
}