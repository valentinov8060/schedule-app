import { v4 as uuidv4 } from 'uuid';

import { getResult } from "../model/query.js";
import { validation } from "../validation/validation.js";
import {
  authorizationValidationSchema,
  idMatkulPathValidationSchema,
  createScheduleValidationSchema,
  updateScheduleValidationSchema,
  listScheduleValidationSchema
} from "../validation/schedule-validation.js";
import { ResponseError } from "../error/error.js";

const createSchedule = async (headerAuthorization, reqBody) => {
  const authorizationValidation = validation(authorizationValidationSchema, headerAuthorization)
  const reqBodyValidation = validation(createScheduleValidationSchema, reqBody)

  const queryGetUser = `SELECT user FROM \`schedule-app\`.\`users\` WHERE token = '${authorizationValidation}'`
  const user = await getResult(queryGetUser)
    .then(result => result[0].user)
    .catch(error => {
      throw new ResponseError (401, 'Error, user not found: ' + error.message) 
    })

  const queryCheckNamaKelas = `SELECT COUNT(*) AS count FROM \`schedule-app\`.\`schedules\` WHERE nama_kelas = '${reqBodyValidation.nama_kelas}'`
  const checkKelas = await getResult(queryCheckNamaKelas)
    .then(result => result[0].count)
  if (checkKelas > 0) {
    throw new ResponseError (400, 'Kelas sudah ada')
  }
  
  const id_mata_kuliah = uuidv4();
  const {mata_kuliah, nama_kelas, sks, hari, jam_mulai, jam_selesai, ruangan} = reqBodyValidation

  const queryAddShechedule = `
    INSERT INTO \`schedule-app\`.\`schedules\` (id_mata_kuliah, mata_kuliah, nama_kelas, sks, hari, jam_mulai, jam_selesai, ruangan, user)
    SELECT '${id_mata_kuliah}', '${mata_kuliah}', '${nama_kelas}', '${sks}', '${hari}', '${jam_mulai}', '${jam_selesai}', '${ruangan}', '${user}'
    WHERE NOT EXISTS (
      SELECT 1
      FROM \`schedule-app\`.\`schedules\`
      WHERE hari = '${hari}' 
        AND (
          ('${jam_mulai}' BETWEEN jam_mulai AND jam_selesai)
          OR ('${jam_selesai}' BETWEEN jam_mulai AND jam_selesai)
          OR ('${jam_mulai}' < jam_mulai AND '${jam_selesai}' > jam_selesai)
        )
        AND ruangan = '${ruangan}'
    );
  `;
  const checkSchedule = await getResult(queryAddShechedule)
    .then(result => result.affectedRows)
  if (checkSchedule === 0) {
    throw new ResponseError (401, 'Jadwal Bentrok')
  }
  
  const queryGetSchedule = `SELECT * FROM \`schedule-app\`.\`schedules\` WHERE id_mata_kuliah = '${id_mata_kuliah}'`
  const result = await getResult(queryGetSchedule)
    .then(result => result[0])
    .catch(error => {
      throw new ResponseError (501, 'Error getting schedule:' + error.message)
    })

  return result
}

