const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.JWS_SECRET_KEY; // Reemplaza con tu propia clave secreta


exports.generateJWT = (correo, rol) => {
    // Generar el token JWT
    const token = jwt.sign({ correo, rol }, secretKey, { expiresIn: '3h' });
    return token;
}

// Middleware de validación de token JWT
exports.validateToken = (req, res, next) => {
    // Obtén el token del encabezado de autorización
    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }
  
    try {
      // Verifica y decodifica el token
      const decodedToken = jwt.verify(token, secretKey);
  
      // Almacena los datos del token decodificado en la solicitud para uso posterior
      req.correo = decodedToken.correo;
      req.rol = decodedToken.rol;
  
      // Continúa con la siguiente ruta o middleware
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token inválido' });
    }
  };
  
exports.validateAuth = (req, res) => {
    const correo = req.correo;
    const rolToken = req.rol;
    const {rol} = req.body;
    //console.log(rolToken, rol, correo)
    if(rolToken == rol && (correo != undefined && correo != null)){
        return res.status(200).send({
            access: true,
            message: "Authenticated"
        });
    }else{
        return res.status(401).send({
            access: false,
            message: "Not Authenticated"
        })
    }
}

  /*// Utiliza el middleware en rutas que requieran autenticación
  app.get('/api/private', validateToken, (req, res) => {
    // Accede al userId almacenado en la solicitud
    const userId = req.userId;
  
    // Realiza acciones para rutas protegidas
    // ...
  });*/