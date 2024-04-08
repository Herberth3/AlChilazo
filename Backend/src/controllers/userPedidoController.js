const { db } = require('../config/config');
const { getSelectFromSQL, executeSQL } = require('./sqlSimpleController');
exports.getProducto = async(req, res) => {
  const {codigo} = req.body;  
  console.log("Codigo de producto: ", codigo);
  const sql =
  `SELECT
    pr.idProducto AS codigo,
    pr.nombreProducto AS nombre,
    cat.categoria AS categoria,
    pr.precio AS precio,
    em.nombre AS empresa,
    pr.descripcion AS descripcion,
    pr.foto AS foto,
    pr.oferta AS oferta
  FROM
    Producto pr
    LEFT JOIN Empresa em ON pr.empresa = em.idEmpresa
    LEFT JOIN Categoria cat ON pr.categoria = cat.idCategoria
  WHERE
    pr.idProducto = ?;`

  const idSelect = `SELECT Para obtener un producto por id <${codigo}>`;
  const arrayParams = [codigo];
  const result = await getSelectFromSQL(idSelect, sql, arrayParams);
  let data = [];
  console.log(JSON.stringify(result.data));
  if(result.statusCode == 200){
    data = result.data[0];//mandamos el objeto {  {-- este --}  }
  }

  return res.status(result.statusCode).send({
    data: data,//mandamos el objeto {  {-- este --}  }
    msg: result.msg,
    statusCode: result.statusCode
  });
}

exports.getCombo = async (req, res) => {
  const { codigo } = req.body;
  console.log("Codigo de combo: ", codigo);
  
  const sql = 
  `SELECT
    cb.idCombo AS codigo,
    cb.nombreCombo AS nombre,
    cb.descripcion AS descripcion,
    cb.precio AS precio,
    cb.foto AS foto,
    cb.oferta AS oferta,
    cat.categoria AS categoria
  FROM
    Combo cb
    LEFT JOIN Categoria cat ON cb.categoria = cat.idCategoria
  WHERE
    cb.idCombo = ?;`;

  const idSelect = `SELECT Para obtener un combo por id <${codigo}>`;
  const arrayParams = [codigo];
  const result = await getSelectFromSQL(idSelect, sql, arrayParams);
  let data = [];

  if(result.statusCode == 200){
    data = result.data[0];//mandamos el objeto {  {-- este --}  }
  }

  return res.status(result.statusCode).send({
    data: data,//mandamos el objeto {  {-- este --}  }
    msg: result.msg,
    statusCode: result.statusCode
  });
};

exports.getProductosCombo = async (req, res) => {
  const { codigo } = req.body;
  console.log("ID Combo: ", codigo);

  const sql = `SELECT
    pr.idProducto AS codigo,
    pr.nombreProducto AS nombre,
    cat.categoria AS categoria,
    pr.precio AS precio,
    em.nombre AS empresa,
    pr.descripcion AS descripcion,
    pr.foto AS foto,
    pr.oferta AS oferta
  FROM
    Combo cb
    JOIN RelacionComboProducto rcp ON cb.idCombo = rcp.idCombo
    JOIN Producto pr ON rcp.idProducto = pr.idProducto
    LEFT JOIN Categoria cat ON pr.categoria = cat.idCategoria
    LEFT JOIN Empresa em ON pr.empresa = em.idEmpresa
  WHERE
    cb.idCombo = ?;`;

  const idSelect = `SELECT Para obtener los productos de un combo por id <${codigo}>`;
  const arrayParams = [codigo];
  const result = await getSelectFromSQL(idSelect, sql, arrayParams);

  return res.status(result.statusCode).send({
    data: result.data,//mandamos el objeto de objetos { {}, {}, {}, ...., {}}
    msg: result.msg,
    statusCode: result.statusCode
  });
};

/**
 * Funcion que nos retorna el carrito del usario con un id
 * si no existe retorna null
 * @param {} idUsuario 
 * @returns 
 */
const getCarritoUsuario = async (idUsuario) => {
  const sql = 
  `SELECT
    c.idCarrito AS idCarrito
  FROM
    Carrito c
  WHERE
    c.estado = 1 AND c.idUsuario = ?;`;

  const idSelect = `SELECT Para obtener el carrito del usuario <${idUsuario}>`;
  const arrayParams = [idUsuario];
  const result = await getSelectFromSQL(idSelect, sql, arrayParams);
  let idCarrito = null;
  if (result.statusCode === 200) {//si se encontron un carrito activo se retorna su valor
    idCarrito = result.data[0].idCarrito;
  }
  return {
    idCarrito: idCarrito
  };
}
/**
 * Creamos un nuevo carrito para usuario
 * @param {} idUsuario 
 * @returns 
 */
