const { db } = require('../config/config');
exports.getSelectFromSQL = (idSelect, sql, arrayParams) => {
    console.log("ID SELECT:  ", idSelect);
    console.log("PARAMS:  ", arrayParams);
    return new Promise((resolve, reject) => {
      const connection = db();
      try {
        connection.query(sql, [...arrayParams], (err, result) => {
          //connection.end();
          if (err) {
            const msg = "Se produjo un error con la conexión: " + idSelect + " : " + err;
            console.log(msg);
            resolve({
              data: null,
              msg: msg,
              statusCode: 500 // Puedes ajustar el código de estado según sea necesario
            });
          } else if (!result.length) {
            const msg = "La consulta de <" + idSelect + "> no tiene datos";
            console.log(msg);
            resolve({
              data: null,
              msg: msg,
              statusCode: 401 // Puedes ajustar el código de estado según sea necesario
            });
          } else {
            const msg = "Se encontraron datos de forma satisfactoria para " + idSelect + " datos: " +  JSON.stringify(result);
            //console.log(msg);
            resolve({
              data: result,
              msg: msg,
              statusCode: 200
            });
          }
        });
      } catch (error) {
        const msg = `Se produjo un error en ${idSelect} - ERROR: ${error}`;
        console.log(msg);
        resolve({
          data: null,
          msg: msg,
          statusCode: 500 // Puedes ajustar el código de estado según sea necesario
        });
      }
    });
};
  
exports.executeSQL = (idOperation, sql, arrayParams) => {
  console.log("ID OPERATION: ", idOperation);
  console.log("PARAMS: ", arrayParams);

  return new Promise((resolve, reject) => {
    const connection = db();

    try {
      connection.query(sql, [...arrayParams], (err, result) => {
        //connection.end();

        if (err) {
          const msg = `Se produjo un error con la operación: ${idOperation} - ${err}`;
          console.log(msg);
          resolve({
            success: false,
            msg: msg,
            statusCode: 500
          });
        } else {
          const successMsg = `Operación ${idOperation} completada exitosamente`;
          resolve({
            success: true,
            msg: successMsg,
            statusCode: 200,
            result: result
          });
        }
      });
    } catch (error) {
      const msg = `Se produjo un error en ${idOperation} - ERROR: ${error}`;
      console.log(msg);
      resolve({
        success: false,
        msg: msg,
        statusCode: 500
      });
    }
  });
};