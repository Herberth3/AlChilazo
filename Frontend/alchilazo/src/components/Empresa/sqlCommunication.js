const ruta = {
    ip: "http://137.184.41.188",
    puerto: '4000'
}

const sqlCommunication = {};

sqlCommunication.loginAdmin = async(admin, password) => {
    try{
        let body = {
            usuario: admin,
            password: password
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
        let request = await fetch(ruta.ip+":"+ruta.puerto+`/api/loginAdmin`, config);
        let response = await request.json();  
        return response;
    }catch(error){
        console.log(error);
    }
}

sqlCommunication.getDepartamentos = async() => {
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
        let request = await fetch(ruta.ip+":"+ruta.puerto+"/api/getDepartamentos", config);
        let response = await request.json();    
        if(response.data == undefined || response.data == null){
            console.error("Departamentos vacios")
        }
        return response;
    }catch(error){
        console.log(error);
    }    
}

sqlCommunication.getMunicipios = async(departamento) => {
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
        let request = await fetch(ruta.ip+":"+ruta.puerto+`/api/getMunicipios?departamento=`+departamento, config);
        let response = await request.json();  
        if(response.data == undefined || response.data == null){
            console.error("Municipios vacios")
        }  
        return response;
    }catch(error){
        console.log(error);
    }
}

sqlCommunication.loginEmpresa = async(correo, password) => {
    try{
        let body = {
            correo: correo,
            password: password
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
        let request = await fetch(ruta.ip+":"+ruta.puerto+`/api/loginEmpresa`, config);
        let response = await request.json();  
        return response;
    }catch(error){
        console.log(error);
    }
}

sqlCommunication.registrarEmpresa = async(nombreEmpresa, correo, password,
                                        departamento, municipio, autenticidad,
                                        registro, permiso, logo, descripcion, direccion) => {
    try{
        
        const formData = new FormData();
        formData.append('nombreEmpresa', nombreEmpresa);
        formData.append('correo', correo);
        formData.append('password', password);
        formData.append('departamento', departamento);
        formData.append('municipio', municipio);
        if(autenticidad != null){
            formData.append('autenticidad', autenticidad, 'autenticidad');
        }
        if(registro != null){
            formData.append('registro', registro, 'registro');
        }
        if(permiso != null){
            formData.append('permiso', permiso, 'permiso');   
        }
        formData.append('logo', logo, 'logo');
        formData.append('descripcion', descripcion);
        formData.append('direccion', direccion);
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
        let request = await fetch(ruta.ip+":"+ruta.puerto+'/api/registrarEmpresa', config);
        let response = await request.json();  
        if(response.error){
            alert("Error registrando empresa")
        }  
        return response;
    }catch(err){
        console.log(err);
    }
}

export default sqlCommunication;