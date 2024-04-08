const {db} = require('../config/config');
const {uploadFileToS3} = require('../config/s3config');
const crypto = require('crypto');
const productoController = {};

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

productoController.modifyProduct = (req, res) => {
    const {idProducto, nombreProducto, categoria, precio, descripcion, foto, oferta, productos, combo} = req.body;
    try{
        const connection = db();
        const sqlQuery = combo ? `UPDATE Combo SET
                                        nombreCombo='${nombreProducto}',
                                        descripcion='${descripcion}',
                                        precio=${precio},
                                        foto='${foto}',
                                        categoria=${categoria},
                                        oferta=${oferta}
                                    WHERE idCombo=${idProducto}` 
                        : `UPDATE Producto SET
                                        nombreProducto='${nombreProducto}',
                                        categoria=${categoria},
                                        precio=${precio},
                                        descripcion='${descripcion}',
                                        foto='${foto}',
                                        oferta=${oferta}
                                    WHERE idProducto=${idProducto}`;
        connection.query(sqlQuery, (error, result) => {
            if(error){
                //connection.end();
                console.log("Error in modifyProduct")
                console.log(error);
                res.status(500).send({
                    error: error, 
                    modify: false,
                    message: "Error en modify Product"
                })
            }else{
                if(combo){
                    const sqlProductosDel = 'DELETE FROM RelacionComboProducto WHERE idCombo=?';
                    connection.query(sqlProductosDel, [idProducto], (error, result) => {
                        if(error){
                            //connection.end();
                            console.log("Error in modifyProduct")
                            console.log(error);
                            res.status(500).send({
                                error: error, 
                                modify: false,
                                message: "Error en modify Product"
                            })
                        }else{
                            const sqlProductos = 'INSERT INTO RelacionComboProducto (idCombo, idProducto) VALUES (?, ?)';
                            
                            for(let index=0; index<productos.length; index++){
                                connection.query(sqlProductos, [idProducto, productos[index]], (error, result) => {
                                    if(index == productos.length-1){
                                        //connection.end();
                                        console.log("Last product");
                                        res.status(200).send({
                                            modify: true,
                                            message:"Combo modificado Correctamente"
                                        });
                                    }
                                });
                            }
                        }
                    });
                }else{
                    res.status(200).send({
                        modify: true,
                        message: "Producto modificado correctamente."
                    }); 
                }
            }
        });
    }catch(error){
        console.log("Error in modifyProduct")
        console.log(error);
        res.status(500).send({
            error: error, 
            modify: false,
            message: "Internal Server Error."
        })
    }
}

productoController.getProduct = (req, res) => {
    const {id, combo} = req.body;
    try{
        const connection = db();
        let productos = [];
        const sqlQuery = combo==0 ? 
                            `SELECT p.idProducto as id, p.nombreProducto, p.categoria as idCategoria,
                             c.categoria, c.foto as fotoCategoria, p.precio, p.empresa,
                             p.descripcion, p.foto, p.oferta 
                                FROM Producto p 
                                    LEFT JOIN Categoria c
                                        ON p.categoria=c.idCategoria
                                WHERE p.idProducto=${id}` 
                            : `SELECT p.idCombo as id, p.nombreCombo as nombreProducto, p.categoria as idCategoria,
                                c.categoria, c.foto as fotoCategoria, p.precio, p.descripcion,
                                p.foto, p.oferta
                                    FROM Combo p
                                        LEFT JOIN Categoria c
                                            ON p.categoria=c.idCategoria
                                WHERE p.idCombo=${id}`;
        connection.query(sqlQuery, (err, result) => {
            //connection.end();
            if(err){
                console.log(err);
                return res.status(500).send({
                    error: err,
                    message: "Error en el servidor"
                })
            }else{
                return res.status(200).send({
                    producto: result[0]
                })
            }

        });
    }catch(error){
        console.log(error);
        return res.status(500).send({
            error: error,
            message: "Error en el servidor"
        });
    }
}

productoController.insertExistencia = (req, res) => {
    const {existencias, limitado, idProducto, idDireccion, creado} = req.body;
    try{
        const sqlQuery = !creado ? 
                        `INSERT INTO Existencias (idProducto, idDireccion, existencias, limitado) 
                        VALUES (${idProducto}, ${idDireccion}, ${existencias}, ${limitado})`
                        : `UPDATE Existencias SET existencias=${existencias}, limitado=${limitado}`
        const connection = db();
        connection.query(sqlQuery, (err, result) => {
            //connection.end();
            if(err){
                console.log(err);
                return res.status(500).send({
                    error: err,
                    message: "Error en el servidor"
                })
            }else{
                return res.status(200).send({
                    message: "Existencia Insertada"
                })
            }
        })
    }catch(error){
        return res.status(500).send({
            error: error,
            message: "Error en el servidor"
        })
    }
}

