import Joi from "joi";

const authorizationValidationSchema = Joi.string().min(36).max(36).required()

const idMatkulPathValidationSchema = Joi.string().min(36).max(36).required()

const createScheduleValidationSchema = Joi.object({
  mata_kuliah: Joi.string().max(255).required(),
  nama_kelas: Joi.string().max(10).required(),
  sks: Joi.number().min(1).max(6).required(),
  hari: Joi.string().valid('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu').required(),
  jam_mulai: Joi.number().required(),
  jam_selesai: Joi.number().required().greater(Joi.ref('jam_mulai')),
  ruangan: Joi.string().max(255).required(),
});

const updateScheduleValidationSchema = Joi.object({
  mata_kuliah: Joi.string().max(255).required(),
  nama_kelas: Joi.string().max(10).required(),
  sks: Joi.number().min(1).max(6).required(),
  hari: Joi.string().valid('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu').required(),
  jam_mulai: Joi.number().required(),
  jam_selesai: Joi.number().required().greater(Joi.ref('jam_mulai')),
  ruangan: Joi.string().max(255).required(),
})

const listScheduleValidationSchema = Joi.object({
  page: Joi.number().min(1).positive().default(1),
  size: Joi.number().min(1).max(100).positive().default(10)
})

export {
  authorizationValidationSchema,
  idMatkulPathValidationSchema,
  createScheduleValidationSchema,
  updateScheduleValidationSchema,
  listScheduleValidationSchema
}