const { db } = require('../config/config')
const crypto = require('crypto');
const { generateJWT } = require('../config/jwtConfig');

exports.registerRepartidor = async(req, res) => {
  const {nombre,apellido,correo,celular,departamento,ciudad,nit,cv,password,licencia,numlicencia,vehiculo} = req.body;
  const estado = 0;
  console.log("Datos recibidos:");
  console.log("nombre: " + nombre);
  console.log("apellido: " + apellido);
  console.log("correo: " + correo);
  console.log("celular: " + celular);
  console.log("departamento: " + departamento);
  console.log("ciudad: " + ciudad);
  console.log("nit: " + nit);
  console.log("cv: " + cv);
  console.log("password: " + password);
  console.log("licencia: " + licencia);
  console.log("numLicencia: " + numlicencia);
  console.log("vehiculo: " + vehiculo);
  //console.log("Datos:", JSON.stringify(req.body));

  try {
    //definimos consulta para verificar si el repartidor esta repetido
    const sql1 = "SELECT * FROM Repartidor WHERE correo = ?";
    let connection = db();
    connection.query(sql1, [correo], (err, result) => {
      //connection.end();
      if (err) {
        console.log(err);
        return res.status(500).send({
          message: "Hubo un error al verificar la existencia del repartidor"
        });
      }
      if (result.length > 0) {
        return res.status(400).send({
          message: "El usuario ya existe"
        });
      }

      //Registramos si no esta registrado previamente
      //hacemos hash al password
      const passwordString = password.toString();
      let hash = crypto.createHash('md5').update(passwordString).digest('hex');
      
      //sql para insertar nuevo repartidor
      const sql2 = "INSERT INTO Repartidor(nombre, apellido, correo, celular, departamento, ciudad, nit, cv, estado,password) VALUES (?,?,?,?,?,?,?,?,?,?)";
      connection = db();
      connection.query(sql2, [nombre, apellido, correo, celular, departamento, ciudad, nit, cv, estado, hash], (err, result) => {
        //connection.end();
        //Recuperamos al repartidor apartir del correo
        const sql3 = "SELECT * FROM Repartidor WHERE correo = ?";
        connection = db();
        connection.query(sql3, [correo], (err, resul) => {
          //connection.end();
            let idRepartidor = resul[0]['idrepartidor']

            //query para insertar transporte, si posee un transporte propio
            const sql4 =  "INSERT INTO Transporte(idrepartidor,transportePropio) VALUES (?,?)";
            connection = db();
            connection.query(sql4, [idRepartidor, vehiculo], (err, result) => {
              //connection.end();
                //query para insertar licencias
                const sql5 =  "INSERT INTO Licencia(num_licencia,tipo_licencia,repartidor) VALUES (?,?,?)";
                connection = db();
                connection.query(sql5, [numlicencia, licencia, idRepartidor], (err, result) => {
                  //connection.end();
                    console.log("repartidor registrado correctamente")                    
                });
                return res.status(200).send({
                  message: "Usuario registrado correctamente"
              });
            });
        });  
      });
    });  
  } catch (error) {
    res.status(500).send({ error: error, message: "Internal Server Error." })
  }        
}

exports.loginRepartidor = async(req, res) => {
  const {correo, password} = req.body;
  console.log("correo: " + correo);
  console.log("password: " + password);
  try {
    const sql = "SELECT * FROM Repartidor WHERE correo = ? AND estado = 1";
    let connection = db();
    connection.query(sql, [correo], (err, result) => {
      //connection.end();
      if (err) {
        console.log(err)
      }
      if (!result.length) {
        return res.status(401).send({
            message: "Usuario o contraseña incorrecta"
        });
      }
      let hash = crypto.createHash('md5').update(password).digest('hex');
      console.log("Hash"+hash)
      console.log("Password"+result[0].password)
      if (hash == result[0].password) {
        const token = generateJWT(correo, 'repartidor');
        return res.status(200).send({
          correo: correo,
          token: token
        });
      } else {
        console.log("Contrasena invalida")
        return res.status(401).send({message: "Contraseña invalida"});
      }
    });
  } catch (error) {
    console.log(error)
    res.status(500).send({ error: error, message: "Internal Server Error." })
  }  
}