const {db} = require('../config/config');

const getDepartamentos = (req, res) => {

  try {
    const connection = db()
    let query = `SELECT * FROM Departamento;`

    connection.query(query, (error, result) => {
      //connection.end()

      if (error) {
        res.status(500).send({ error: error, message: "Error al obtener las solicitudes." })
      } else {
        res.status(200).send({
          depa: result
        })
      }
    })
  } catch (error) {
    res.status(500).send({ error: error, message: "Internal Server Error." })
  }
}

const getMunicipios = (req, res) => {

  try {

    const connection = db()
    const departamento = req.body.departamento

    const query = `SELECT * FROM Municipio WHERE departamento = ${departamento};`

    connection.query(query, (error, result) => {
      //connection.end()

      if (error) {
        res.status(500).send({ error: error, message: "Error al obtener las solicitudes." })
      } else {
        res.status(200).send({
          ciu: result
        })
      }
    })
  } catch (error) {
    res.status(500).send({ error: error, message: "Internal Server Error." })
  }
}

module.exports = {
  getDepartamentos,
  getMunicipios
}