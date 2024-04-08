const { db } = require('../config/config')
const crypto = require('crypto');

exports.getQualification = (req, res) => {
  //Correo del repartidor
  const {correo} = req.body;
  const sqlCorreo = 'SELECT * FROM Repartidor WHERE correo = ?';
  const sqlQuery = `SELECT ROUND(AVG(calificacion), 2) as promedio FROM Lista_Pedidos WHERE repartidor=? AND calificacion IS NOT NULL;`;
  try{
    const connection = db();
    connection.query(sqlCorreo, [correo], (err, result) => {
      if(err){
        console.log(err);
        return res.status(500).send({ error: error, message: "Internal Server Error." })
      }else{
        if(result.length>0){
          connection.query(sqlQuery, [result[0].idrepartidor], (err, result) => {
            //connection.end();
            if(err){
              console.log(err);
              return res.status(500).send({ error: error, message: "Internal Server Error." })
            }else{

              return res.status(200).send({
                data: result[0].promedio
              });
            }
          });
        }else{
          console.log("Correo: "+correo)
          return res.status(400).send({ message: "No se encontro el usuario" })
        }
      }
    });
  }catch(error){
    console.log(error);
    return res.status(500).send({ error: error, message: "Internal Server Error." })
  }
}

exports.generateComissions = (req, res) => {
  const {correo} = req.body;
  const sqlCorreo = 'SELECT * FROM Repartidor WHERE correo = ?';
  const sqlQuery = `SELECT * from Comisiones WHERE repartidor_idrepartidor = ?`;
  try{
    const connection = db();
    connection.query(sqlCorreo, [correo], (err, result) => {
      if(err){
        console.log(err);
        return res.status(500).send({ error: error, message: "Internal Server Error." })
      }else{
        connection.query(sqlQuery, [result[0].idrepartidor], (err, result) => {
          //connection.end();
          if(err){
            console.log(err);
            return res.status(500).send({ error: error, message: "Internal Server Error." })
          }else{
            return res.status(200).send({
              comissions: result
            });
          }
        });
      }
    });
  }catch(error){
    console.log(error);
    return res.status(500).send({ error: error, message: "Internal Server Error." })
  }
}

// Inserta en la tabla Comisiones la comision, el idcarrito y id del repartidor cuando el repartidor hace una entrega
exports.setComission = async(req, res) => {

  const { idrepartidor, idcarrito, precio } = req.body;
  try {

      const query = `SET @valor_original = ${precio};
                    SET @porcentaje = @valor_original * 0.05;
                    INSERT INTO Comisiones (comision, repartidor_idrepartidor, idcarrito) VALUES (@porcentaje, ${idrepartidor}, ${idcarrito});`;
      const connection = db()

      connection.query(query, (error, result) => {
          //connection.end()
          if (error) {
              console.log(error);
              res.status(500).send({ error: error, message: "Error al cargar la comision" })
          } else {
              res.status(200).send({ message: `Comision cargada` })
          }
      })

  } catch (error) {
      console.log("Error en insertar comision")
      console.log(error)
      res.status(500).send({ error: error, message: "Internal Server Error." })
  }

}

exports.getProfile = async(req, res) => {
  const {correo} = req.body;  
  console.log("Correo: ", correo);
  try {
    const sql =  `SELECT
                      rp.idrepartidor AS idrepartidor,
                      rp.nombre AS nombre,
                      rp.apellido AS apellido,
                      rp.correo AS correo,
                      rp.celular AS celular,
                      rp.nit AS nit,
                      d.departamento AS departamento,
                      c.municipio AS ciudad,
                      t.transportePropio AS vehiculo,
                      l.tipo_licencia AS licencia,
                      l.num_licencia AS numlicencia
                  FROM
                      Repartidor rp
                      INNER JOIN Municipio c ON rp.ciudad = c.idMunicipio
                      INNER JOIN Departamento d ON d.idDepartamento = rp.departamento
                      INNER JOIN Licencia l ON l.repartidor = rp.idrepartidor
                      INNER JOIN Transporte t ON t.idrepartidor = rp.idrepartidor
                  WHERE
                      correo = ?;`

    const connection = db();
    connection.query(sql, [correo], (err, result) => {
      //connection.end();
        if (err) {
            console.log(err)
            return res.status(500).send({ error: error, message: "Internal Server Error." })
        }
        if (!result.length) {
            return res.status(401).send({
                message: "Usuario inexistente"
            });
        }              
        return res.status(200).send({
            data: result[0]
        });     
    });
  } catch (error) {
    return res.status(500).send({ error: error, message: "Internal Server Error." })
  }  

  /*
  const profileAux = {
      nombre: "Marcos V",
      apellido: "Valiente",
      correo: "hola@gmail.com",
      celular: "45454545",
      departamento: "1",
      ciudad: "3",
      nit: "1231231231123",
      password: "***********",
      vehiculo: "1",
      tipolicencia: "A",
      numlicencia: "12312"
  };

  return res.status(200).send({
    message: "desde el backend",
    data: profileAux
  });   */
}

