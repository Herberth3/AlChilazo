const express = require('express')
const router = express.Router();
const generalController = require('../controllers/empresaController');
const productoController = require('../controllers/productoController');
const adminController = require('../controllers/adminController');
const repartidorRegisterController = require('../controllers/repartidorRegisterController');
const reportController = require('../controllers/reportsConstroller');
const {upload} = require('../config/s3config');
const depaCiudadController = require('../controllers/depaCiudadController');
const registerUserController = require('../controllers/registroUserController');
const repartidorController = require('../controllers/repartidorController');
const empresaController = require('../controllers/empresaController');
const userController = require('../controllers/usersController');
const userPedidoController = require('../controllers/userPedidoController');
const menuController = require('../controllers/menuController');
const jwtOptions = require('../config/jwtConfig');

router.post('/auth', jwtOptions.validateToken, jwtOptions.validateAuth);
//Empresa
router.get('/getDepartamentos', generalController.getDepartamentos);
router.get('/getMunicipios', generalController.getMunicipios);
router.get('/getCategorias', generalController.getCategorias);
router.post('/registrarEmpresa', upload.fields([
    { name: 'autenticidad', maxCount: 1 },
    { name: 'registro', maxCount: 1 },
    { name: 'permiso', maxCount: 1 },
    { name: 'logo', maxCount: 1 }
  ]), generalController.registrarEmpresa);
router.post('/loginEmpresa', generalController.loginEmpresa);
router.get('/getEmpresa', generalController.getEmpresa);
router.post('/empresaCategory', generalController.getEmpresaCategory);
router.post('/loginAdmin', adminController.loginAdmin);
router.post('/addCategoria', upload.single('categoriaFile'), generalController.addCategoria);
router.post('/empresa/deliveryRequest', generalController.deliveryRequest);
router.post('/empresa/approveOrder', generalController.approveOrder);
router.post('/empresa/reportes/productosVendidos', generalController.productoVendidos)
router.post('/empresa/reportes/historialPedidos', generalController.historialPedidos)

//Rutas producto
router.get('/getProductos', productoController.getProductos);
router.post('/insertProduct', upload.single('imagen'),productoController.insertProduct);
router.post('/insertCombo', upload.single('imagen'),productoController.insertCombo);
router.post('/uploadFile', upload.single('imagen'),empresaController.uploadFile);
router.post('/getProductosEmpresa', productoController.getProductosFromEmpresa);
router.post('/getCombosEmpresa', productoController.getCombosForEmpresa);
router.post('/deleteProduct', productoController.deleteProducto);
router.post('/obtenerDirecciones', productoController.obtenerDirecciones);
router.post('/obtenerExistencias', productoController.obtenerExistencias);
router.post('/insertExistencia', productoController.insertExistencia);
router.post('/getProductosCombo', productoController.getProductosCombo);
router.post('/getProduct', productoController.getProduct);
router.post('/modifyProduct', productoController.modifyProduct);
router.get('/getCompanies', menuController.getCompanies);

//Rutas ROL administrador
router.get("/admin/deliveryRequest", adminController.deliveryRequest)
router.post("/admin/approveRequest", adminController.approveRequest)
router.post("/admin/report/topDeliveryReport", reportController.topDeliveryReport)
router.post("/admin/report/topCompanyReport", reportController.topCompanyReport)
router.post("/admin/report/usersReport", reportController.usersReport)
router.post("/admin/report/saleReport", reportController.saleReport)
router.get("/admin/users", userController.getUsers)
router.post("/admin/users", userController.disableUser)

//Rutas ROL repartidor
router.post("/registroRepartidor", repartidorRegisterController.registerRepartidor);
router.post("/delivery/profile/modify", repartidorController.ModificarDatosRepartidor);
router.post("/delivery/profile", repartidorController.getProfile);
router.post("/delivery/orders", repartidorController.deliveryRequest);
router.post("/delivery/approveOrder", repartidorController.approveOrder);
router.post("/delivery/orderActivated", repartidorController.orderActivated);
router.post("/delivery/login", repartidorRegisterController.loginRepartidor);
router.post("/delivery/comissions", repartidorController.generateComissions);
router.post("/delivery/setcomission", repartidorController.setComission);
router.post("/delivery/promedio", repartidorController.getQualification)
/** Rutas ROL usuario
 * GET y POST de los datos de departamento y ciudad para mostrar en el registro
 **/
router.get("/departamento", depaCiudadController.getDepartamentos)
router.post("/municipio", depaCiudadController.getMunicipios)
router.post("/cupon", registerUserController.getCupon)
/************************** Registro Usuario *************************/
router.post("/usuario/registro", registerUserController.registerUser)
router.post("/usuario/login", registerUserController.loginUser)

//rutas SQL Pedidos
router.post("/pedido/getProducto", userPedidoController.getProducto)//retorna un objeto
router.post("/pedido/getCombo", userPedidoController.getCombo)//retorna un objeto
router.post("/pedido/getProductosCombo", userPedidoController.getProductosCombo)//retorna un array de objetos
router.post("/pedido/insertPedido", userPedidoController.insertPedido)//retorna un dato plano
router.post("/pedido/estado", userPedidoController.userOrderState)
router.post("/pedido/rating", userPedidoController.ratingUpdate)

//rutas SQL Carrito
router.post("/carrito/listadoProductosUsuario", userPedidoController.listadoProductosUsuario);//retorna un array con los listados de pedidos
router.post("/carrito/getPedidosListadoId", userPedidoController.getPedidosListadoId);//obtenemos el listado de pedidos por el id de un listado de pedidos
router.post("/carrito/updatePedido", userPedidoController.updatePedido);
router.post("/carrito/finalizarCarrito", userPedidoController.finalizarCarrito);//finalizamos el carrito y los  listados de pedidos pasan a solicitarse
router.post("/carrito/removerPedido", userPedidoController.removerPedido);
router.post("/carrito/removerListado", userPedidoController.removerListaPedidos);
router.post("/carrito/resolicitarListaPedidos", userPedidoController.resolicitarListaPedidos);

module.exports = router;