productoController.obtenerDirecciones = (req, res) => {
    const {correo}=req.body;
    try{
        const sqlQuery = `SELECT de.idDireccion, de.idDepartamento, d.departamento, de.idCiudad, c.municipio 
                            FROM DireccionEmpresa de 
                                LEFT JOIN Municipio c 
                                    ON de.idCiudad=c.idMunicipio 
                                LEFT JOIN Departamento d 
                                    ON de.idDepartamento=d.idDepartamento 
                            WHERE idEmpresa = (
                                SELECT idEmpresa 
                                    FROM Empresa 
                                WHERE correo='${correo}')`;
        const connection = db();
        connection.query(sqlQuery, (err, result) => {
            //connection.end();
            if(err){
                console.log(err);
                return res.status(500).send({
                    error: err,
                    message: "Error en el servidor"
                })
            }else{
                return res.status(200).send({
                    direcciones: result
                })
            }
        }); 
    }catch(error){
        console.log(error);
        return res.status(500).send({
            error: error,
            message: "Error en el servidor"
        })
    }

}

productoController.obtenerExistencias = (req, res) => {
    const {idDireccion, idProducto}=req.body;
    try{
        const sqlQuery = `SELECT * FROM Existencias WHERE idDireccion=${idDireccion} AND idProducto=${idProducto}`;
        const connection = db();

        connection.query(sqlQuery, (err, result) => {
            //connection.end();
            if(err){
                console.log(err);
                return res.status(500).send({
                    error: err,
                    message: "Error en el servidor"
                })
            }else{
                console.log("Resultado: "+JSON.stringify(result))
                return res.status(200).send({
                    existencia: result
                })
            }
        });
    }catch(error){
        console.log(error);
        return res.status(500).send({
            error: error,
            message: "Error en el servidor"
        })
    }

}

productoController.deleteProducto = (req, res) => {
    const {id, combo} = req.body;
    try{
        const query = `DELETE FROM Existencias WHERE idProducto=${id}`
        const sqlQuery = combo ? `DELETE FROM Combo WHERE idCombo=${id}` 
                                : `DELETE FROM Producto WHERE idProducto=${id}`;
        const connection = db();
        if(combo){
            connection.query(sqlQuery, (err, result) => {
                //connection.end();
                if(err){
                    console.log(err);
                    return res.status(500).send({
                        error: err,
                        message: "Error en el servidor",
                        deleted: false
                    })
                }else{
                    return res.status(200).send({
                        message: "Producto eliminado correctamente",
                        deleted: true
                    })
                }
            });
        }else{
            connection.query(query, (err, result) => {
                if(err){
                    console.log(err);
                    return res.status(500).send({
                        error: err,
                        message: "Error en el servidor",
                        deleted: false
                    })
                }else{
                    connection.query(sqlQuery, (err, result) => {
                        //connection.end();
                        if(err){
                            console.log(err);
                            return res.status(500).send({
                                error: err,
                                message: "Error en el servidor",
                                deleted: false
                            })
                        }else{
                            return res.status(200).send({
                                message: "Producto eliminado correctamente",
                                deleted: true
                            })
                        }
                    });
                }
            })
        }
        
    }catch(error){
        console.log(error);
        return res.status(500).send({
            error: error,
            message: "Error en el servidor",
            deleted: false
        })
    }

}

productoController.getProductosCombo = (req, res) => {
    const {idCombo} = req.body;
    try{
        const connection = db();
        const sqlQuery = `SELECT c.idCombo, c.nombreCombo, p.idProducto, p.nombreProducto, p.categoria, p.precio, p.empresa,
                        p.descripcion, p.foto, p.oferta 
                            FROM Combo c 
                                INNER JOIN RelacionComboProducto r
                                    ON c.idCombo=r.idCombo
                                INNER JOIN Producto p
                                    ON r.idProducto=p.idProducto
                            WHERE c.idCombo=${idCombo}`;
        connection.query(sqlQuery, (err, result) => {
            //connection.end();
            if(err){
                console.log(err);
                return res.status(500).send({
                    error: err,
                    message: "Error en el servidor",
                    deleted: false
                })
            }else{
                return res.status(200).send({
                    productos: result
                })
            }
        })
    }catch(error){
        console.log(error);
        return res.status(500).send({
            error: error,
            message: "Error en el servidor",
            deleted: false
        })
    }
}