const createNewCarritoUsuario = async (idUsuario) => {
  const sql = 
  `INSERT INTO 
    Carrito(
      idUsuario
    ) 
    VALUES (?)
  ;`;
  const idOperation = `INSERT de nuevo carrito para el usuario <${idUsuario}>`;
  const arrayParams = [idUsuario];
  const result = await executeSQL(idOperation, sql, arrayParams);
  console.log(result.msg);
  let idCarrito = null;
  if (result.success === true) {//si se ingreso de forma correcta el nuevo carrito
    const result2 = await getCarritoUsuario(idUsuario);//se obtiene el nuevo id
    idCarrito = result2.idCarrito;
  }
  return  idCarrito;
}

/**
 * Obtenemos el id del usuario segun su correo
 * @param {} correo 
 * @returns 
 */
const getIdUsuarioFromCorreo = async (correo) => {
  const sql = 
  `SELECT
    u.idUsuario AS idUsuario
  FROM
    Usuario u
  WHERE
    u.correo = ?;`;

  const idSelect = `SELECT Para obtener el id del usuario <${correo}>`;
  const arrayParams = [correo];
  const result = await getSelectFromSQL(idSelect, sql, arrayParams);
  let idUsuario = null;
  if (result.statusCode === 200) {
    idUsuario = result.data[0].idUsuario;
  }
  return idUsuario;
}

/**
 * Funcion que utiliza la funcion getIdUsuario from correo para obtener el id del usuario
 * usamos la funcion getCarritoUsuario para ver si tiene un carrito
 * sino, cremaos uno nuevo y obtenemos el valor
 * @param {} correo 
 */
const getCarritoCreateIfNotExist = async(correo) => {
  let idCarrito = null;
  let statusCode = 200;
  const idUsuario = await getIdUsuarioFromCorreo(correo);
  const consulta = await getCarritoUsuario(idUsuario);//obtiene si hay un carrito actual o no
  idCarrito = consulta.idCarrito;
  if (idCarrito === null) {
    // no existe uno actual, procedemos a crear uno nuevo
    const insert = await createNewCarritoUsuario(idUsuario);
    idCarrito = insert.idCarrito;
  } 

  //si despues de eso no hay carrito, entonces se produjeron errores
  if (idCarrito === null) {
    statusCode = 500;
  } 

  return {//retornamos los valores
    idCarrito: idCarrito,
    statusCode: statusCode
  }
}

exports.getCarrito = async (req, res) => {
  const { correo } = req.body;
  console.log("Correo usuario ", correo);
  const objCarrito = await getCarritoCreateIfNotExist(correo); 

  return res.status(objCarrito.statusCode).send({
    idCarrito: objCarrito.idCarrito//retornamos un dato plano
  });
};

/**
 * Funcion con el que se obtiene el id de la empresa de un producto con un id en especifico
 * @param {*} codigo 
 * @returns 
 */
const getEmpresaByIdProducto = async (codigo) => {
  const sql =
  `SELECT
    empresa
  FROM
    Producto
  WHERE
    idProducto = ?;`

  const idSelect = `SELECT Para obtener el idEmpresa por producto por id <${codigo}>`;
  const arrayParams = [codigo];
  const result = await getSelectFromSQL(idSelect, sql, arrayParams);
  let data = null;
  if(result.statusCode == 200){
    data = result.data[0].empresa;//mandamos el objeto {  {-- este --}  }
  }

  return {
    data: data,//mandamos el id de la empresa
    msg: result.msg,
    statusCode: result.statusCode
  };
} 

/**
 * Funcion con el que se obtiene el id de la empresa de un combo con un id en especifico
 * @param {*} codigo 
 * @returns 
 */
