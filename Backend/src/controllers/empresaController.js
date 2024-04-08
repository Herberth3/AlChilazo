const {db} = require('../config/config');
const {uploadFileToS3} = require('../config/s3config');
const crypto = require('crypto');
const { generate } = require('shortid');
const { generateJWT } = require('../config/jwtConfig');
const empresaController = {};

function encryptPassword(password){
    const passwordString = password.toString();
    let hash = crypto.createHash('md5').update(passwordString).digest('hex');
    return hash;
}

function comparePasswords(password, encryptedPassword){
    if(encryptPassword(password) == encryptedPassword){
        return true;
    }
    return false;
}

function compareCitys(idCiudad, respose){
    for(let i = 0; i < respose.length; i++){
        if(respose[i].idCiudad == idCiudad){
            return false;
        }
    }
    return true;

}


empresaController.historialPedidos = (req, res) => {
    const {correo} = req.body;
    const estado1 = 6;
    const estado2 = 7;
    const sqlCorreo = `SELECT * FROM Empresa WHERE correo = ?`;
    const sqlListas = `SELECT idListaPedidos, precio, DATE_FORMAT(fecha, '%d-%m-%y') AS fecha, descripcion
                        FROM Lista_Pedidos 
                        WHERE empresa=?
                            AND (estado=? OR estado=?)`;
    const sqlPedidoProducto = `SELECT p.idProducto, pr.nombreProducto, pr.foto, p.cantidad, p.precio, p.descripcion
                                FROM Pedido p 
                                    LEFT JOIN Producto pr
                                    ON p.idProducto=pr.idProducto
                                WHERE p.idlista_solicitud_pedido=?
                                    AND p.idProducto IS NOT NULL`;
    const sqlPedidoCombo = `SELECT p.idCombo, c.nombreCombo, c.foto, p.cantidad, p.precio, p.descripcion
                                FROM Pedido p
                                    LEFT JOIN Combo c
                                    ON p.idCombo=c.idCombo
                                WHERE p.idlista_solicitud_pedido=?
                                    AND p.idCombo IS NOT NULL`;                                
    try{
        const connection = db();
        connection.query(sqlCorreo, [correo], (err, result) => {
            if(err){
                //connection.end();
                return res.status(500).send({
                    error: err,
                    message: "Error en el servidor",
                    fail: 'sqlCorreo'
                });
            }else{
                const idEmpresa = result[0].idEmpresa;
                connection.query(sqlListas, [idEmpresa, estado1, estado2], (err, result) => {
                    if(err){
                        console.log(err)
                        //connection.end();
                        return res.status(500).send({
                            error: err,
                            message: "Error en el servidor",
                            fail: 'sqlListas'
                        });
                    }else{
                        const listas = result;
                        const resultados = [];
                        for(let index=0; index<listas.length; index++){
                            const lista = listas[index];
                            const idLista = lista.idListaPedidos;
                            connection.query(sqlPedidoProducto, [idLista], (err, result) => {
                                if(err){
                                    //connection.end();
                                    return res.status(500).send({
                                        error: err,
                                        message: "Error en el servidor"
                                    });
                                }else{
                                    const productos = result;
                                    connection.query(sqlPedidoCombo, [idLista], (err, result) => {
                                        if(err){
                                            //connection.end();
                                            return res.status(500).send({
                                                error: err,
                                                message: "Error en el servidor"
                                            });
                                        }else{
                                            const combos = result;
                                            const data = {
                                                lista: lista,
                                                productos: productos,
                                                combos: combos
                                            }
                                            resultados.push(data);
                                            if(index == listas.length-1){
                                                //connection.end();
                                                return res.status(200).send({
                                                    message: "Historial de pedidos obtenido correctamente",
                                                    data: resultados
                                                });
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            }
        });
    }catch(error){
        console.log(error)
        return res.status(500).send({
            error: error,
            message: "Error en el servidor"
        });
    }
}


empresaController.productoVendidos = (req, res) => {
    const {correo} = req.body;
    const estado1 = 6;
    const estado2 = 7;
    const sqlCorreo = `SELECT * FROM Empresa WHERE correo = ?`;
    const sqlQuery = `SELECT p.idProducto, p.idCombo, SUM(p.cantidad) as total
                        FROM Lista_Pedidos l 
                            LEFT JOIN Pedido p 
                                ON l.idListaPedidos=p.idlista_solicitud_pedido
                        WHERE l.empresa=?
                            AND (l.estado=? OR l.estado=?)
                        GROUP BY p.idProducto, p.idCombo
                        ORDER BY SUM(p.cantidad) DESC
                        LIMIT 1`;
    const sqlProducto = `SELECT * FROM Producto WHERE idProducto = ?`;
    const sqlCombo = `SELECT * FROM Combo WHERE idCombo = ?`;
    try{
        const connection = db();
        connection.query(sqlCorreo, [correo], (err, result) => {
            if(err){
                //connection.end();
                return res.status(500).send({
                    error: err,
                    message: "Error en el servidor"
                });
            }else{
                const idEmpresa = result[0].idEmpresa;
                connection.query(sqlQuery, [idEmpresa,estado1,estado2], (err, result) => {
                    if(err){
                        //connection.end();
                        return res.status(500).send({
                            error: err,
                            message: "Error en el servidor"
                        });
                    }else{
                        if(result.length > 0){
                            const idProducto = result[0].idProducto;
                            const idCombo = result[0].idCombo;
                            const total = result[0].total;
                            if(idProducto == null || idProducto == undefined){
                                //Obtener combo
                                console.log("Obteniendo combo idCOmbo"+ idCombo)
                                connection.query(sqlCombo, [idCombo], (err, result) => {
                                    //connection.end();
                                    if(err){
                                        return res.status(500).send({
                                            error: err,
                                            message: "Error en el servidor"
                                        });
                                    }else{
                                        console.log("Combo: "+JSON.stringify(result[0]))
                                        return res.status(200).send({
                                            message: "Combo obtenido correctamente",
                                            data: {
                                                nombre: result[0].nombreCombo,
                                                foto: result[0].foto,
                                                total: total
                                            },
                                            tipo: 'combo',
                                            total: total
                                        })
                                    }    
                                });
                            }else{
                                //Obtener producto
                                connection.query(sqlProducto, [idProducto], (err, result) => {
                                    //connection.end();
                                    if(err){
                                        return res.status(500).send({
                                            error: err,
                                            message: "Error en el servidor"
                                        });
                                    }else{
                                        return res.status(200).send({
                                            message: "Combo obtenido correctamente",
                                            data: {
                                                nombre: result[0].nombreProducto,
                                                foto: result[0].foto,
                                                total: total
                                            },
                                            tipo: 'producto',
                                            total: total
                                        })
                                    }    
                                });
                            }
                        }else{
                            return res.status(400).send({
                                error: err,
                                message: "No hay productos vendidos",
                                data: {
                                    nombre: 'Sin existencias',
                                    foto: '',
                                    total: 0
                                },
                                tipo: 'producto',
                            });
                        }
                    }
                })
            }
        });
    }catch(error){
        console.log("Reporte Productos Vendidos");
        console.log(error);
        return res.status(500).send({
            error: error,
            message: "Error en el servidor"
        });
    }

}

empresaController.getEmpresaCategory = (req, res) => {
    const categoria = req.body.categoria;
    const correo = req.body.correo;
    const sqlCorreo = 'SELECT departamento, ciudad FROM Usuario WHERE correo=?'
    const sqlCategory = `SELECT e.idEmpresa, e.nombre, e.url, m.idMunicipio, m.municipio
                            FROM Empresa e
                            LEFT JOIN Producto p
                                ON e.idEmpresa = p.empresa
                            LEFT JOIN DireccionEmpresa d
                                ON e.idEmpresa = d.idEmpresa
                            LEFT JOIN Municipio m
                                ON d.idCiudad = m.idMunicipio
                            WHERE p.categoria = ?
                                AND m.idMunicipio = ?
                            GROUP BY e.idEmpresa`;
    const sqlCombo = `SELECT e.idEmpresa, e.nombre, e.url, m.idMunicipio, m.municipio 
                        FROM Empresa e
                        LEFT JOIN Combo c
                            ON e.idEmpresa = (SELECT p.empresa
                                FROM Combo cmb
                                LEFT JOIN RelacionComboProducto r
                                    ON c.idCombo=r.idCombo
                                LEFT JOIN Producto p
                                    ON r.idProducto=p.idProducto
                                WHERE cmb.idCombo = c.idCombo
                                GROUP BY p.empresa)
                        LEFT JOIN DireccionEmpresa d
                            ON e.idEmpresa = d.idEmpresa
                        LEFT JOIN Municipio m
                            ON d.idCiudad = m.idMunicipio
                        WHERE c.categoria = ?
                            AND m.idMunicipio = ?
                        GROUP BY e.idEmpresa`;
    try{
        const connection = db();
        connection.query(sqlCorreo, [correo], (err, resultDirection) => {
            if(err){
                //connection.end();
                return res.status(500).send({
                    error: err,
                    message: "Error en el servidor"
                })
            }else{
                const direction = resultDirection[0];
                connection.query(sqlCategory, [categoria, direction.ciudad], (err, result) => {
                    if(err){
                        //connection.end();
                        return res.status(500).send({
                            error: err,
                            message: "Error en el servidor"
                        })
                    }else{
                        if(result.length >0){
                            //connection.end();
                            return res.status(200).send({
                                message: "Empresas obtenidas correctamente",
                                data: result
                            })
                        }else{
                            connection.query(sqlCombo, [categoria, direction.ciudad], (err, result) => {
                                //connection.end();
                                if(err){
                                    return res.status(500).send({
                                        error: err,
                                        message: "Error en el servidor"
                                    })
                                }else{
                                    return res.status(200).send({
                                        message: "Empresas obtenidas correctamente",
                                        data: result
                                    })
                                }
                            })
                        }
                    }

                });
            }
        });
    }catch(error){
        console.log(error);
        res.status(500).send({
            error: error,
            message: "Error en el servidor"
        })
    }
}

empresaController.uploadFile = (req, res) => {
    try{
        const foto = req.file.location;
        res.status(200).send({
            message: "Imagen subida correctamente",
            data: foto
        })
    }catch(error){
        console.log("UploadFile");
        console.log(error);
        res.status(500).send({
            error: error,
            message: "Error en el servidor"
        });
    }
}

empresaController.getEmpresa = (req, res) => {
    const { correo } = req.query;
    const sqlQuery = 'SELECT * FROM Empresa WHERE correo = ?';
    try{
        const connection = db();
        connection.query(sqlQuery,[correo], (err, result) => {
            //connection.end();
            if(err || result.length == 0){
                console.log(err);
                res.status(500).send({
                    message: "Error al obtener la empresa",
                    error: err
                })
            }else{
                res.status(200).send({
                    message: "Empresa Obtenida correctamente",
                    data: result[0],
                });
            }
        })
    }catch(error){
        res.status(500).send({
            error: error,
            message: "Error en el servidor"
        })
    }
}

empresaController.addCategoria = (req, res) => {
    const {categoria, name} = req.body;
    try{
        const connection = db();
        const sqlQuery = 'INSERT INTO Categoria (categoria, foto) VALUES (?, ?)';
        const urlCategoria = req.file.location;
        connection.query(sqlQuery, [categoria, urlCategoria], (err, result) => {
            //connection.end();
            if(err){
                console.log(err)
                return res.status(500).send({
                    error: err,
                    message: "Error en el servidor"
                })
            }else{
                return res.status(200).send({
                    access: true,
                    message: "Categoria agregada"
                })
            }
        });
    }catch(error){
        console.log("Error en addCategoria")
        console.log(error)
        res.status(500).send({error: error, message: "Internal Server Error.", solved:false})
    }
}

empresaController.getCategorias = (req, res) => {
    try{
        const connection = db();
        const query = 'SELECT * FROM Categoria';
        connection.query(query, (err, result) => {
            //connection.end();
            if(err){
                console.log(err)
                return res.status(500).send({
                    error: err,
                    message: "Error en el servidor"
                })
            }else{
                return res.status(200).send({
                    categorias: result,
                    message: "Categorias encontradas"
                })
            }
        })
    }catch(error){
        console.log("Error en getCategorias")
        console.log(error)
        res.status(500).send({error: error, message: "Internal Server Error."})
    }
}


empresaController.loginEmpresa = (req, res) => {
    const {correo, password} = req.body;
    try{
        const connection = db();
        const query = 'SELECT correo, nombre, password, estado FROM Empresa WHERE correo = ?';
        connection.query(query, [correo], (err, result) => {
            //connection.end();
            if(err){
                console.log(err)
                return res.status(500).send({
                    error: err,
                    message: "Error en el servidor"
                })
            }else{
                if(result.length == 0){
                    return res.status(401).send({
                        message: "El usuario no existe"
                    })
                }else{
                    const estado = result[0].estado;
                    const storagedPassword = result[0].password;
                    if(comparePasswords(password, storagedPassword)){
                        if(estado == 0){
                            return res.status(401).send({
                                access: false,
                                message: "Empresa no ha sido aprobada por el administrador"
                            })
                        }else{
                            const token = generateJWT(correo, 'empresa');
                            return res.status(200).send({
                                access: true,
                                nombre: result[0].nombre,
                                correo: result[0].correo,
                                message: `Acceso concedido`,
                                token: token
                            });   
                        }
                    }else{
                        return res.status(401).send({
                            access: false,
                            message: "El correo o la contraseña son incorrectos"
                        })
                    }
                }
            }
        })
    }catch(err){
        console.log(err)
        return res.status(500).send({
            error: err,
            message: "Error en el servidor"
        })
    }
}

empresaController.registrarEmpresa = (req, res) => {
    const {nombreEmpresa, correo, password, 
        departamento, municipio, descripcion, direccion} = req.body;
    const estado = 0;
    console.log("Entrando api")
    try{
        // Accede a los archivos adjuntos
        let autenticidadFile = {location:""};
        let registroFile = {location:""};
        let permisoFile = {location:""};
        if(req.files['autenticidad'] != undefined){
            autenticidadFile = req.files['autenticidad'][0];
        }        
        if(req.files['registro'] != undefined){
            registroFile = req.files['registro'][0];
        }
        if(req.files['permiso'] != undefined){
            permisoFile = req.files['permiso'][0];
        }
        const logoFile = req.files['logo'][0];
        let urlImages = {
            autenticidad: autenticidadFile.location,
            registro: registroFile.location,
            permiso: permisoFile.location,
            logo: logoFile.location
        }
        urlImages = JSON.stringify(urlImages);
        console.log("INICIO DE REGISTRO")
        console.log(urlImages)
        const checkingQuery = `SELECT e.idEmpresa, e.nombre, e.correo, d.idDepartamento, d.idCiudad FROM Empresa e 
                                INNER JOIN DireccionEmpresa d ON e.idEmpresa=d.idEmpresa  
                                WHERE correo = ?`;
        const insertEmpresaQuery = 'INSERT INTO Empresa (nombre, correo, password, descripcion, estado, url) VALUES (?,?,?,?,?,?)';
        const insertDireccionEmpresaQuery = 'INSERT INTO DireccionEmpresa (idEmpresa, idDepartamento, idCiudad, direccion) VALUES (?,?,?,?)';
        const connection = db();
        const dataPackageEmpresa = [nombreEmpresa, correo, encryptPassword(password), descripcion, estado, urlImages];
        
        connection.query(checkingQuery, [correo], (err, resultChecking) => {
            if(err){
                //connection.end();
                console.log(err);
                return res.status(500).send({
                    message: "Error al registrar la empresa",
                    error: err
                });
            }else{
                if(resultChecking.length > 0){
                    const idEmpresa = resultChecking[0].idEmpresa;
                    const nombre = resultChecking[0].nombre;
                    if(compareCitys(municipio, resultChecking) && nombre==nombreEmpresa){
                        const dataPackageDireccionEmpresa = [idEmpresa, departamento, municipio, direccion];
                            connection.query(insertDireccionEmpresaQuery, dataPackageDireccionEmpresa, (errDireccion, resultInsertDireccionEmpresa) => {
                                //connection.end();
                                if(errDireccion){
                                    console.log(errDireccion);
                                    return res.status(500).send({
                                        message: "Error al registrar la direccion de la empresa",
                                        error: err
                                    });
                                }else{
                                    console.log("***********Direccion de la empresa registrada correctamente***********");
                                    return res.status(200).send({
                                        message: "Se agregó una nueva direccion a la empresa existente",
                                        data: resultInsertDireccionEmpresa
                                    });
                                }
                            });
                    }else{
                        //connection.end();
                        return res.status(500).send({
                            message: "Ya existe una empresa registrada con ese correo"
                        });
                    }
                }else{
                    connection.query(insertEmpresaQuery, dataPackageEmpresa, (err, resultInsertEmpresa) => {
                        if(err){
                            //connection.end();
                            console.log(err);
                            return res.status(500).send({
                                message: "Error al registrar la empresa",
                                error: err
                            })
                        }else{
                            console.log("***********Empresa registrada correctamente***********");
                            const idEmpresa = resultInsertEmpresa.insertId;
                            const dataPackageDireccionEmpresa = [idEmpresa, departamento, municipio, direccion];
                            connection.query(insertDireccionEmpresaQuery, dataPackageDireccionEmpresa, (errDireccion, resultInsertDireccionEmpresa) => {
                                //connection.end();
                                if(errDireccion){
                                    console.log(errDireccion);
                                    return res.status(500).send({
                                        message: "Error al registrar la direccion de la empresa",
                                        error: err
                                    });
                                }else{
                                    console.log("***********Direccion de la empresa registrada correctamente***********");
                                    return res.status(200).send({
                                        message: "Empresa registrada correctamente",
                                        data: resultInsertEmpresa
                                    });
                                }
                            });
                        }
                    });
                }
            }

        });        
        
    }catch(err){
        console.log("Error")
        console.log(err)
        return res.status(500).send({
            error: err,
            message: "Error en el servidor"
        })
    }
}

empresaController.getDepartamentos = (req, res) => {
    const sqlQuery = 'SELECT * FROM Departamento';
    
    try{
        const connection = db();
        connection.query(sqlQuery, (err, result) => {
            //connection.end();            
            if(err){
                console.log(err);
                res.status(500).send({
                    message: "Error al obtener los departamentos",
                    error: err
                })
            }else{
                console.log("/***********Departamentos obtenidos correctamente***********/");
                res.status(200).send({
                    message: "Departamentos obtenidos correctamente",
                    data: result,
                });
            }
        });
    }catch(err){
        res.status(500).send({
            error: err,
            message: "Error en el servidor"
        })
    }
}

empresaController.getMunicipios = (req, res) => {
    const { departamento } = req.query;
    const sqlQuery = 'SELECT * FROM Municipio WHERE departamento = ?';
    try{
        const connection = db();
        connection.query(sqlQuery,[departamento], (err, result) => {
            //connection.end();
            if(err){
                console.log(err);
                res.status(500).send({
                    message: "Error al obtener los municipios",
                    error: err
                })
            }else{
                console.log("/***********Municipios obtenidos correctamente***********/");
                res.status(200).send({
                    message: "Municipios obtenidos correctamente",
                    data: result,
                });
            }
        })
    }catch(error){
        res.status(500).send({
            error: error,
            message: "Error en el servidor"
        })
    }
}

// Consulta a la BD que retorna la Lista_Pedidos de cierta empresa
empresaController.deliveryRequest = (req, res) => {

    const { empresa, departamento, municipio } = req.body;
    try {
        const connection = db()
        let query = `SELECT lp.idListaPedidos, lp.descripcion, d.departamento, m.municipio, lp.direccion, DATE_FORMAT(lp.fecha, '%d-%m-%y') AS fecha, e.nombre, lp.precio
                    FROM Lista_Pedidos lp 
                    LEFT JOIN Municipio m on m.idMunicipio  = lp.municipio 
                    LEFT join Departamento d on d.idDepartamento = lp.departamento
                    LEFT JOIN Empresa e on e.idEmpresa = lp.empresa
                    WHERE lp.estado = 3 and lp.empresa = ${empresa} and lp.departamento = ${departamento} and lp.municipio = ${municipio}
                    GROUP BY lp.idListaPedidos;`;

        connection.query(query, (error, result) => {
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

// Actualiza la BD el estado de la ListaPedidos al aprobar una entrega
empresaController.approveOrder = (req, res) => {

    try {
        const id = req.body.id

        const query = `UPDATE Lista_Pedidos lp SET lp.estado = ${req.body.estado} WHERE lp.idListaPedidos = ${id};`
        const connection = db()

        connection.query(query, (error, result) => {
            //connection.end()
            if (error) {
                console.log(error);
                res.status(500).send({ error: error, message: "Error al aprobar la solicitud" })
            } else {
                res.status(200).send({ message: `Solicitud aprobada` })
            }
        })

    } catch (error) {
        console.log("Error en approveRequest")
        console.log(error)
        res.status(500).send({ error: error, message: "Internal Server Error." })
    }

}



module.exports = empresaController;