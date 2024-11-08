import { v4 as uuidv4 } from 'uuid';

import { executeQuery } from "../model/query.js";
import { validation } from "../validation/validation.js";
import {
  createScheduleValidationSchema,
  updateScheduleValidationSchema,
  removeScheduleValidationSchema,
  getUserScheduleValidationSchema,
  clockValidation
} from "../validation/schedule-validation.js";
import { ResponseError } from "../error/error.js";

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

const createSchedule = async (user, reqBody) => {
  // check request body
  const reqBodyValidation = validation(createScheduleValidationSchema, reqBody)
  // check jam mulai jam selesai
  clockValidation(reqBodyValidation.jam_mulai, reqBodyValidation.jam_selesai)
  // check kelas 
  const queryCheckNamaKelas = `
    SELECT COUNT(*) AS count 
    FROM \`schedules\` 
    WHERE nama_kelas = ?
  `
  const valuesCheckNamaKelas = [reqBodyValidation.nama_kelas]
  const checkKelas = await executeQuery(queryCheckNamaKelas, valuesCheckNamaKelas)
    .then(result => result[0].count)
  if (checkKelas > 0) {
    throw new ResponseError (401, 'Kelas sudah ada')
  }

  // create data
  const id_mata_kuliah = uuidv4();
  const {mata_kuliah, nama_kelas, sks, hari, jam_mulai, jam_selesai, ruangan} = reqBodyValidation

  // insert data
  const queryAddShechedule = `
    INSERT INTO \`schedules\` 
    (id_mata_kuliah, mata_kuliah, nama_kelas, sks, hari, jam_mulai, jam_selesai, ruangan, user)
    SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?
    WHERE NOT EXISTS (
      SELECT 1
      FROM \`schedules\`
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
  const checkSchedule = await executeQuery(queryAddShechedule, valuesAddShechedule)
    .then(result => result.affectedRows)
  if (checkSchedule === 0) {
    throw new ResponseError (401, 'Jadwal bentrok')
  }

  // create response
  const queryGetSchedule = `
    SELECT * FROM \`schedules\` 
    WHERE id_mata_kuliah = ?
  `
  const valuesGetSchedule = [id_mata_kuliah]
  const response = await executeQuery(queryGetSchedule, valuesGetSchedule)
    .then(result => result[0])
    .catch(error => {
      throw new ResponseError (501, 'Error getting schedule:' + error.message)
    })

  return response
}

const updateSchedule = async (user, reqBody, pathIdMatkul) => {
  // check request body
  const reqBodyValidation = validation(updateScheduleValidationSchema, reqBody);
  // check query path id_mata_kuliah
  const idMatkulValidation = validation(removeScheduleValidationSchema, pathIdMatkul);
  // check id_mata_kuliah from query path
  const queryCheckPathIdMatkul = `
    SELECT id_mata_kuliah, user FROM schedules 
    WHERE id_mata_kuliah = ? AND user = ?
  `;
  const valuesCheckPathIdMatkul = [idMatkulValidation, user];
  const IdMatkul = await executeQuery(queryCheckPathIdMatkul, valuesCheckPathIdMatkul)
    .then(result => result[0].id_mata_kuliah)
    .catch(error => {
      throw new ResponseError(401, 'Error, id_matkul not found or not your schedule: ' + error.message);
    });

  // check jam mulai jam selesai
  clockValidation(reqBodyValidation.jam_mulai, reqBodyValidation.jam_selesai);

  // check kelas
  const queryCheckNamaKelas = `
    SELECT COUNT(*) AS count FROM schedules 
    WHERE nama_kelas = ?
  `;
  const valuesCheckNamaKelas = [reqBodyValidation.nama_kelas];
  const checkKelas = await executeQuery(queryCheckNamaKelas, valuesCheckNamaKelas)
    .then(result => result[0].count);
  if (checkKelas > 1) {
    throw new ResponseError(401, 'Kelas sudah ada');
  }

  // create data
  const { mata_kuliah, nama_kelas, sks, hari, jam_mulai, jam_selesai, ruangan } = reqBodyValidation;

  // insert data
  const queryUpdateSchedule = `
    UPDATE schedules
    SET mata_kuliah = ?, nama_kelas = ?, sks = ?, hari = ?, jam_mulai = ?, jam_selesai = ?, ruangan = ?, user = ?
    WHERE id_mata_kuliah = ?
      AND NOT EXISTS (
        SELECT 1
        FROM (
          SELECT 1 FROM schedules
          WHERE hari = ? 
          AND (
            (? BETWEEN jam_mulai AND jam_selesai)
            OR (? BETWEEN jam_mulai AND jam_selesai)
            OR (? < jam_mulai AND ? > jam_selesai)
          )
          AND ruangan = ?
          AND id_mata_kuliah != ?
        ) AS temp
      );
  `;
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
    ruangan,
    IdMatkul
  ];
  const checkSchedule = await executeQuery(queryUpdateSchedule, valuesUpdateSchedule)
    .then(result => result.affectedRows);
  if (checkSchedule === 0) {
    throw new ResponseError(401, 'Jadwal bentrok');
  }

  // create response
  const queryGetSchedule = `
    SELECT * FROM schedules 
    WHERE id_mata_kuliah = ?
  `;
  const valuesGetSchedule = [IdMatkul];
  const response = await executeQuery(queryGetSchedule, valuesGetSchedule)
    .then(result => result[0])
    .catch(error => {
      throw new ResponseError(501, 'Error getting schedule: ' + error.message);
    });

  return response;
};

