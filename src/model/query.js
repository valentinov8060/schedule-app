function executeQuery(connection, query) {
  return new Promise((resolve, reject) => {
    connection.query(query, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

function executeParameterizedQuery(connection, query, values) {
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



// add user
/* import bycrypt from 'bcrypt'
import mysql from 'mysql'

const user = "2115061071"
let password = "2115061071"
password = bycrypt.hashSync(password, 10)

var connection = mysql.createConnection('mysql://root@localhost:3306/schedule-app');
executeQuery(connection, `INSERT INTO \`users\` (user, password) VALUES ('${user}', '${password}')`)
  .then(result => console.log(result))
connection.end()
*/