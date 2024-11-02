import mysql from 'mysql';
import { ResponseError } from "../error/error.js";

async function executeQuery(query, values = []) {
  const connection = mysql.createConnection({
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.PASSWORD,
  });

  try {
    // Menunggu koneksi ke database tersambung
    await new Promise((resolve, reject) => {
      connection.connect(err => {
        if (err) {
          return reject(new ResponseError(500, 'Failed to connect to the database: ' + err.message));
        }
        resolve();
      });
    });

    // Menjalankan query
    const result = await new Promise((resolve, reject) => {
      connection.query(query, values, (err, result) => {
        if (err) {
          return reject(new ResponseError(500, 'Query execution failed: ' + err.message));
        }
        resolve(result);
      });
    });

    return result;

  } finally {
    // Menutup koneksi untuk menghindari kebocoran
    connection.end(err => {
      if (err) {
        console.error('Error closing connection:', err.message);
      }
    });
  }
}

export {
  executeQuery
}


// add user
/* import bycrypt from 'bcrypt'
import mysql from 'mysql'

const user = "2115061077"
let password = "2115061077"
password = bycrypt.hashSync(password, 10)

var connection = mysql.createConnection('mysql://root@localhost:3306/schedule-app');
executeQuery(connection, `INSERT INTO \`users\` (user, password) VALUES ('${user}', '${password}')`)
  .then(result => console.log(result))
connection.end()
 */