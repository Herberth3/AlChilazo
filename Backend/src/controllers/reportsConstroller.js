const {db} = require('../config/config');

const usersReport = (req, res) => {

    let query = `SELECT u.nombre, u.apellido, u.correo, u.celular, u.estado, pd.direccion, m.municipio ,d.departamento FROM Usuario u
                LEFT JOIN PreferenciaDirecciones pd on pd.usuario  = u.idusuario  
                LEFT JOIN Municipio m on m.idMunicipio = u.ciudad 
                LEFT join Departamento d on d.idDepartamento = u.departamento;
                
                SELECT COUNT(*) AS total FROM Usuario;
                
                SELECT DATE_FORMAT(createdAt, '%Y-%m-%d') AS Fecha, COUNT(*) AS Cantidad
                FROM Usuario GROUP BY DATE_FORMAT(createdAt, '%Y-%m-%d');

                SELECT DATE_FORMAT(createdAt, '%m') AS Mes, COUNT(*) AS Cantidad
                FROM Usuario GROUP BY DATE_FORMAT(createdAt, '%m');

                SELECT YEAR(createdAt) AS Anio, COUNT(*) AS Cantidad
                FROM Usuario GROUP BY YEAR(createdAt);`

    const connection = db()
    connection.query(query, (error, result) => {
        //connection.end()
        if (error) {
            res.status(500).send({ error: error, message: "Error al obtener el reporte" })

        } else {
            res.status(200).send({
                users: result[0],
                total: result[1][0].total,
                perDay: result[2],
                perMonth: result[3],
                perYear: result[4]
            })
        }
    })
}

const topDeliveryReport = (req, res)=>{
    
    try {
        

    let query = `SELECT r.idrepartidor, r.nombre, r.apellido, AVG(l.calificacion) as total_puntos, COUNT(*) as cant_envios
    FROM Repartidor r
    LEFT JOIN Lista_Pedidos l ON r.idrepartidor = l.repartidor
    WHERE l.repartidor IS NOT NULL 
        AND l.calificacion IS NOT NULL
    ORDER BY AVG(l.calificacion) DESC
    LIMIT 5;`

    const connection = db()
    connection.query(query, (error, result) => {
        //connection.end()
        if (error) {
            console.log(error);
            res.status(500).send({ error: error, message: "Error al obtener el reporte" })

        } else {
            let data = {
                labels: [],
                dataPoints: [],
                dataShipments: []
            }

            if(result.length > 0){
                result.map((v)=>{
                    data.labels.push(v.nombre + " " + v.apellido)
                    data.dataPoints.push(v.total_puntos)
                    data.dataShipments.push(v.cant_envios)
                })
            }
            res.status(200).send(data)

        }
    })

    } catch (error) {
        console.log("Error en topDeliveryReport")
        console.log(error)
        res.status(500).send({ error: error, message: "Internal Server Error." })
    }
}

const topCompanyReport = (req, res)=>{
    
    try {
        
    let query = `SELECT e.nombre, COUNT(lp.idListaPedidos) AS total_pedidos FROM Lista_Pedidos lp
                INNER JOIN Empresa AS e ON e.idEmpresa = lp.empresa 
                WHERE lp.estado = 7
                GROUP BY e.nombre
                ORDER BY COUNT(lp.idListaPedidos) DESC
                LIMIT 5;`

    const connection = db()
    connection.query(query, (error, result) => {
        //connection.end()
        if (error) {
            res.status(500).send({ error: error, message: "Error al obtener el reporte" })

        } else {
            let data = {
                labels: [],
                total: []
            }

            if(result.length > 0){
                result.map((v)=>{
                    data.labels.push(v.nombre)
                    data.total.push(v.total_pedidos)
                })
                res.status(200).send(data)
            }
        }
    })

    } catch (error) {
        console.log("Error en topDeliveryReport")
        console.log(error)
        res.status(500).send({ error: error, message: "Internal Server Error." })
    }
}

const saleReport = (req, res)=>{
    try {
     
       

    const query = `SELECT COALESCE(p.idProducto, p.idCombo) AS idProducto,  COALESCE(P.nombreProducto, C.nombreCombo) AS nombreProducto
                    ,E.nombre as nombreEmpresa, Ca.categoria, 
                    COALESCE(P.precio, C.precio) AS precio,
                    COALESCE(P.descripcion, C.descripcion) AS descripcion,
                    COALESCE(P.foto, C.foto) AS foto,
                    SUM(p.cantidad) as totalVentas
                    FROM Lista_Pedidos l 
                        LEFT JOIN Pedido p 
                            ON l.idListaPedidos=p.idlista_solicitud_pedido
                        LEFT JOIN Empresa E
                            ON l.empresa=E.idEmpresa
                        LEFT JOIN Producto P
                            ON p.idProducto=P.idProducto
                        LEFT JOIN Combo C
                            ON p.idCombo=C.idCombo
                        LEFT JOIN Categoria Ca
                            ON COALESCE(C.categoria, P.categoria)=Ca.idCategoria
                    WHERE (l.estado=6 OR l.estado=7)
                    GROUP BY idProducto
                    ORDER BY SUM(p.cantidad) DESC
                    LIMIT 5`;
        
    const connection = db()
    connection.query(query, (error, result) => {
        if (error) {
            console.log(error);
            res.status(500).send({ error: error, message: "Error al obtener el reporte" })

        } else {
            
            res.status(200).send(result)
        }
    })

    } catch (error) {
        console.log("Error en topDeliveryReport")
        console.log(error)
        res.status(500).send({ error: error, message: "Internal Server Error." })
    }
}


module.exports = {
    usersReport,
    topDeliveryReport,
    topCompanyReport,
    saleReport
}