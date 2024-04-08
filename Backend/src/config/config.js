const mysql = require('mysql2')
require('dotenv').config();

const db = () => {
    const configure = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      multipleStatements: true,
      allowPublicKeyRetrieval: true,
      port: 3306
    }

    const db = mysql.createConnection(configure);
    db.connect((err) => {
        if (err) {
        console.log("Error inicializanod la DB, error: ", err);
        db.end()
        return null;
        }
        console.log("Db inicializada correctamente");
        return db;
    })
    return db;
}


module.exports = { db };