const getEmpresaByIdCombo = async (codigo) => {
  const sql = `SELECT
    pr.idProducto AS codigo,
    pr.nombreProducto AS nombre,
    pr.precio AS precio,
    pr.empresa AS empresa,
    pr.descripcion AS descripcion,
    pr.foto AS foto,
    pr.oferta AS oferta
  FROM
    Combo cb
    JOIN RelacionComboProducto rcp ON cb.idCombo = rcp.idCombo
    JOIN Producto pr ON rcp.idProducto = pr.idProducto
  WHERE
    cb.idCombo = ?;`;

  const idSelect = `SELECT Para obtener los productos de un combo por id <${codigo}>, este se usara para obtener el id de empresa`;
  const arrayParams = [codigo];
  const result = await getSelectFromSQL(idSelect, sql, arrayParams);

  let empresa = null;
  if(result.statusCode == 200){
    empresa = result.data[0].empresa;//mandamos el objeto {  {-- este --}  }
  }

  return {
    data: empresa,//mandamos el id de la empresa
    msg: result.msg,
    statusCode: result.statusCode
  };
} 
/**
 * Función que verifica si existe un Listado_Pedidos con el idCarrito y la empresa especificada.
 * Si existe, devuelve el id del Listado_Pedidos.
 * Si no existe, crea un nuevo Listado_Pedidos y devuelve el nuevo id.
 * @param {number} idCarrito - ID del carrito
 * @param {string} empresa - Nombre de la empresa
 * @returns {Promise<number>} - Promesa que resuelve con el id del Listado_Pedidos
 */
const getListaPedidosId = async (idCarrito, empresa) => {
  const existingListadoPedidosId = await selectListadoPedidosId(idCarrito, empresa);

  if (existingListadoPedidosId) {
    // El Listado_Pedidos existe, devolver su id
    return existingListadoPedidosId;
  } else {
    // El Listado_Pedidos no existe, crear uno nuevo
    const newListadoPedidosId = await insertListadoPedidos(idCarrito, empresa);
    return newListadoPedidosId;
  }
}

/**
 * Función que realiza la consulta SELECT para obtener el id del Listado_Pedidos existente.
 * @param {number} idCarrito - ID del carrito
 * @param {string} empresa - Nombre de la empresa
 * @returns {Promise<number|null>} - Promesa que resuelve con el id del Listado_Pedidos existente o null si no existe
 */
const selectListadoPedidosId = async (idCarrito, empresa) => {
  const sqlSelect = 
    `SELECT
      idListaPedidos
    FROM
      Lista_Pedidos
    WHERE
      carrito = ? AND empresa = ?;`;

  const selectParams = [idCarrito, empresa];
  const selectResult = await getSelectFromSQL('SELECT de Lista_Pedidos', sqlSelect, selectParams);

  if (selectResult.statusCode == 200) {
    // El Listado_Pedidos existe, devolver su id
    return selectResult.data[0].idListaPedidos;
  } else {
    return null;
  }
}

/**
 * Función que realiza la consulta SELECT para obtener el id del Listado_Pedidos existente.
 * @param {number} idCarrito - ID del carrito
 * @returns {Promise<number|null>} - Promesa que resuelve con el ilistado de pedidos
 */
const selectListadoPedidoPorCarrito = async (idCarrito) => {
  const sqlSelect = 
    `SELECT
      lp.idListaPedidos,
      lp.descripcion,
      lp.departamento,
      lp.municipio,
      lp.direccion,
      lp.estado,
      lp.calificacion,
      DATE_FORMAT(lp.fecha, '%d-%m-%y') AS fecha,
      lp.repartidor,
      em.nombre AS empresa,
      lp.precio,
      lp.carrito
    FROM
      Lista_Pedidos lp
      JOIN Empresa em ON lp.empresa = em.idEmpresa 
    WHERE
      carrito = ?;`;

  const selectParams = [idCarrito];
  const selectResult = await getSelectFromSQL('SELECT de Lista_Pedidos por carrito', sqlSelect, selectParams);

  return selectResult;//objeto con {data, msg, statusCode}
}

/**
 * Función que realiza el INSERT para crear un nuevo Listado_Pedidos y devuelve su id.
 * Este listado de pedidos es uno inicial, al final cuando Carrito se facture, se agregara el resto de informacion
 * como: departamento, municipio, direccion, calificacion, fecha
 * @param {number} idCarrito - ID del carrito
 * @param {string} empresa - Nombre de la empresa
 * @returns {Promise<number>} - Promesa que resuelve con el id del nuevo Listado_Pedidos
 */
