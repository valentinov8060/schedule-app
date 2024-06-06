// mysql://USER:PASSWORD@HOST:PORT/DATABASE 

// Run this code if dont have database
/* import mysql from 'mysql'

const connectionCreateDB = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  port: 3306
});

const createTableUserQuery = `
  CREATE TABLE IF NOT EXISTS \`schedule-app\`.\`users\` (
    user VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255) NOT NULL
  )
`
const createTableScheduleQuery = `
  CREATE TABLE IF NOT EXISTS \`schedule-app\`.\`schedules\` (
    id_mata_kuliah VARCHAR(36) PRIMARY KEY,
    mata_kuliah VARCHAR(255) NOT NULL,
    nama_kelas VARCHAR(5) NOT NULL,
    sks INT NOT NULL,
    hari ENUM('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu') NOT NULL,
    jam_mulai TIME NOT NULL,
    jam_selesai TIME NOT NULL,
    ruangan VARCHAR(255) NOT NULL,
    user VARCHAR(255),
    FOREIGN KEY (user) REFERENCES users(user)
  )
`

connectionCreateDB.query('CREATE DATABASE IF NOT EXISTS `schedule-app`', (err) => {
  if (err) {
    console.error('Error creating schedule-app database:', err.message);
    return;
  }
  connectionCreateDB.query(createTableUserQuery, (err) => {
    if (err) {
      console.error('Error creating user table:', err.message);
      return;
    }
    connectionCreateDB.query(createTableScheduleQuery, (err) => {
      if (err) {
        console.error('Error creating schedule table:', err.message);
        return;
      }
      console.log('Database and tables has been created successfully');
    });
  });
});

connectionCreateDB.end(); 
*/