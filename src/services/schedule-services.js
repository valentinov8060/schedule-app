import { v4 as uuidv4 } from 'uuid';
import mysql from 'mysql';

import { executeQuery, executeParameterizedQuery } from "../model/query.js";
import { validation } from "../validation/validation.js";
import {
  createScheduleValidationSchema,
  updateScheduleValidationSchema,
  removeScheduleValidationSchema,
  getUserScheduleValidationSchema,
  clockValidation
} from "../validation/schedule-validation.js";
import { ResponseError } from "../error/error.js";

const createSchedule = async (user, reqBody) => {
  // create connection
  const connection = mysql.createConnection('mysql://root@localhost:3306/schedule-app');

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
  const checkKelas = await executeParameterizedQuery(connection, queryCheckNamaKelas, valuesCheckNamaKelas)
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
  const checkSchedule = await executeParameterizedQuery(connection, queryAddShechedule, valuesAddShechedule)
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
  const response = await executeParameterizedQuery(connection, queryGetSchedule, valuesGetSchedule)
    .then(result => result[0])
    .catch(error => {
      throw new ResponseError (501, 'Error getting schedule:' + error.message)
    })

  connection.end()
  return response
}

const updateSchedule = async (user, reqBody, pathIdMatkul) => {
  // create connection
  const connection = await mysql.createConnection('mysql://root@localhost:3306/schedule-app');

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
  const IdMatkul = await executeParameterizedQuery(connection, queryCheckPathIdMatkul, valuesCheckPathIdMatkul)
    .then(result => result[0].id_mata_kuliah)
    .catch(error => {
      throw new ResponseError(401, 'Error, Bukan Mata Kuliah Anda: ' + error.message);
    });

  // check jam mulai jam selesai
  clockValidation(reqBodyValidation.jam_mulai, reqBodyValidation.jam_selesai);

  // check kelas
  const queryCheckNamaKelas = `
    SELECT COUNT(*) AS count FROM schedules 
    WHERE nama_kelas = ?
  `;
  const valuesCheckNamaKelas = [reqBodyValidation.nama_kelas];
  const checkKelas = await executeParameterizedQuery(connection, queryCheckNamaKelas, valuesCheckNamaKelas)
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
    ruangan
  ];
  const checkSchedule = await executeParameterizedQuery(connection, queryUpdateSchedule, valuesUpdateSchedule)
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
  const response = await executeParameterizedQuery(connection, queryGetSchedule, valuesGetSchedule)
    .then(result => result[0])
    .catch(error => {
      throw new ResponseError(501, 'Error getting schedule: ' + error.message);
    });

  connection.end();
  return response;
};

const removeSchedule = async (user, pathIdMatkul) => {
  // create connection
  const connection = mysql.createConnection('mysql://root@localhost:3306/schedule-app');

  // check user
  const queryCheckUser = `
    SELECT user FROM \`users\` 
    WHERE user = ?
  `
  const valuesCheckUser = [user]
  await executeParameterizedQuery(connection, queryCheckUser, valuesCheckUser)
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
  const IdMatkulUser = await executeParameterizedQuery(connection, queryCheckPathIdMatkul, valuesCheckPathIdMatkul)
    .then(result => result[0].id_mata_kuliah)
    .catch(error => {
      throw new ResponseError (401, 'Error, id_matkul not found or not your schedule: ' + error.message) 
    })

  // remove data
  await executeParameterizedQuery(connection, `DELETE FROM \`schedules\` WHERE id_mata_kuliah = ?`, [IdMatkulUser])

  connection.end()
}

const listSchedule = async () => {
  // create connection
  const connection = mysql.createConnection('mysql://root@localhost:3306/schedule-app');

  // get data
  const queryGetSchedule = `
    SELECT id_mata_kuliah, mata_kuliah, nama_kelas, sks, hari, jam_mulai, jam_selesai, ruangan, user
    FROM \`schedules\`
  `
  const sechedules = await executeQuery(connection, queryGetSchedule)
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

  connection.end()
  return sechedules.sort(sortSchedules)
}

const getUserSchedule = async (pathUser) => {
  // create connection
  const connection = mysql.createConnection('mysql://root@localhost:3306/schedule-app');

  // check query path
  const userValidation = validation(getUserScheduleValidationSchema, pathUser)
  // check user from table
  const queryCheckUser = `
    SELECT user FROM \`users\` 
    WHERE user = ?
  `
  const valuesCheckUser = [userValidation]
  const user = await executeParameterizedQuery(connection, queryCheckUser, valuesCheckUser)
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
  const sechedules = await executeParameterizedQuery(connection, queryGetUserSchedule, valuesGetUserSchedule)
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

  connection.end()
  return sechedules
}

export {
  createSchedule,
  updateSchedule,
  removeSchedule,
  listSchedule,
  getUserSchedule
}