const insertListadoPedidos = async (idCarrito, empresa) => {
  const sqlInsert = 
    `INSERT INTO 
      Lista_Pedidos(
        descripcion,
        estado,
        fecha,
        empresa,
        carrito
      ) 
      VALUES (?, ?, ?, ?, ?)
    ;`;

  const descripcion = `Listado de pedidos del carrito ${idCarrito} de la empresa ${empresa}`;
  const estado = 0;//inicia en 0 porque hasta que carrito facture, cambia a 1 o algun otro estado
  const fecha = new Date();
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, '0');
  const day = String(fecha.getDate()).padStart(2, '0');
  const fechaFormateada = `${year}-${month}-${day}`;
  const insertParams = [descripcion, estado, fechaFormateada, empresa, idCarrito];
  const insertResult = await executeSQL('INSERT de Lista_Pedidos', sqlInsert, insertParams);
    
  if (insertResult.success) {
    // Devolver el id del nuevo Listado_Pedidos
    const nuevoIdListado = await selectListadoPedidosId(idCarrito, empresa);
    return nuevoIdListado;
  } else {
    // Ocurrió un error al crear el Listado_Pedidos
    return null;
  }
}

/**
 * Función para ingresar un nuevo Pedido.
 * Verifica si existe un Listado_Pedidos con el idCarrito y la empresa especificada.
 * Si existe, ingresa el Pedido utilizando el id del Listado_Pedidos.
 * Si no existe, crea un nuevo Listado_Pedidos, obtiene su id y luego ingresa el Pedido.
 * @param {number} idCarrito - ID del carrito
 * @param {string} empresa - Nombre de la empresa
 * @param {number} idProducto - ID del producto
 * @param {number} idCombo - ID del combo
 * @param {number} cantidad - Cantidad del pedido
 * @param {number} precio - Precio del pedido
 * @param {string} descripcion - Descripción del pedido
 * @returns {Promise<number>} - Promesa que resuelve con el id del Pedido ingresado
 */
const ingresarPedido = async (idCarrito, empresa, idProducto, idCombo, cantidad, precio, descripcion) => {
  try {
    // Obtener el id del Listado_Pedidos
    const idListadoPedidos = await getListaPedidosId(idCarrito, empresa);
    const nombreCampo = (idProducto === 0 || idProducto === null || idProducto === undefined) ? "idCombo": "idProducto";
    // Insertar el Pedido utilizando el id del Listado_Pedidos
    const sqlInsert = 
      `INSERT INTO 
        Pedido(
          idLista_solicitud_pedido,
          ${nombreCampo},
          cantidad,
          precio,
          descripcion
        ) 
        VALUES (?, ?, ?, ?, ?)
      ;`;

    const valorCampo = (idProducto === 0 || idProducto === null || idProducto === undefined) ? idCombo : idProducto;
    console.log("campo: " + nombreCampo + " valor: " + valorCampo);
    const insertParams = [idListadoPedidos, valorCampo, cantidad, precio, descripcion];
    const result = await executeSQL('INSERT de nuevo Pedido', sqlInsert, insertParams);
    //result tiene success, msg, result, statusCode
    if(result.statusCode === 200){//se hizo el insert, actualizamos precios de los listados
      const resultPrecioLista = await updatePrecioListaPedido(idListadoPedidos);
      console.log(resultPrecioLista.msg);
    }
    return (result);
  } catch (error) {
    return {
      statusCode: 500//error
    }
  }
};



/**
 * Controlador para insertar un nuevo Pedido.
 * Verifica si existe un Carrito de Usuario con el correo especificado.
 * Si existe, ingresa el Pedido utilizando el Carrito.
 * Si no existe, crea un nuevo Carrito de Usuario y luego ingresa el Pedido.
 * @param {Object} req - Objeto de solicitud (req.body debe contener: correo, idProducto, idCombo, cantidad, precio, descripcion)
 * @param {Object} res - Objeto de respuesta
 * @returns {Promise<Object>} - Promesa que resuelve con el objeto de respuesta
 */
exports.insertPedido = async (req, res) => {
  try {
    const { correo, idProducto, idCombo, cantidad, precio, descripcion } = req.body;
    console.log("Correo usuario: ", correo);

    // Obtener el carrito del usuario o crear uno nuevo si no existe
    const carrito = await getCarritoCreateIfNotExist(correo);
    const idCarrito = carrito.idCarrito;

    //Obtener el id de la empresa, si es producto o combo utilizamos diferentes funciones
    const consulta = (idProducto === 0 || idProducto === null || idProducto === undefined)  ? await getEmpresaByIdCombo(idCombo) : await getEmpresaByIdProducto(idProducto); 
    const empresa = consulta.data;

    // Ingresar el pedido utilizando el carrito y los datos del pedido
    const result = await ingresarPedido(idCarrito, empresa, idProducto, idCombo, cantidad, precio, descripcion);
    //result trae {sucess, msg, statusCode}
    console.log("statusCode: " + result.statusCode + " MENSAUE: " + result.msg);
    return res.status(result.statusCode).send(result);
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      msg: 'Error al insertar el Pedido.',
      statusCode: 500
    });
  }
};