/**
 * const camposNoVacios = {};
 *  Object.entries(req.body)
        .filter(([key, value]) => value !== "")
        .forEach(([key, value]) => {
            camposNoVacios[key] = value;
    });
    console.log("Campos no vacíos:", camposNoVacios);
 * @param {*} req 
 * @param {*} res 
 */
exports.ModificarDatosRepartidor = async(req, res) => {

  const nombreCampo = req.body.nombreCampo.toLowerCase().replace(/[.\s]/g, '');
  let valor = (nombreCampo === "password") ? req.body["password2"] : req.body[nombreCampo];
  if(nombreCampo === "password"){
    //si es password, entonces encryptamos el valor
    valor = crypto.createHash('md5').update(valor.toString()).digest('hex');
  }  
  const password = req.body.password;
  const correoActual = req.body.correoactual;

  console.log("Nombre del campo:", nombreCampo);
  console.log("Valor del campo:", valor);
  console.log("Contraseña:", password);
  console.log("Correo actual:", correoActual);     

  
  try {
    //verificar password
    const sql = "SELECT * FROM Repartidor WHERE correo = ?";
    let connection = db();
    connection.query(sql, [correoActual], (err, result) => {
      //connection.end();
        if (err) {
            console.log(err)
            return res.status(500).send({ error: error, message: "Internal Server Error." })
        }
        if (!result.length) {
            return res.status(401).send({
                message: "Usuario o contraseña incorrecta"
            });
        }
        let hash = crypto.createHash('md5').update(password).digest('hex');  
        if (hash == result[0]['password']) {
          //La password es correcta, se procede a modificar el campo
          try {
            //Verificamos si quiere cambiar la password
            const query = `UPDATE Repartidor r SET r.${nombreCampo} = ? WHERE r.correo = ?;`
            connection = db();      
            connection.query(query, [valor, correoActual] , (error, result) => {
                ////connection.end();
                if(nombreCampo === "departamento"){
                  //si se actualiza departamento, actualizamos la ciudad a la primera del departamento
                  const sqlMunicipio = "SELECT idMunicipio FROM Municipio WHERE departamento = ? LIMIT 1;";
                  connection.query(sqlMunicipio, [valor], (err, result) => {
                      console.log("RESULT:")
                      console.log(result[0]['idMunicipio'])
                      console.log("FIN")
                      const valorMunicipio = result[0]['idMunicipio'];   
                      const sqlActualizarMunicipio = "UPDATE Repartidor r SET r.ciudad = ? WHERE r.correo = ?;";
                      connection.query(sqlActualizarMunicipio, [valorMunicipio, correoActual] , (error, result) => {
                        if (error) {
                          console.log("1")
                          console.log(error);
                          return res.status(500).send({ error: error, message: "Error al solicitar el cambio del municipio" })
                        } else {    
                          //verificamos si se actualizo la zona departamental
                          console.log("2")
                          console.log("Actualizado")
                          return res.status(200).send({ message: "Se ha realizado la modificacion de departamento y municipio forma exitosa" })
                        }
                      });
                    });
                }else{
                  if (error) {
                    console.log(error);
                    return res.status(500).send({ error: error, message: "Error al solicitar el cambio" })
                  } else {    
                    //verificamos si se actualizo la zona departamental
                    return res.status(200).send({ message: "Se ha realizado la modificacion de forma exitosa" })
                  }
                }
            })
      
          } catch (error) {
              return res.status(500).send({ error: error, message: "Internal Server Error." })
          }
          
        } else {//si la password no es igual no se puede modificar el dato
            return res.status(401).send({message: "Contraseña invalida"});
        }
    });
  } catch (error) {
    return res.status(500).send({ error: error, message: "Internal Server Error." })
  }      
}
  

