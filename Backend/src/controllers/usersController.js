
const { db } = require('../config/config');

const getUsers = (req, res) => {
    try {
        const connection = db()
        let query = `select u.idUsuario, u.nombre ,u.apellido , u.correo , u.celular ,d.departamento, c.municipio, u.estado from Usuario u
                    inner join Municipio c on u.ciudad = c.idMunicipio
                    inner join Departamento d on d.idDepartamento = u.departamento;`

        connection.query(query, (error, result) => {
            //connection.end()

            if (error) {
                console.log(error);
                res.status(500).send({ error: error, message: "Error al obtener los usuarios." })
            } else {
                res.status(200).send(result)
            }
        })

    } catch (error) {
        console.log("Error en getUsers")
        console.log(error)
        res.status(500).send({ error: error, message: "Internal Server Error." })
    }
}

const disableUser = (req, res) => {
    try {
        const { idUser, estado } = req.body

        const connection = db()
        let query = `UPDATE Usuario u SET u.estado = ${estado} WHERE u.idUsuario = ${idUser};`

        connection.query(query, (error, result) => {
            //connection.end()
            const prefix = estado==1 ? 'habilitado' : 'deshabilitado'
            if (error) {
                console.log(error);
                res.status(500).send({ error: error, message: "Error al deshabilitar el usuario." })
            } else {
                res.status(200).send({message:`Usuario ${prefix} correctamente`})
            }
        })

    } catch (error) {
        console.log("Error en disableUser")
        console.log(error)
        res.status(500).send({ error: error, message: "Internal Server Error." })
    }
}


module.exports = {
    getUsers,
    disableUser
}