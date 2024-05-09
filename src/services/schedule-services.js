import { v4 as uuidv4 } from 'uuid';

import { executeQuery, executeParameterizedQuery } from "../model/query.js";
import { validation } from "../validation/validation.js";
import {
  authorizationValidationSchema,
  idMatkulPathValidationSchema,
  createScheduleValidationSchema,
  updateScheduleValidationSchema,
  getUserScheduleValidationSchema
} from "../validation/schedule-validation.js";
import { ResponseError } from "../error/error.js";

const createSchedule = async (headerAuthorization, reqBody) => {
  // check authorization token
  const authorizationValidation = validation(authorizationValidationSchema, headerAuthorization)
  // check user from authorization token
  const queryGetUser = `
    SELECT user FROM \`schedule-app\`.\`users\` 
    WHERE token = ?
  `
  const valuesGetUser = [authorizationValidation]
  const user = await executeParameterizedQuery(queryGetUser, valuesGetUser)
    .then(result => result[0].user)
    .catch(error => {
      throw new ResponseError (401, 'Error, user not found: ' + error.message)
    })
  // check request body
  const reqBodyValidation = validation(createScheduleValidationSchema, reqBody)

  // check jam
  function checkJam (jam_mulai, jam_selesai) {
    jam_mulai = parseFloat(jam_mulai);
    jam_selesai = parseFloat(jam_selesai);
  
    if (jam_mulai > jam_selesai) {
      throw new ResponseError (401, 'Jam selesai harus lebih besar dari jam mulai')
    } 
  }
  checkJam(reqBodyValidation.jam_mulai, reqBodyValidation.jam_selesai)

  // check kelas 
  const queryCheckNamaKelas = `
    SELECT COUNT(*) AS count 
    FROM \`schedule-app\`.\`schedules\` 
    WHERE nama_kelas = ?
  `
  const valuesCheckNamaKelas = [reqBodyValidation.nama_kelas]
  const checkKelas = await executeParameterizedQuery(queryCheckNamaKelas, valuesCheckNamaKelas)
    .then(result => result[0].count)
  if (checkKelas > 0) {
    throw new ResponseError (401, 'Kelas sudah ada')
  }


  // create data
  const id_mata_kuliah = uuidv4();
  const {mata_kuliah, nama_kelas, sks, hari, jam_mulai, jam_selesai, ruangan} = reqBodyValidation

  // insert data
  const queryAddShechedule = `
    INSERT INTO \`schedule-app\`.\`schedules\` 
    (id_mata_kuliah, mata_kuliah, nama_kelas, sks, hari, jam_mulai, jam_selesai, ruangan, user)
    SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?
    WHERE NOT EXISTS (
      SELECT 1
      FROM \`schedule-app\`.\`schedules\`
      WHERE hari = ? 
        AND (
          (? BETWEEN jam_mulai AND jam_selesai)
          OR (? BETWEEN jam_mulai AND jam_selesai)
          OR (? < jam_mulai AND ? > jam_selesai)
        )
        AND ruangan = ?
    );
  `
  const valuesAddShechedule = [id_mata_kuliah, mata_kuliah, nama_kelas, sks, hari, jam_mulai, jam_selesai, ruangan, user, hari, jam_mulai, jam_selesai, jam_mulai, jam_selesai, ruangan]
  const checkSchedule = await executeParameterizedQuery(queryAddShechedule, valuesAddShechedule)
    .then(result => result.affectedRows)
  if (checkSchedule === 0) {
    throw new ResponseError (401, 'Jadwal Bentrok')
  }

  // create response
  const queryGetSchedule = `
    SELECT * FROM \`schedule-app\`.\`schedules\` 
    WHERE id_mata_kuliah = ?
  `
  const valuesGetSchedule = [id_mata_kuliah]
  const response = await executeParameterizedQuery(queryGetSchedule, valuesGetSchedule)
    .then(result => result[0])
    .catch(error => {
      throw new ResponseError (501, 'Error getting schedule:' + error.message)
    })
  return response
}