// Consulta a la BD que retorna la Lista_Pedidos con estado 4 ("Orden Aceptada") o 6 ("Orden en Camino") o 7 ("Orden Entregada")
exports.deliveryRequest = async(req, res) => {

  const { departamento, municipio, estado, idrepartidor } = req.body;
  try {
      const connection = db()
      let query = req.body.itsRequest ? `SELECT u.nombre, u.apellido, u.celular, d.departamento, m.municipio, lp.idListaPedidos, lp.direccion, DATE_FORMAT(lp.fecha, '%d-%m-%y') AS fecha, lp.precio, em.nombre AS nomEmpresa, dem.direccion AS dirEmpresa
                  FROM Usuario u
                  JOIN Carrito c ON u.idusuario = c.idusuario
                  JOIN Lista_Pedidos lp ON c.idcarrito = lp.carrito
                  JOIN Municipio m on m.idMunicipio  = lp.municipio 
                  JOIN Departamento d on d.idDepartamento = lp.departamento
                  JOIN Empresa em on em.idEmpresa = lp.empresa
                  JOIN DireccionEmpresa dem on dem.idEmpresa = em.idEmpresa
                  WHERE lp.estado = ? and d.departamento = ? and m.municipio = ?
                  GROUP BY lp.idListaPedidos;` : `SELECT u.nombre, u.apellido, u.celular, d.departamento, m.municipio, lp.idListaPedidos, lp.direccion, DATE_FORMAT(lp.fecha, '%d-%m-%y') AS fecha, lp.precio, lp.calificacion, e.nombreEstado, lp.descripcion, em.nombre AS nomEmpresa, dem.direccion AS dirEmpresa, c.idcarrito
                  FROM Usuario u
                  JOIN Carrito c ON u.idusuario = c.idusuario
                  JOIN Lista_Pedidos lp ON c.idcarrito = lp.carrito
                  JOIN Municipio m on m.idMunicipio  = lp.municipio 
                  JOIN Departamento d on d.idDepartamento = lp.departamento
                  JOIN Estados e on e.idEstado = lp.estado
                  JOIN Empresa em on em.idEmpresa = lp.empresa
                  JOIN DireccionEmpresa dem on dem.idEmpresa = em.idEmpresa
                  WHERE lp.estado = ? and d.departamento = ? and m.municipio = ? and lp.repartidor = ${idrepartidor}
                  GROUP BY lp.idListaPedidos;` ;

      connection.query(query, [estado, departamento, municipio], (error, result) => {
          //connection.end()

          if (error) {
              console.log(error);
              return res.status(500).send({
                  error: error,
                  message: "Error al obtener las solicitudes." 
              })
          } else {
              return res.status(200).send({
                  orders: result
              })
          }
      })
  } catch (error) {
      console.log("Error en ordersRequest ")
      console.log(error)
      return res.status(500).send({ error: error, message: "Internal Server Error." })
  }
}

// Actualiza la BD de ListaPedidos con el estado y datos del repartidor cuando el repartidor acepta una entrega
exports.approveOrder = async(req, res) => {

  const { id, estado, idRepartidor } = req.body;
  try {

      const query = req.body.itsRequest ? `UPDATE Lista_Pedidos lp SET lp.estado = ${estado}, lp.repartidor = ${idRepartidor} WHERE lp.idListaPedidos = ${id};` : `UPDATE Lista_Pedidos lp SET lp.estado = ${estado} WHERE lp.idListaPedidos = ${id};`;
      const connection = db()

      connection.query(query, (error, result) => {
          //connection.end()
          if (error) {
              console.log(error);
              res.status(500).send({ error: error, message: "Error al cargar la solicitud" })
          } else {
              res.status(200).send({ message: `Solicitud cargada` })
          }
      })

  } catch (error) {
      console.log("Error en approveRequest")
      console.log(error)
      res.status(500).send({ error: error, message: "Internal Server Error." })
  }

}

// Consulta a la BD que retorna una LISTAPEDIDOS donde el estado este en 6 ("Orden en camino") y que este asignado al repartidor actual
exports.orderActivated = async(req, res) => {

  const { estado, idRepartidor } = req.body;
  try {
      const connection = db()
      let query = `SELECT *
                  FROM Lista_Pedidos lp
                  WHERE lp.estado = ? and lp.repartidor = ?;`;

      connection.query(query, [estado, idRepartidor], (error, result) => {
          //connection.end()

          if (error) {
              console.log(error);
              return res.status(500).send({
                  error: error 
              })
          } else {
              return res.status(200).send({
                  orders: result,
                  message: "Ya tiene una entrega asignada."
              })
          }
      })
  } catch (error) {
      console.log("Error en ordersRequest ")
      console.log(error)
      return res.status(500).send({ error: error, message: "Internal Server Error." })
  }
}