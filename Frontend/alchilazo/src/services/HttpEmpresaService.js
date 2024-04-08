import axios from 'axios';
const ruta = {
    ip: "http://137.184.41.188",
    puerto: '4000'
}

export const HttpEmpresaService = {};

HttpEmpresaService.validateAuthentication = async(token, rol) => {
    // Configura el encabezado de autorización en cada solicitud
    if(token == undefined || token == null){
        return null;
    }else{
        const api = axios.create({
            baseURL: ruta.ip+":"+ruta.puerto+"/api",
        });
        api.interceptors.request.use(
            (config) => {
                config.headers.Authorization = `Bearer ${token}`;
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
        try{
            const body = {rol:rol}
            const response = await api.post('/auth', body);
            return response.data;
        }catch(error){
            console.log(error);
            return null;
        }    
    }
  //  let request = await fetch(ruta.ip+":"+ruta.puerto+"/api/modifyProduct", config);
}

HttpEmpresaService.modifyProduct = async(idProducto, nombreProducto, categoria,
                                        precio, descripcion, foto, oferta, productos, combo) => {
    try{
        const body = {
            idProducto: idProducto,
            nombreProducto: nombreProducto,
            categoria: categoria,
            precio: precio,
            descripcion: descripcion,
            foto: foto,
            oferta: oferta,
            productos: productos,
            combo: combo
        }
        let config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET',
                'Access-Control-Request-Method': '*',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
            },
            mode: 'cors',
            body: JSON.stringify(body)
        }
        let request = await fetch(ruta.ip+":"+ruta.puerto+"/api/modifyProduct", config);
        let response = await request.json();    
        if(response.error){
            console.error(response.error)
        }
        return response;
    }catch(error){
        console.log(error);
    }
                                        
}

/**
 * Retorna la url del objeto subido al S3
 * @param {*} file 
 * @param {*} nameFoto 
 * @returns 
 */
HttpEmpresaService.uploadFile = async(file, nameFoto) => {
    try{
        const formData = new FormData();
        formData.append('imagen', file, nameFoto);
        
        let config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET',
                'Access-Control-Request-Method': '*',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
            },
            mode: 'cors',
            body: formData
        }
        let request = await fetch(ruta.ip+":"+ruta.puerto+"/api/uploadFile", config);
        let response = await request.json();    
        if(response.error){
            console.error(response.error)
        }
        return response.data;
    }catch(err){
        console.log(err)
    }
}

//Regresa Product
HttpEmpresaService.getProduct = async(id, combo) =>{
    try{
        const body = {
            id: id,
            combo: combo
        }
        let config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET',
                'Access-Control-Request-Method': '*',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
            },
            mode: 'cors',
            body: JSON.stringify(body)
        }
        let request = await fetch(ruta.ip+":"+ruta.puerto+"/api/getProduct", config);
        let response = await request.json();    
        if(response.error){
            console.error(response.error)
        }
        return response;
    }catch(error){
        console.log(error);
    }
}

HttpEmpresaService.obtenerProductosCombo = async(idProducto) => {
    try{
        const body = {
            idCombo: idProducto,
        }
        let config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET',
                'Access-Control-Request-Method': '*',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
            },
            mode: 'cors',
            body: JSON.stringify(body)
        }
        let request = await fetch(ruta.ip+":"+ruta.puerto+"/api/getProductosCombo", config);
        let response = await request.json();    
        if(response.error){
            console.error(response.error)
        }
        return response;
    }catch(error){
        console.log(error)
    }
}

HttpEmpresaService.insertExistencia = async(existencias, limitado, idProducto, idDireccion, creado) => {
    try{
        const body = {
            existencias: existencias,
            limitado: limitado,
            idProducto: idProducto,
            idDireccion: idDireccion,
            creado: creado
        }
        let config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET',
                'Access-Control-Request-Method': '*',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
            },
            mode: 'cors',
            body: JSON.stringify(body)
        }
        let request = await fetch(ruta.ip+":"+ruta.puerto+"/api/insertExistencia", config);
        let response = await request.json();    
        if(response.error){
            console.error(response.error)
        }
        return response;
    }catch(error){
        console.log(error);
    }
}

HttpEmpresaService.obtenerExistencias = async(idDireccion, idProducto) => {
    try{
        const body = {
            idDireccion: idDireccion,
            idProducto: idProducto
        }
        let config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET',
                'Access-Control-Request-Method': '*',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
            },
            mode: 'cors',
            body: JSON.stringify(body)
        }
        let request = await fetch(ruta.ip+":"+ruta.puerto+"/api/obtenerExistencias", config);
        let response = await request.json();    
        if(response.error){
            console.error(response.error)
        }
        return response.existencia;
    }catch(error){
        console.log(error);
    }
}

HttpEmpresaService.obtenerDirecciones = async(correo) => {
    try{
        const body = {
            correo: correo
        }
        let config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET',
                'Access-Control-Request-Method': '*',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
            },
            mode: 'cors',
            body: JSON.stringify(body)
        }
        let request = await fetch(ruta.ip+":"+ruta.puerto+"/api/obtenerDirecciones", config);
        let response = await request.json();    
        if(response.error){
            console.error(response.error)
        }
        return response.direcciones;
    }catch(error){
        console.log(error);
    }
}