const updateSchedule = async (headerAuthorization, reqBody, pathIdMatkul) => {
  const authorizationValidation = validation(authorizationValidationSchema, headerAuthorization)
  const reqBodyValidation = validation(updateScheduleValidationSchema, reqBody)
  const idMatkulValidation = validation(idMatkulPathValidationSchema, pathIdMatkul)

  const queryGetUser = `SELECT user FROM \`schedule-app\`.\`users\` WHERE token = '${authorizationValidation}'`
  const user = await getResult(queryGetUser)
    .then(result => result[0].user)
    .catch(error => {
      throw new ResponseError (401, 'Error, user not found: ' + error.message) 
    })
  
  const queryCheckPathIdMatkul = `SELECT id_mata_kuliah FROM \`schedule-app\`.\`schedules\` WHERE id_mata_kuliah = '${idMatkulValidation}'`
  const IdMatkul = await getResult(queryCheckPathIdMatkul)
    .then(result => result[0].id_mata_kuliah)
    .catch(error => {
      throw new ResponseError (401, 'Error, id_matkul not found: ' + error.message) 
    })

  const queryCheckNamaKelas = `SELECT COUNT(*) AS count FROM \`schedule-app\`.\`schedules\` WHERE nama_kelas = '${reqBodyValidation.nama_kelas}'`
  const checkKelas = await getResult(queryCheckNamaKelas)
    .then(result => result[0].count)
  if (checkKelas > 1) {
    throw new ResponseError (400, 'Kelas sudah ada')
  }

  const {mata_kuliah, nama_kelas, sks, hari, jam_mulai, jam_selesai, ruangan} = reqBodyValidation

  const queryUpdateSchedule = `
    UPDATE \`schedule-app\`.\`schedules\`
    SET mata_kuliah = '${mata_kuliah}', nama_kelas = '${nama_kelas}', sks = '${sks}', hari = '${hari}', jam_mulai = '${jam_mulai}', jam_selesai = '${jam_selesai}', ruangan = '${ruangan}', user = '${user}'
    WHERE id_mata_kuliah = '${IdMatkul}'
      AND NOT EXISTS (
        SELECT 1
        FROM \`schedule-app\`.\`schedules\`
        WHERE hari = '${hari}' 
          AND (
            ('${jam_mulai}' BETWEEN jam_mulai AND jam_selesai)
            OR ('${jam_selesai}' BETWEEN jam_mulai AND jam_selesai)
            OR ('${jam_mulai}' < jam_mulai AND '${jam_selesai}' > jam_selesai)
          )
          AND ruangan = '${ruangan}'
      );
  `;
  const checkSchedule = await getResult(queryUpdateSchedule)
    .then(result => result.affectedRows)
  if (checkSchedule === 0) {
    throw new ResponseError (401, 'Jadwal Bentrok')
  }

  const queryGetSchedule = `SELECT * FROM \`schedule-app\`.\`schedules\` WHERE id_mata_kuliah = '${IdMatkul}'`
  const result = await getResult(queryGetSchedule)
    .then(result => result[0])
    .catch(error => {
      throw new ResponseError (501, 'Error getting schedule: ' + error.message)
    })

  return result
}

const removeSchedule = async (headerAuthorization, pathIdMatkul) => {
  const authorizationValidation = validation(authorizationValidationSchema, headerAuthorization)
  const idMatkulValidation = validation(idMatkulPathValidationSchema, pathIdMatkul)

  const queryCheckUser = `SELECT user FROM \`schedule-app\`.\`users\` WHERE token = '${authorizationValidation}'`
  await getResult(queryCheckUser)
    .then(result => result[0].user)
    .catch(error => {
      throw new ResponseError (401, 'Error, user not found: ' + error.message) 
    })
  
  const queryCheckPathIdMatkul = `SELECT id_mata_kuliah FROM \`schedule-app\`.\`schedules\` WHERE id_mata_kuliah = '${idMatkulValidation}'`
  const IdMatkul = await getResult(queryCheckPathIdMatkul)
    .then(result => result[0].id_mata_kuliah)
    .catch(error => {
      throw new ResponseError (401, 'Error, id_matkul not found: ' + error.message) 
    })
  
  await getResult(`DELETE FROM \`schedule-app\`.\`schedules\` WHERE id_mata_kuliah = '${IdMatkul}'`)
}

const listSchedule = async (path) => {
  const pathValidation = validation(listScheduleValidationSchema, path)

  const {page, size} = pathValidation

  const queryGetSchedule = `SELECT mata_kuliah, nama_kelas, sks, hari, jam_mulai, jam_selesai, ruangan FROM \`schedule-app\`.\`schedules\`;`
  const sechedules = await getResult(queryGetSchedule)
    .then(result => result)
    .catch(error => {
      throw new ResponseError (501, 'Error getting schedule: ' + error.message)
    })

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

  function paginateArray(data, page, size) {
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
  
    return data.slice(startIndex, endIndex);
  }

  const data = paginateArray(sechedules, page, size)
  const total_page = Math.ceil(sechedules.length / size)
  const total_data = sechedules.length

  return {
    data: data,
    paging: {
      page: page,
      total_page: total_page,
      total_data: total_data
    }
  }
}

export {
  createSchedule,
  updateSchedule,
  removeSchedule,
  listSchedule
}