const updateSchedule = async (headerAuthorization, reqBody, pathIdMatkul) => {
  // check authorization token
  const authorizationValidation = validation(authorizationValidationSchema, headerAuthorization)
  // check user from authorization token
  const queryGetUser = `
    SELECT user FROM \`schedule-app\`.\`users\` 
    WHERE token = ?
  `
  const valuesGetUser = [authorizationValidation]
  const user = await executeParameterizedQuery(queryGetUser, valuesGetUser)
    .then(result => result[0].user)
    .catch(error => {
      throw new ResponseError (401, 'Error, user not found: ' + error.message)
    })
  // check request body
  const reqBodyValidation = validation(updateScheduleValidationSchema, reqBody)
  // check query path id_mata_kuliah
  const idMatkulValidation = validation(idMatkulPathValidationSchema, pathIdMatkul)
  // check id_mata_kuliah from query path
  const queryCheckPathIdMatkul = `
    SELECT id_mata_kuliah, user FROM \`schedule-app\`.\`schedules\` 
    WHERE id_mata_kuliah = ? AND user = ?
  `
  const valuesCheckPathIdMatkul = [idMatkulValidation, user]
  const IdMatkul = await executeParameterizedQuery(queryCheckPathIdMatkul, valuesCheckPathIdMatkul)
    .then(result => result[0].id_mata_kuliah)
    .catch(error => {
      throw new ResponseError (401, 'Error, Bukan Mata Kuliah Anda: ' + error.message)
    })

  // check jam
  function checkJam (jam_mulai, jam_selesai) {
    jam_mulai = parseFloat(jam_mulai);
    jam_selesai = parseFloat(jam_selesai);
  
    if (jam_mulai > jam_selesai) {
      throw new ResponseError (401, 'Jam selesai harus lebih besar dari jam mulai')
    } 
  }
  checkJam(reqBodyValidation.jam_mulai, reqBodyValidation.jam_selesai)

  // check kelas
  const queryCheckNamaKelas = `
    SELECT COUNT(*) AS count FROM \`schedule-app\`.\`schedules\` 
    WHERE nama_kelas = ?
  `
  const valuesCheckNamaKelas = [reqBodyValidation.nama_kelas]
  const checkKelas = await executeParameterizedQuery(queryCheckNamaKelas, valuesCheckNamaKelas)
    .then(result => result[0].count)
  if (checkKelas > 1) {
    throw new ResponseError (401, 'Kelas sudah ada')
  }

  // create data
  const {mata_kuliah, nama_kelas, sks, hari, jam_mulai, jam_selesai, ruangan} = reqBodyValidation

  // insert data
  const queryUpdateSchedule = `
    UPDATE \`schedule-app\`.\`schedules\`
    SET mata_kuliah = ?, nama_kelas = ?, sks = ?, hari = ?, jam_mulai = ?, jam_selesai = ?, ruangan = ?, user = ?
    WHERE id_mata_kuliah = ?
      AND NOT EXISTS (
        SELECT 1
        FROM \`schedule-app\`.\`schedules\`
        WHERE hari = ? 
          AND (
            (? BETWEEN jam_mulai AND jam_selesai)
            OR (? BETWEEN jam_mulai AND jam_selesai)
            OR (? < jam_mulai AND ? > jam_selesai)
          )
          AND ruangan = ?
      );
  `
  const valuesUpdateSchedule = [
    mata_kuliah,
    nama_kelas,
    sks,
    hari,
    jam_mulai,
    jam_selesai,
    ruangan,
    user,
    IdMatkul,
    hari,
    jam_mulai,
    jam_selesai,
    jam_selesai,
    jam_mulai,
    ruangan
  ]
  const checkSchedule = await executeParameterizedQuery(queryUpdateSchedule, valuesUpdateSchedule)
    .then(result => result.affectedRows)
  if (checkSchedule === 0) {
    throw new ResponseError (401, 'Jadwal Bentrok')
  }

  // create response
  const queryGetSchedule = `
    SELECT * FROM \`schedule-app\`.\`schedules\` 
    WHERE id_mata_kuliah = ?
  `
  const valuesGetSchedule = [IdMatkul]
  const response = await executeParameterizedQuery(queryGetSchedule, valuesGetSchedule)
    .then(result => result[0])
    .catch(error => {
      throw new ResponseError (501, 'Error getting schedule: ' + error.message)
    })

  return response
}

