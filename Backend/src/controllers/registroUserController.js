const {db} = require('../config/config');
const crypto = require('crypto');
const { generateJWT } = require('../config/jwtConfig');

function encryptPassword(password) {
    const passwordString = password.toString();
    let hash = crypto.createHash('md5').update(passwordString).digest('hex');
    return hash;
}

function comparePasswords(password, encryptedPassword) {
    if (encryptPassword(password) == encryptedPassword) {
        return true;
    }
    return false;
}

function createCuponName(idUser) {
    let cuponName = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 35; i++) {
        cuponName += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    cuponName += "_";
    cuponName += idUser;
    return cuponName;
}

const  getCupon = (req, res) => {
    const { correo } = req.body;
    try {
        const connection = db();
        const queryUser = 'SELECT * FROM Usuario WHERE correo = ?';
        const queryCupon = 'SELECT * FROM Cupon WHERE idusuario = ?';
        connection.query(queryUser, [correo], (err, resultUser) => {
            if (err) {
                //connection.end();
                return res.status(500).send({
                    error: err,
                    message: "Error en el servidor"
                })
            } else {
                if(resultUser.length != 0){
                    connection.query(queryCupon,[resultUser[0].idusuario], (err, resultCupon) => {
                        //connection.end();
                        if (err) {
                            return res.status(500).send({
                                error: err,
                                message: "Error en el servidor"
                            })
                        }else{
                            if(resultCupon.length >0){
                                return res.status(200).send({
                                    message: "Cupon obtenido correctamente",
                                    data: resultCupon
                                })
                            }else{
                                return res.status(400).send({
                                    error: err,
                                    message: "El usuario no existe"
                                })            
                            }
                        }
                    });
                }else{
                    return res.status(400).send({
                        error: err,
                        message: "El usuario no existe"
                    })
                }
            }
        })
    }catch(ex){
        res.status(500).send({ error: ex, message: "Internal Server Error." })
    }

}

const registerUser = (req, res) => {

    const { nombre, apellido, correo, tarjeta, celular, departamento, municipio, password } = req.body;
    const state = 1;
    try {

        const checkQuery = `SELECT * FROM Usuario WHERE correo = ?`;
        const insertUser = 'INSERT INTO Usuario (nombre, apellido, correo, tarjeta, celular, departamento, ciudad, estado, password) VALUES (?,?,?,?,?,?,?,?,?)';
        const insertCupon = 'INSERT INTO Cupon(numeroCupon, idusuario, canjeado) VALUES(?,?,?)'
        const connection = db();
        const dataPackageUser = [nombre, apellido, correo, tarjeta, celular, departamento, municipio, state, encryptPassword(password)];

        connection.query(checkQuery, [correo], (err, resultChecking) => {

            if (err) {
                //connection.end();
                return res.status(500).send({
                    message: "Hubo un error al verificar la existencia del usuario",
                    error: err
                });
            } else {
                if (resultChecking.length > 0) {
                    //connection.end();
                    return res.status(500).send({
                        message: "El usuario ya existe",
                        error: err
                    });
                } else {
                    connection.query(insertUser, dataPackageUser, (err, resultInsertUser) => {
                        if (err) {
                            //connection.end();
                            return res.status(500).send({
                                message: "Error al registrar el usuario",
                                error: err
                            })
                        } else {
                            const insertId = resultInsertUser.insertId;
                            const cuponNumber = createCuponName(insertId);
                            connection.query(insertCupon, [cuponNumber, insertId, false], (err, resultInsertCupon) => {
                                return res.status(200).send({
                                    message: "Usuario registrado correctamente",
                                    data: resultInsertUser,
                                    cupon: cuponNumber
                                })
                            });
                        }
                    })
                }
            }
        })

    } catch (error) {
        res.status(500).send({ error: error, message: "Internal Server Error." })
    }
}

const loginUser = (req, res) => {
    const { correo, password } = req.body;

    try {

        const connection = db();
        const query = 'SELECT correo, nombre, password, estado FROM Usuario WHERE correo = ? AND estado = 1';

        connection.query(query, [correo], (err, result) => {
            //connection.end();
            if (err) {
                console.log(err)
                return res.status(500).send({
                    error: err,
                    message: "Error en el servidor"
                })
            } else {
                if (result.length == 0) {
                    return res.status(401).send({
                        message: "El usuario no existe"
                    })
                } else {
                    const storagedPassword = result[0].password;
                    if (comparePasswords(password, storagedPassword)) {
                        const token = generateJWT(correo, 'usuario')
                        return res.status(200).send({
                            access: true,
                            nombre: result[0].nombre,
                            correo: result[0].correo,
                            message: `Acceso concedido`,
                            token: token
                        });
                    } else {
                        return res.status(401).send({
                            access: false,
                            message: "El correo o la contraseña son incorrectos"
                        })
                    }
                }
            }
        })
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            error: err,
            message: "Error en el servidor"
        })
    }
}

module.exports = {
    registerUser,
    loginUser,
    getCupon
}