HttpEmpresaService.deleteProduct = async(id, combo) => {
    try{
        const body = {
            id: id,
            combo: combo
        }
        let config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET',
                'Access-Control-Request-Method': '*',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
            },
            mode: 'cors',
            body: JSON.stringify(body)
        }
        let request = await fetch(ruta.ip+":"+ruta.puerto+"/api/deleteProduct", config);
        let response = await request.json();    
        if(response.error){
            console.error(response.error)
        }
        return response;
    }catch(error){
        console.log(error);
    }
}

HttpEmpresaService.insertCombo = async(idCategoria, nombre, precio, productos, oferta, descripcion, foto, nameFoto) => {
    try{
        const formData = new FormData();
        formData.append('idCategoria', idCategoria);
        formData.append('nombre', nombre);
        formData.append('precio', precio);
        formData.append('productos', productos);
        formData.append('oferta', oferta);
        formData.append('descripcion', descripcion);
        formData.append('imagen', foto, nameFoto);
        
        let config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET',
                'Access-Control-Request-Method': '*',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
            },
            mode: 'cors',
            body: formData
        }
        let request = await fetch(ruta.ip+":"+ruta.puerto+"/api/insertCombo", config);
        let response = await request.json();    
        if(response.error){
            console.error(response.error)
        }
        return response;
    }catch(err){
        console.log(err)
    }
}

HttpEmpresaService.getEmpresa = async(correo) => {
    try{
        let config = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET',
                'Access-Control-Request-Method': '*',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
            },
            mode: 'cors'
        }
        let request = await fetch(ruta.ip+":"+ruta.puerto+`/api/getEmpresa?correo=${correo}`, config);
        let response = await request.json();    
        if(response.error){
            console.error(response.error)
        }
        return response.data;
    }catch(err){
        console.log(err)
        return null;
    }
}



HttpEmpresaService.insertProduct = async(idCategoria, nombre, precio, empresa, oferta, descripcion, foto, nameFoto) => {
    try{
        const formData = new FormData();
        formData.append('idCategoria', idCategoria);
        formData.append('nombre', nombre);
        formData.append('precio', precio);
        formData.append('empresa', empresa);
        formData.append('oferta', oferta);
        formData.append('descripcion', descripcion);
        formData.append('imagen', foto, nameFoto);
        
        let config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET',
                'Access-Control-Request-Method': '*',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
            },
            mode: 'cors',
            body: formData
        }
        let request = await fetch(ruta.ip+":"+ruta.puerto+"/api/insertProduct", config);
        let response = await request.json();    
        if(response.error){
            console.error(response.error)
        }
        return response;
    }catch(err){
        console.log(err)
    }
}



HttpEmpresaService.getProductos = async(idEmpresa) => {
    try{
        let body = {
            empresa: idEmpresa
        }
        let config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET',
                'Access-Control-Request-Method': '*',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
            },
            mode: 'cors',
            body: JSON.stringify(body)
        }
        let request = await fetch(ruta.ip+":"+ruta.puerto+"/api/getProductosEmpresa", config);
        let response = await request.json();    
        if(response.error){
            console.error(response.error)
            return [];
        }
        return response.productos;
    }catch(err){
        console.log(err)
    }
}

HttpEmpresaService.getCombos = async(idEmpresa) => {
    try{
        let body = {
            empresa: idEmpresa
        }
        let config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET',
                'Access-Control-Request-Method': '*',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
            },
            mode: 'cors',
            body: JSON.stringify(body)
        }
        let request = await fetch(ruta.ip+":"+ruta.puerto+"/api/getCombosEmpresa", config);
        let response = await request.json();    
        if(response.error){
            console.error(response.error)
            return [];
        }
        return response.combos;
    }catch(err){
        console.log(err)
    }
}
HttpEmpresaService.addCategoria = async(categoria,image, nameImage) => {
    try{
        const formData = new FormData();
        formData.append('categoria', categoria);
        formData.append('categoriaFile', image, nameImage);
        formData.append('name', nameImage);
        let config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET',
                'Access-Control-Request-Method': '*',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
            },
            mode: 'cors',
            body: formData
        }
        let request = await fetch(ruta.ip+":"+ruta.puerto+"/api/addCategoria", config);
        let response = await request.json();    
        if(response.error){
            console.error(response.error)
        }
        return response;
    }catch(err){
        console.log(err)
    }
}

HttpEmpresaService.getCategorias = async() => {
    try{
        let config = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET',
                'Access-Control-Request-Method': '*',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
            },
            mode: 'cors'
        }
        let request = await fetch(ruta.ip+":"+ruta.puerto+"/api/getCategorias", config);
        let response = await request.json();    
        if(response.error){
            console.error(response.error)
            return [];
        }
        return response.categorias;
    }catch(err){
        console.log(err)
    }
}

// Servicio para pedir la lista de pedidos de una empresa en especifico
HttpEmpresaService.getListaPedidos = async(idEmpresa, idDepartamento, idMunicipio) => {
    try{
        let body = {
            empresa: idEmpresa,
            departamento: idDepartamento,
            municipio: idMunicipio
        }
        let config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET',
                'Access-Control-Request-Method': '*',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
            },
            mode: 'cors',
            body: JSON.stringify(body)
        }
        let request = await fetch(ruta.ip+":"+ruta.puerto+"/api/empresa/deliveryRequest", config);
        let response = await request.json();    
        if(response.error){
            console.error(response.error)
            return [];
        }
        return response.orders;
    }catch(err){
        console.log(err)
    }
}