/**
 * Con el <correo> se obtiene el carrito actual
 * con el <listadoPedidos> se obtienen los pedidos que posee
 * se asignan los pedidos al carrito en el listado de la <empresa>
 * @param {Object} req - Objeto de solicitud (req.body debe contener: correo, idListaPedidos, empresa)
 * @param {Object} res - Objeto de respuesta
 * @returns {Promise<Object>} - Promesa que resuelve con el objeto de respuesta
 */
exports.resolicitarListaPedidos = async (req, res) => {
  try {
    const { correo, idListaPedidos, empresa } = req.body;
    console.log(`ID de ListaPedidos ${idListaPedidos} a resolicitar`);

    // Obtener el carrito del usuario o crear uno nuevo si no existe
    const carrito = await getCarritoCreateIfNotExist(correo);
    const idCarrito = carrito.idCarrito;

    const resultPedidos = await selectPedidosListadoId(idListaPedidos);
    //result posee statusCode, data, msg
    if(resultPedidos.statusCode === 200){//tiene datos y existen pedidos
      const listadoPedidos = resultPedidos.data;//array ed objects
      // Ingresar el pedido utilizando el carrito y los datos del pedido
      // Iterar sobre cada objeto del array utilizando map
      listadoPedidos.map(async (item) => {
        const { idProducto, idCombo, cantidad, precio, descripcion } = item;
        console.log("EL OBJECTO: " + JSON.stringify(item));
        console.log("idProducto: " + idProducto);
        console.log("idCombo; " + idCombo);
        // Ingresar el pedido utilizando el carrito y los datos del pedido
        const result = await ingresarPedido(idCarrito, empresa, idProducto, idCombo, cantidad, precio, descripcion);
        console.log(result.msg);
      });
    }    
    
    return res.status(200).send({
      msg: 'se ingresaron los pedidos',
      statusCode: 200
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      msg: 'Error al resolicitar pedido',
      statusCode: 500
    });
  }
}

/**
 * Controlador para modificar datos de un Pedido.
 * se hace alter de pedido
 * @param {Object} req - Objeto de solicitud (req.body debe contener: correo, idProducto, idCombo, cantidad, precio, descripcion)
 * @param {Object} res - Objeto de respuesta
 * @returns {Promise<Object>} - Promesa que resuelve con el objeto de respuesta
 */
exports.updatePedido = async (req, res) => {
  try {
    const { idListaPedido, idPedido, cantidad, precio, descripcion } = req.body;
    console.log("Id pedido a modificar: ", idPedido);

    const sqlUpdate = `
      UPDATE Pedido
      SET
        cantidad = ?,
        precio = ?,
        descripcion = ?
      WHERE idPedido = ?;
    `;

    const updateParams = [cantidad, precio, descripcion, idPedido];
    const result = await executeSQL(`UPDATE de Pedido ${idPedido}`, sqlUpdate, updateParams);
    //result tiene success (true or false), msg y statusCode (200 ok, 500 error)   
    if(result.success === true){
      const resultUpdatePrecio = await updatePrecioListaPedido(idListaPedido);
      console.log(resultUpdatePrecio.msg);
    }
    
    return res.status(200).send(result);
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      msg: 'Error al insertar el Pedido.',
      success: false,
      statusCode: 500
    });
  }
};

/**
 * Controlador para remover un pedido
 * @param {Object} req - Objeto de solicitud (req.body debe contener: idListaPedido, idPedido)
 * @param {Object} res - Objeto de respuesta
 * @returns {Promise<Object>} - Promesa que resuelve con el objeto de respuesta
 */
exports.removerPedido = async (req, res) => {
  try {
    const { idListaPedido, idPedido} = req.body;
    console.log("Id pedido a remover: ", idPedido);

    const sqlDelete = `
      DELETE FROM Pedido
      WHERE idPedido = ?;
    `;

    const deleteParams = [idPedido];
    const result = await executeSQL(`DELETE de Pedido ${idPedido}`, sqlDelete, deleteParams);
    //result tiene success (true or false), msg y statusCode (200 ok, 500 error)   
    if(result.success === true){
      const resultUpdatePrecio = await updatePrecioListaPedido(idListaPedido);
      console.log(resultUpdatePrecio.msg);
    }

    const resultDeletIfEmpty = await deleteListaPedidosIfEmpty(idListaPedido);
    
    return res.status(200).send(result);
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      msg: 'Error al remover el Pedido.',
      success: false,
      statusCode: 500
    });
  }
};

