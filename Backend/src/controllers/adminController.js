
const {db} = require('../config/config');
const sgMail = require('@sendgrid/mail');
const { generateJWT } = require('../config/jwtConfig');



const deliveryRequest = (req, res) => {

    try {
        const connection = db()
        let query = `select * from Repartidor rp
                    inner join Municipio c on rp.ciudad = c.idMunicipio
                    inner join Departamento d on d.idDepartamento = rp.departamento
                    inner join Licencia l on l.repartidor = rp.idrepartidor
                    inner join Transporte t on t.idrepartidor = rp.idrepartidor
                    where rp.estado = 0;
                    
                    SELECT e.idEmpresa ,e.nombre, e.descripcion, e.correo, e.url, de.direccion, m.municipio ,d.departamento, e.url, IFNULL(GROUP_CONCAT(c.categoria SEPARATOR ','), NULL) AS categorias,
                    IFNULL(LENGTH(e.url) - LENGTH(REPLACE(e.url, ';', '')) + 1, 0) AS cantidad_urls
                    FROM Empresa e
                    LEFT JOIN Producto p ON p.empresa = e.idEmpresa
                    LEFT JOIN Categoria c ON c.idCategoria = p.categoria
                    LEFT JOIN DireccionEmpresa de on de.idEmpresa = e.idEmpresa 
                    LEFT JOIN Municipio m on m.idMunicipio  = de.idCiudad 
                    LEFT join Departamento d on d.idDepartamento = de.idDepartamento
                    WHERE e.estado = 0
                    GROUP BY e.idEmpresa;`

        connection.query(query, (error, result) => {
            ////connection.end()

            if (error) {
                console.log(error);
                res.status(500).send({ error: error, message: "Error al obtener las solicitudes." })
            } else {
                if (result[1]) {
                    result[1].map((item) => {
                        item.urls = JSON.parse(item.url)
                    })
                }
                res.status(200).send({
                    drivers: result[0],
                    companies: result[1]
                })
            }
        })
    } catch (error) {
        console.log("Error en deliveryRequest")
        console.log(error)
        res.status(500).send({ error: error, message: "Internal Server Error." })
    }
}

const approveRequest = (req, res) => {

    try {
        const id = req.body.id
        const email = req.body.email ? req.body.email : ''
        const approve = req.body.approve ? '' : 'NO '

        const query = req.body.isCompany ? `UPDATE Empresa e SET e.estado = ${req.body.estado} WHERE e.idEmpresa = ${id};` : `UPDATE Repartidor r SET r.estado = ${req.body.estado} WHERE r.idrepartidor = ${id};`
        const connection = db()

        connection.query(query, (error, result) => {
            ////connection.end()
            if (error) {
                console.log(error);
                res.status(500).send({ error: error, message: "Error al aprobar la solicitud" })
            } else {

                sgMail.setApiKey('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');

                const msg = {
                    to: email,
                    from: 'alchilazo08@gmail.com',
                    subject: `SOLICITUD ${approve}APROBADA`,
                    html: generateHTML(approve, req.body.justification ? 'Justificacion: ' + req.body.justification : '')
                };

                sgMail.send(msg)
                    .then(() => {
                        res.status(200).send({ message: `Solicitud ${approve}aprobada` })
                    })
                    .catch((error) => {
                        console.log('Error', error.body);
                        res.status(500).send({ error: `Solicitud ${approve}aprobada, error al enviar el correo` })
                    });
            }
        })

    } catch (error) {
        console.log("Error en approveRequest")
        console.log(error)
        res.status(500).send({ error: error, message: "Internal Server Error." })
    }

}

const generateHTML = (approve, justification) => {
    const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Solicitud Aprobada</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                padding: 20px;
                margin: 0;
                text-align: center;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #fff;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                border: 2px solid #DB4F23;
            }
            h1 {
                color: #0066cc;
                text-align: center;
                margin-top: 0;
            }
            .titulo {
                margin-top: 0;
                padding-top: 0;
                background-color: red;
                
            }
            p {
                font-size: 16px;
                line-height: 1.5;
                margin-bottom: 20px;
            }
            img {
                width: 60px;
                margin: 0;
                padding: 0;
            }
            h2{
                color: #DB4F23;
                text-align: center;
            }
            .button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #F2890D;
                color: #fff;
                text-decoration: none;
                border-radius: 5px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1><img src="https://res.cloudinary.com/alex4191/image/upload/v1685731006/Alchilazo/ALCHILAZO_bpuyvh.png"
                    alt="" srcset=""></h1>
            <h2>Al Chilazo</h2>
            <h1>Solicitud ${approve}Aprobada</h1>
            <p>Estimado/a</p>
            <p><strong>Tenemos el agrado de informarle que su solicitud ${approve}ha sido aprobada.</strong></p>
            <p>${justification}<p>
            <p>Si tienes alguna pregunta o necesitas más información, no dudes en ponerte en contacto con nosotros.</p>
            <p>¡Gracias!</p>
            <p>Equipo de AlChilazo</p>
            <p><a href="http://localhost:3000" class="button">Visitar nuestro sitio web</a></p>
        </div>
    </body>
    </html>`
    return html
}

const loginAdmin = (req, res) => {
    const { usuario, password } = req.body;
    if(usuario === 'admin' && password === 'admin'){
        const token = generateJWT('admin', 'admin');
        return res.status(200).send({message: 'ok', access:true, token: token})
    }else{
        return res.status(401).send({message:"Usuario o contraseña incorrectos", access:false});
    }

}


module.exports = {
    deliveryRequest,
    approveRequest,
    loginAdmin
}