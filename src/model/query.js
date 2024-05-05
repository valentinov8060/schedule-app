import { connection } from "./connection.js";

function executeQuery(query) {
  return new Promise((resolve, reject) => {
    connection.query(query, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

function executeParameterizedQuery(query, values) {
  return new Promise((resolve, reject) => {
    connection.query(query, values, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

export {
  executeQuery,
  executeParameterizedQuery
}



/* import bycrypt from 'bcrypt'
const user = "2115061077"
let password = "2115061077"
password = bycrypt.hashSync(password, 10) */

// add user
/* connection.query(`INSERT INTO \`schedule-app\`.\`users\` (user, password) VALUES ('${user}', '${password}')`, (err) => {
  if (err) {
    console.error('Error inserting user:', err.message);
    return;
  }
})
connection.end() */

// example how to use fetchData function
/* async function main () {
  const queryGetSchedule = `SELECT mata_kuliah, nama_kelas, sks, hari, jam_mulai, jam_selesai, ruangan FROM \`schedule-app\`.\`schedules\`;`
  const sechedules = await getResult(queryGetSchedule)
    .then(result => result)
    .catch(error => {
      console.error('Error getting schedule: ', error.message);
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

    const paginatedData = data.slice(startIndex, endIndex);
  
    return paginatedData;
  }
  
  console.log(paginateArray(sechedules, 2, 2))
}  */
/* main() */