/**
 * Controlador para remover una lista de pedidos
 * @param {Object} req - Objeto de solicitud (req.body debe contener: idListaPedido)
 * @param {Object} res - Objeto de respuesta
 * @returns {Promise<Object>} - Promesa que resuelve con el objeto de respuesta
 */
exports.removerListaPedidos = async (req, res) => {
  try {
    const { idListaPedido } = req.body;
    const resultDeletePedidos = await deletePedidosByListaPedidos(idListaPedido);
    let success = false;
    let statusCode = 500;

    if(resultDeletePedidos.success){
      const resultDeleteListadoPedidos = await deleteListaPedidos(idListaPedido);
      success = resultDeleteListadoPedidos.success;
      if(resultDeletePedidos.success && resultDeleteListadoPedidos.success){
        statusCode = 200;
      }
      console.log("Se removio el listado y pedidos: " + resultDeleteListadoPedidos.success);
    }    
    
    return res.status(statusCode).send({
      success: success,
      statusCode: statusCode
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      msg: 'Error al remover el Pedido.',
      success: false,
      statusCode: 500
    });
  }
};

/**
 * Función que realiza la consulta SELECT para obtener la cantidad de Pedidos
 * por Listado de Pedidos
 * @param {number} idCarrito - ID del carrito
 * @returns {Promise<number|null>} - Promesa que resuelve con el ilistado de pedidos
 */
const deleteListaPedidosIfEmpty = async (idListaPedido) => {
  console.log("Codigo del listado de pedidos a revisar: ", idListaPedido);  
  const result = await selectPedidosListadoId(idListaPedido);
  if(result.statusCode === 401){//vacio
    const resultDeleteListadoPedidos = await deleteListaPedidos(idListaPedido);
    console.log(`El listado <${idListaPedido} estaba vacio y se borro>: ${resultDeleteListadoPedidos.success}`);
  }

  return result;//objeto con {data, msg, statusCode}
}

const deleteListaPedidos = async (idListaPedido) => {
  console.log("Id lista de pedido a remover: ", idListaPedido);

  const sqlDelete = `
    DELETE FROM Lista_Pedidos
    WHERE idListaPedidos = ?;
  `;

  const deleteParams = [idListaPedido];
  const result = await executeSQL(`DELETE de Lista_Pedido ${idListaPedido}`, sqlDelete, deleteParams);
  //result tiene success (true or false), msg y statusCode (200 ok, 500 error)   

  return result;
}


const deletePedidosByListaPedidos = async (idListaPedido) => {
  console.log("Id de ListaPedido de pedidos a remover: ", idListaPedido);

  const sqlDelete = `
    DELETE FROM Pedido
    WHERE idlista_solicitud_pedido = ?;
  `;

  const deleteParams = [idListaPedido];
  const result = await executeSQL(`DELETE de Pedidos que tengan Lista_Pedido ${idListaPedido}`, sqlDelete, deleteParams);
  //result tiene success (true or false), msg y statusCode (200 ok, 500 error)   
  
  return result;
}

/**
 * Controlador para actualizar el precio de los litados de pedidods
 * se hace update del precio del listado de pedido
 * @param {Number} codigo - Id de ListaPedidos
 */
const updatePrecioListaPedido = async (codigo) => {
  try {
    console.log("Id listado de pedidos a modificar: ", codigo);
    const sqlUpdate = `
      UPDATE Lista_Pedidos
      SET precio = (
          SELECT SUM(precio) AS total_precio
          FROM Pedido
          WHERE idLista_solicitud_pedido = ?
      )
      WHERE idListaPedidos = ?;
    `;

    const updateParams = [codigo, codigo];
    const result = await executeSQL(`UPDATE del precio de Lista de Pedidos ${codigo}`, sqlUpdate, updateParams);
    //result tiene success (true or false), msg y statusCode (200 ok, 500 error)
    return result;
  } catch (error) {
    console.error(error);
    return {
      msg: 'Error al insertar actualizar el precio del listado de pedidos.',
      success: false,
      statusCode: 500
    };
  }
};

