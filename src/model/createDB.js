// mysql://USER:PASSWORD@HOST:PORT/DATABASE 

// Run this code if you don't have database
/* import mysql from 'mysql';

const connectionCreateDB = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.PASSWORD,
});

const createTableUserQuery = `
  CREATE TABLE IF NOT EXISTS \`schedule-app\`.\`users\` (
    user VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255) NOT NULL
  )
`;

const createTableScheduleQuery = `
  CREATE TABLE IF NOT EXISTS \`schedule-app\`.\`schedules\` (
    id_mata_kuliah VARCHAR(36) PRIMARY KEY,
    mata_kuliah VARCHAR(255) NOT NULL,
    nama_kelas VARCHAR(5) NOT NULL UNIQUE,
    sks INT NOT NULL,
    hari ENUM('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu') NOT NULL,
    jam_mulai TIME NOT NULL,
    jam_selesai TIME NOT NULL,
    ruangan VARCHAR(255) NOT NULL,
    user VARCHAR(255),
    FOREIGN KEY (user) REFERENCES users(user)
  )
`;

connectionCreateDB.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    return;
  }
  console.log('Connected to MySQL');

  connectionCreateDB.query('CREATE DATABASE IF NOT EXISTS `schedule-app`', (err) => {
    if (err) {
      console.error('Error creating schedule-app database:', err.message);
      connectionCreateDB.end();
      return;
    }
    console.log('Database schedule-app created or already exists');

    connectionCreateDB.query('USE `schedule-app`', (err) => {
      if (err) {
        console.error('Error using schedule-app database:', err.message);
        connectionCreateDB.end();
        return;
      }
      console.log('Using schedule-app database');

      connectionCreateDB.query(createTableUserQuery, (err) => {
        if (err) {
          console.error('Error creating users table:', err.message);
          connectionCreateDB.end();
          return;
        }
        console.log('Users table created or already exists');

        connectionCreateDB.query(createTableScheduleQuery, (err) => {
          if (err) {
            console.error('Error creating schedules table:', err.message);
            connectionCreateDB.end();
            return;
          }
          console.log('Schedules table created or already exists');
          connectionCreateDB.end();
        });
      });
    });
  });
}); */