const removeSchedule = async (user, pathIdMatkul) => {
  // check user
  const queryCheckUser = `
    SELECT user FROM \`users\` 
    WHERE user = ?
  `
  const valuesCheckUser = [user]
  await executeQuery(queryCheckUser, valuesCheckUser)
    .then(result => result[0].user)
    .catch(error => {
      throw new ResponseError (401, 'Error, user not found: ' + error.message) 
    })
  // check query path id_mata_kuliah
  const idMatkulValidation = validation(removeScheduleValidationSchema, pathIdMatkul)
  // check id_mata_kuliah from query path
  const queryCheckPathIdMatkul = `
    SELECT id_mata_kuliah FROM \`schedules\` 
    WHERE id_mata_kuliah = ? AND user = ?
  `
  const valuesCheckPathIdMatkul = [idMatkulValidation, user]
  const IdMatkulUser = await executeQuery(queryCheckPathIdMatkul, valuesCheckPathIdMatkul)
    .then(result => result[0].id_mata_kuliah)
    .catch(error => {
      throw new ResponseError (401, 'Error, id_matkul not found or not your schedule: ' + error.message) 
    })

  // remove data
  await executeQuery(`DELETE FROM \`schedules\` WHERE id_mata_kuliah = ?`, [IdMatkulUser])
    .then(result => result.affectedRows)
    .catch(error => {
      throw new ResponseError (501, 'Error, id_matkul not found or not your schedule: ' + error.message) 
    })
}

const listSchedule = async () => {
  // get data
  const queryGetSchedule = `
    SELECT id_mata_kuliah, mata_kuliah, nama_kelas, sks, hari, jam_mulai, jam_selesai, ruangan, user
    FROM \`schedules\`
  `
  const sechedules = await executeQuery(queryGetSchedule)
    .then(result => result)
    .catch(error => {
      throw new ResponseError (501, 'Error getting schedule: ' + error.message)
    })

  // manage data
  return sechedules.sort(sortSchedules)
}

const getUserSchedule = async (pathUser) => {
  // check query path
  const userValidation = validation(getUserScheduleValidationSchema, pathUser)
  // check user from table
  const queryCheckUser = `
    SELECT user FROM \`users\` 
    WHERE user = ?
  `
  const valuesCheckUser = [userValidation]
  const user = await executeQuery(queryCheckUser, valuesCheckUser)
    .then(result => result[0].user)
    .catch(error => {
      throw new ResponseError (401, 'Error, user not found: ' + error.message) 
    })

  // get data
  const queryGetUserSchedule = `
    SELECT id_mata_kuliah, mata_kuliah, nama_kelas, sks, hari, jam_mulai, jam_selesai, ruangan, user 
    FROM \`schedules\` 
    WHERE user = ?
  `
  const valuesGetUserSchedule = [user]
  const sechedules = await executeQuery(queryGetUserSchedule, valuesGetUserSchedule)
    .then(result => result)
    .catch(error => {
      throw new ResponseError (501, 'Error getting schedule: ' + error.message)
    })

  // manage data
  return sechedules.sort(sortSchedules)
}

export {
  createSchedule,
  updateSchedule,
  removeSchedule,
  listSchedule,
  getUserSchedule
}