/**
 * Controlador para obtener el listado de prouctos de un usuario, se obtiene el correo
 * Verifica si existe un Carrito de Usuario con el correo especificado.
 * Si existe, usa el id sino, crea uno nuevo.
 * Retornamos la consulta.
 * @param {Object} req - Objeto de solicitud (req.body debe contener: correo, idProducto, idCombo, cantidad, precio, descripcion)
 * @param {Object} res - Objeto de respuesta
 * @returns {Promise<Object>} - Promesa que resuelve con el objeto de respuesta
 */
exports.listadoProductosUsuario = async (req, res) => {
  try {
    const { correo } = req.body;
    console.log("Correo usuario: ", correo);

    // Obtener el carrito del usuario o crear uno nuevo si no existe
    const requestCarrito = await getCarritoCreateIfNotExist(correo);
    const idCarrito = requestCarrito.idCarrito;

    //Obtener el id de la empresa, si es producto o combo utilizamos diferentes funciones
    const requestListado = await selectListadoPedidoPorCarrito(idCarrito);
    //retorna {data, msg, statusCode}
    //statusCode: 200 (OK), 401(sin datos), 500(error)
    return res.status(requestListado.statusCode).send(requestListado);
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      statusCode: 500
    });
  }
};

/**
 * Se obtienen los pedidos que posee un Lista_Pedidos por su id
 * @param {Id} idListado 
 * @returns 
 */
const selectPedidosListadoId = async (idListado) => {
  const sql = 
  `SELECT
    *
  FROM
    Pedido
  WHERE
    idLista_solicitud_pedido = ?;`;

  const idSelect = `SELECT Para obtener el listado de pedidos de la lista <${idListado}>`;
  const arrayParams = [idListado];
  const result = await getSelectFromSQL(idSelect, sql, arrayParams);
  //result contiene {data, msg, statusCode}
  //data contiene [{}, {}, {}, ....]
  return result;
}

exports.getPedidosListadoId = async (req, res) => {
  const { codigo } = req.body;
  console.log("Codigo del listado de pedidos: ", codigo);
  
  const result = await selectPedidosListadoId(codigo);
  //result contiene {data, msg, statusCode}
  //data contiene [{}, {}, {}, ....]
  return res.status(result.statusCode).send(result);
};

/**
 * Obtenemos el municipio y departamento de un usuario por su correo
 * @param {} correo 
 * @returns 
 */
const getMunicipioDepartamentoUsuario = async (correo) => {
  const sql = 
  `SELECT
    u.ciudad AS municipio,
    u.departamento as departamento
  FROM
    Usuario u
  WHERE
    u.correo = ?;`;

  const idSelect = `SELECT Para obtener el municipio y departamento del usuario <${correo}>`;
  const arrayParams = [correo];
  const result = await getSelectFromSQL(idSelect, sql, arrayParams);
  //result = {statusCode, data}
  return result;
}


/**
 * Funcion para actualizar el precio del carrito
 * se hace update del precio del listado de pedido
 * @param {Number} codigo - Id de ListaPedidos
 */
const updatePrecioCarrito = async (codigo) => {
  try {
    console.log("Id carrito a modificar: ", codigo);
    const sqlUpdate = `
      UPDATE Carrito
      SET precioTotal = ( SELECT SUM(precio) AS total_precio FROM Lista_Pedidos WHERE carrito = ?),  
          estado = false
      WHERE idCarrito = ?;
    `;

    const updateParams = [codigo, codigo];
    const result = await executeSQL(`UPDATE del precio del carrito <${codigo}>`, sqlUpdate, updateParams);
    //result tiene success (true or false), msg y statusCode (200 ok, 500 error)
    return result;
  } catch (error) {
    console.error(error);
    return {
      msg: 'Error al insertar actualizar el precio del listado de pedidos.',
      success: false,
      statusCode: 500
    };
  }
};

/**
 * Funcion para actualizar el estado, municipio, departamento
 * y estado para los listados de pedidos del carrito con codigo
 * @param {Number} codigo - Id de ListaPedidos
 */
const updateListadosCarrito = async (codigo, municipio, departamento, direccion) => {
  try {
    console.log("Id listado de pedidos a modificar: ", codigo);
    const sqlUpdate = `
      UPDATE Lista_Pedidos
      SET departamento = ?,
        municipio = ?,
        direccion = ?,
        estado = ?
      WHERE carrito = ?;
    `;

    const updateParams = [departamento, municipio, direccion, 3, codigo];
    const result = await executeSQL(`UPDATE del estado, municpio y direccion de los listados del carrito <${codigo}>`, sqlUpdate, updateParams);
    //result tiene success (true or false), msg y statusCode (200 ok, 500 error)
    return result;
  } catch (error) {
    console.error(error);
    return {
      msg: 'Error al insertar actualizar el precio del listado de pedidos.',
      success: false,
      statusCode: 500
    };
  }
};