productoController.getCombosForEmpresa = (req, res) => {
    const {empresa} = req.body;
    try{
        const connection = db();
        const sqlQuery = `  SELECT c.idCombo as id, r.idProducto, c.nombreCombo as nombreProducto, p.empresa, c.descripcion,
                            c.precio, cat.idCategoria, cat.categoria, c.oferta, 1 AS combo, c.foto 
                                FROM Combo c 
                                    INNER JOIN Categoria cat 
                                        ON c.categoria = cat.idCategoria 
                                    LEFT JOIN RelacionComboProducto r 
                                        ON c.idCombo=r.idCombo 
                                    LEFT JOIN Producto p 
                                        ON r.idProducto=p.idProducto 
                                WHERE p.empresa=${empresa}
                                    GROUP BY c.idCombo
        `;
        connection.query(sqlQuery, (err, result) => {
            //connection.end();
            if(err){
                console.log(err);
                return res.status(500).send({
                    error: err,
                    message: "Error en el servidor"
                })
            }else{
                return res.status(200).send({
                    combos: result
                })
            }
        })
    }catch(error){
        console.log(error);
        return res.status(500).send({
            error: error,
            message: "Error en el servidor"
        })
    }
}

productoController.getProductosFromEmpresa = (req, res) => {
    const {empresa} = req.body;
    try{
        const connection = db();
        const sqlQuery = `  SELECT p.idProducto as id, p.nombreProducto, c.categoria, p.categoria as idCategoria,
                            p.precio, p.descripcion, p.oferta, 0 AS combo, p.foto
                                FROM Producto p 
                                    LEFT JOIN Categoria c 
                                        ON p.categoria=c.idCategoria 
                            WHERE empresa=${empresa};
        
        `;
        connection.query(sqlQuery, (err, result) => {
            //connection.end();
            if(err){
                console.log(err);
                return res.status(500).send({
                    error: err,
                    message: "Error en el servidor"
                })
            }else{
                return res.status(200).send({
                    productos: result
                })
            }
        })
    }catch(error){
        console.log(error);
        return res.status(500).send({
            error: error,
            message: "Error en el servidor"
        })
    }
}

productoController.insertCombo = (req,res) => {
    let {idCategoria, nombre, precio, oferta, descripcion, productos} = req.body;
    try{
        const foto = req.file.location;
        const connection = db();
        let number = parseFloat(precio);
        let precioLimitado =  number.toFixed(2);
        const sqlQuery = `INSERT INTO Combo (nombreCombo, descripcion, precio, foto, categoria, oferta)
                        VALUES ('${nombre}', '${descripcion}', ${precioLimitado}, '${foto}', ${idCategoria}, ${oferta})`;
        connection.query(sqlQuery, (err, result) => {
            if(err){
                console.log(err)
                return res.status(500).send({
                    error: err,
                    message: "Error en el servidor"
                })
            }else{
                const idCombo = result.insertId;
                console.log("PRODUCTOS: "+JSON.stringify(productos));
                for(let index=0; index<productos.length; index++){
                    const idProducto = productos[index];
                    if(idProducto == ","){
                        continue;
                    }
                    const sqlQuery2 = `INSERT INTO RelacionComboProducto (idCombo, idProducto) VALUES (${idCombo}, ${idProducto})`;
                    connection.query(sqlQuery2, (err, resultCombo) => {
                        if(err){
                            console.log(err)
                            return res.status(500).send({
                                error: err,
                                message: "Error en el servidor"
                            })
                        }
                        if(index == productos.length - 1){
                            //connection.end();
                            return res.status(200).send({
                                message: "Combo agregado con exito",
                                inserted: true,
                                idCombo: idCombo
                            })
                        }
                    });
                }
            }
        });
    }catch(error){
        console.log("Error en insertCombo")
        console.log(error)
        res.status(500).send({error: error, message: "Internal Server Error.", inserted:false})
    }
}

productoController.insertProduct = (req, res) => {
    let {idCategoria, nombre, precio, empresa, oferta, descripcion} = req.body;
    try{
        const foto = req.file.location;
        const connection = db();
        let number = parseFloat(precio);
        let precioLimitado =  number.toFixed(2);
        const sqlQuery = `INSERT INTO Producto (nombreProducto, categoria, precio, empresa, descripcion, foto, oferta)
                        VALUES ('${nombre}', ${idCategoria}, ${precioLimitado}, ${empresa}, '${descripcion}', '${foto}', ${oferta})`;
        connection.query(sqlQuery, (err, result) => {
            //connection.end();
            if(err){
                console.log(err)
                return res.status(500).send({
                    error: err,
                    message: "Error en el servidor"
                })
            }else{
                return res.status(200).send({
                    message: "Producto agregado con exito",
                    inserted: true,
                    idProducto: result.insertId
                })
            }
        });
    }catch(error){
        console.log("Error en insertProduct: "+req.body.precio)
        console.log(error)
        res.status(500).send({error: error, message: "Internal Server Error.", inserted:false})
    }
}

productoController.getProductos = (req, res) => {
    try{
        const connection = db();
        const query = 'SELECT * FROM Producto';
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
                    productos: result,
                    message: "Productos Encontrados"
                })
            }
        })
    }catch(error){
        console.log("Error en getProductos")
        console.log(error)
        res.status(500).send({error: error, message: "Internal Server Error."})
    }
}

module.exports = productoController;
