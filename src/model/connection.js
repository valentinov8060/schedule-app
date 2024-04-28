import mysql from 'mysql'

// mysql://USER:PASSWORD@HOST:PORT/DATABASE 
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  port: 3306
});

/* const createTableUserQuery = `
  CREATE TABLE IF NOT EXISTS \`schedule-app\`.\`users\` (
    user VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    token VARCHAR(36)
  )
`
const createTableScheduleQuery = `
  CREATE TABLE IF NOT EXISTS \`schedule-app\`.\`schedules\` (
    id_mata_kuliah VARCHAR(36) PRIMARY KEY,
    mata_kuliah VARCHAR(255) NOT NULL,
    nama_kelas VARCHAR(10) NOT NULL,
    sks INT NOT NULL,
    hari VARCHAR(10) NOT NULL,
    jam_mulai TIME NOT NULL,
    jam_selesai TIME NOT NULL,
    ruangan VARCHAR(255) NOT NULL,
    user VARCHAR(255),
    FOREIGN KEY (user) REFERENCES users(user)
  )
`

connection.query('CREATE DATABASE IF NOT EXISTS `schedule-app`', (err) => {
  if (err) {
    console.error('Error creating schedule-app database:', err.message);
    return;
  }
  connection.query(createTableUserQuery, (err) => {
    if (err) {
      console.error('Error creating user table:', err.message);
      return;
    }
    connection.query(createTableScheduleQuery, (err) => {
      if (err) {
        console.error('Error creating schedule table:', err.message);
        return;
      }
      console.log('Database and tables has been created successfully');
      connection.end();
    });
  });
}); */

export { 
  connection 
}