exports.finalizarCarrito = async (req, res) => {
  const {direccion, correo} = req.body;
  console.log("Se finaliza el carrito");
  // Obtener el carrito del usuario o crear uno nuevo si no existe
  const requestCarrito = await getCarritoCreateIfNotExist(correo);
  const idCarrito = requestCarrito.idCarrito;
  
  //actualizar direccion de Lista_Pedidos y estado
  const requestDireccionUsuario = await getMunicipioDepartamentoUsuario(correo);
  let municipio = 0;
  let departamento = 0;
  if(requestDireccionUsuario.statusCode === 200){
    municipio = requestDireccionUsuario.data[0].municipio;
    departamento = requestDireccionUsuario.data[0].departamento;
  }  
  
  const requestUpdateListadoPedidos = await updateListadosCarrito(idCarrito, municipio, departamento, direccion);
  //actualizar el precio de carrito y su estado a 0 o false
  const requestPrecioCarrito = await updatePrecioCarrito(idCarrito);

  if(requestCarrito.statusCode === 200 && requestPrecioCarrito.statusCode === 200 && requestDireccionUsuario.statusCode === 200 && requestUpdateListadoPedidos.statusCode === 200){
    //todo salio bien
    return res.status(200).send({
      stausCode: 200,
      msg: "Se finalizo el carrito y actualizaron los datos"
    });
  }else{
    return res.status(500).send({
      stausCode: 500,
      msg: "Se produjo un error"
    });
  }

}

// Consulta a la BD que retorna la Lista_Pedidos con estado 3 ("Creando Orden") 4 ("Orden Aceptada") o 6 ("Orden en Camino") de un usuario
exports.userOrderState = async(req, res) => {

  const { correo } = req.body;
  try {
      const connection = db()
      let query = req.body.itsState ? `SELECT u.nombre, lp.descripcion, lp.precio, DATE_FORMAT(lp.fecha, '%d-%m-%y') AS fecha, e.nombreEstado, r.nombre AS nomRepartidor, r.apellido, r.celular, lp.idListaPedidos FROM Usuario u
                  JOIN Carrito c ON u.idusuario = c.idusuario
                  JOIN Lista_Pedidos lp ON c.idcarrito = lp.carrito
                  JOIN Estados e ON e.idEstado = lp.estado
                  LEFT JOIN Repartidor r ON r.idrepartidor = lp.repartidor
                  WHERE u.correo = ? and (lp.estado = 3 or lp.estado = 4 or lp.estado = 6)
                  GROUP BY lp.idListaPedidos;` : `SELECT lp.descripcion, lp.precio, DATE_FORMAT(lp.fecha, '%d-%m-%y') AS fecha, e.nombreEstado, lp.idListaPedidos, lp.calificacion, em.nombre, dem.direccion, lp.empresa FROM Usuario u
                  JOIN Carrito c ON u.idusuario = c.idusuario
                  JOIN Lista_Pedidos lp ON c.idcarrito = lp.carrito
                  JOIN Estados e ON e.idEstado = lp.estado
                  JOIN Empresa em ON em.idEmpresa = lp.empresa
                  JOIN DireccionEmpresa dem ON dem.idEmpresa = em.idEmpresa
                  WHERE u.correo = ? and lp.estado = 7
                  GROUP BY lp.idListaPedidos;`;

      connection.query(query, [correo], (error, result) => {
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

// Actualiza la BD de ListaPedidos con la calificacion que el usuario otorga al servicio de su entrega
exports.ratingUpdate = async(req, res) => {

  const { id, rating } = req.body;
  try {

      const query = `UPDATE Lista_Pedidos lp SET lp.calificacion = ${rating} WHERE lp.idListaPedidos = ${id};`;
      const connection = db()

      connection.query(query, (error, result) => {
          //connection.end()
          if (error) {
              console.log(error);
              res.status(500).send({ error: error, message: "Error al cargar la calificacion" })
          } else {
              res.status(200).send({ message: `Calificacion cargada` })
          }
      })

  } catch (error) {
      console.log("Error en ratingUpdate")
      console.log(error)
      res.status(500).send({ error: error, message: "Internal Server Error." })
  }

}