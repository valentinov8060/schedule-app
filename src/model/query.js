import mysql from 'mysql';

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
          return reject(new Error('Failed to connect to the database: ' + err.message));
        }
        resolve();
      });
    });

    // Menjalankan query
    const result = await new Promise((resolve, reject) => {
      connection.query(query, values, (err, result) => {
        if (err) {
          return reject(new Error('Query execution failed: ' + err.message));
        }
        resolve(result);
      });
    });
    return result;

  } finally {
    connection.end();
  }
}


export {
  executeQuery
}


// add user
/* import bycrypt from 'bcrypt'

const user = "..."
let password = "..."
password = bycrypt.hashSync(password, 10)

executeQuery(`INSERT INTO \`users\` (user, password) VALUES ('${user}', '${password}')`)
  .then(result => console.log(result))
  .catch(error => console.log(error))
 */