const removeSchedule = async (headerAuthorization, pathIdMatkul) => {
  // check authorization token
  const authorizationValidation = validation(authorizationValidationSchema, headerAuthorization)
  // check user from authorization token
  const queryCheckUser = `
    SELECT user FROM \`schedule-app\`.\`users\` 
    WHERE token = ?
  `
  const valuesCheckUser = [authorizationValidation]
  await executeParameterizedQuery(queryCheckUser, valuesCheckUser)
    .then(result => result[0].user)
    .catch(error => {
      throw new ResponseError (401, 'Error, user not found: ' + error.message) 
    })
  // check query path id_mata_kuliah
  const idMatkulValidation = validation(idMatkulPathValidationSchema, pathIdMatkul)
  // check id_mata_kuliah from query path
  const queryCheckPathIdMatkul = `
    SELECT id_mata_kuliah FROM \`schedule-app\`.\`schedules\` 
    WHERE id_mata_kuliah = ?
  `
  const valuesCheckPathIdMatkul = [idMatkulValidation]
  const IdMatkul = await executeParameterizedQuery(queryCheckPathIdMatkul, valuesCheckPathIdMatkul)
    .then(result => result[0].id_mata_kuliah)
    .catch(error => {
      throw new ResponseError (401, 'Error, id_matkul not found: ' + error.message) 
    })

  // remove data
  await executeParameterizedQuery(`DELETE FROM \`schedule-app\`.\`schedules\` WHERE id_mata_kuliah = ?`, [IdMatkul])
}

const listSchedule = async (path) => {
  // get data
  const queryGetSchedule = `
    SELECT mata_kuliah, nama_kelas, sks, hari, jam_mulai, jam_selesai, ruangan 
    FROM \`schedule-app\`.\`schedules\`
  `
  const sechedules = await executeQuery(queryGetSchedule)
    .then(result => result)
    .catch(error => {
      throw new ResponseError (501, 'Error getting schedule: ' + error.message)
    })

  // manage data
  function getDayOrder(dayName) {
    const daysOfWeek = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return daysOfWeek.indexOf(dayName);
  }
  function sortSchedules(a, b) {
    if (getDayOrder(a.hari) > getDayOrder(b.hari)) return 1;
    if (getDayOrder(a.hari) < getDayOrder(b.hari)) return -1;

    if (a.jam_mulai > b.jam_mulai) return 1;
    if (a.jam_mulai < b.jam_mulai) return -1;

    return 0;
  }

  return sechedules.sort(sortSchedules)
}

const getUserSchedule = async (pathUser) => {
  // check query path
  const userValidation = validation(getUserScheduleValidationSchema, pathUser)
  // check user from table
  const queryCheckUser = `
    SELECT user FROM \`schedule-app\`.\`users\` 
    WHERE user = ?
  `
  const valuesCheckUser = [userValidation]
  await executeParameterizedQuery(queryCheckUser, valuesCheckUser)
    .then(result => result[0].user)
    .catch(error => {
      throw new ResponseError (401, 'Error, user not found: ' + error.message) 
    })

  // get data
  const queryGetUserSchedule = `
    SELECT mata_kuliah, nama_kelas, sks, hari, jam_mulai, jam_selesai, ruangan FROM \`schedule-app\`.\`schedules\` 
    WHERE user = '${userValidation}'
  `
  const valuesGetUserSchedule = [userValidation]
  const sechedules = await executeParameterizedQuery(queryGetUserSchedule, valuesGetUserSchedule)
    .then(result => result)
    .catch(error => {
      throw new ResponseError (501, 'Error getting schedule: ' + error.message)
    })

  // manage data
  function getDayOrder(dayName) {
    const daysOfWeek = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return daysOfWeek.indexOf(dayName);
  }
  function sortSchedules(a, b) {
    if (getDayOrder(a.hari) > getDayOrder(b.hari)) return 1;
    if (getDayOrder(a.hari) < getDayOrder(b.hari)) return -1;

    if (a.jam_mulai > b.jam_mulai) return 1;
    if (a.jam_mulai < b.jam_mulai) return -1;

    return 0;
  }
  sechedules.sort(sortSchedules)

  return sechedules
}

export {
  createSchedule,
  updateSchedule,
  removeSchedule,
  listSchedule,
  getUserSchedule
}