
const { db } = require('../config/config');

const getCompanies = (req, res) => {
    try {
        const connection = db()
        let query = `SELECT * FROM Empresa;`
        query  += `SELECT E.idEmpresa, E.nombre, E.descripcion 
                FROM Lista_Pedidos LP
                JOIN Pedido PD ON LP.idListaPedidos = PD.idlista_solicitud_pedido 
                JOIN Producto P ON PD.idProducto  = P.idProducto
                JOIN Empresa E ON P.empresa  = E.idEmpresa  
                WHERE LP.estado  = 7
                GROUP BY E.idEmpresa  
                LIMIT 5;`   

        connection.query(query, (error, result) => {
            //connection.end()

            if (error) {
                console.log(error);
                res.status(500).send({ error: error, message: "Error al obtener las empresas." })
            } else {
                res.status(200).send({
                    companies: result[0],
                    recommendedCompanies: result[1]
                })
            }
        })

    } catch (error) {
        console.log("Error en getCompanies")
        console.log(error)
        res.status(500).send({ error: error, message: "Internal Server Error." })
    }
}

module.exports = {
    getCompanies
}