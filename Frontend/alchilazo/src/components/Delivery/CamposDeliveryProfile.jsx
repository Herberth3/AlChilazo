
/*
Los campos requeridos para mostrar en un repartidor son:
    * nombre
    * apellido
    * correo
    * celular
    * nit
    * departamento
    * ciudad
    * vehiculo
    * Licencia
    * numLicencia    
    * cv
    

De los siguientes datos, los siguientes son opcionales u obligatorios
    * controlIdData: "VARIABLE",
        * formLabelData: "VARIABLE",
        * placeholderData: "Ingrese su VARIABLE",		
    * typeData : "TIPO", -> input, textarea, plaintext, select
    * inputType : "TIPO", --> text, email, file, password, etc
    * rowsData : CANTIDAD, --> Solo para textarea, recibe numero
    * selecteValue : {}, --> Solo para select, recibe un array[{}, {}, {}, ....]
    * required : false,   opcional --> boolean
    * readOnly : false,   opcional --> boolean
    * disabled : false,   opcional --> boolean
    * sizeTextData : ""   opcional --> lg, sm
*/
export const campos = [
    {
        controlIdData: "Nombre",
        placeholderData: "Juan",		
        typeData : "input", 
        inputType : "text",
        rowsData : 1,
        selecteValue : {}, 
        required : true
    },
    {
        controlIdData: "Apellido",
        placeholderData: "Perez",
        typeData : "input", 
        inputType : "text",
        rowsData : 1,
        selecteValue : {}, 
        required : true
    },
    {
        controlIdData: "Correo",
        placeholderData: "email@gmail.com",
        typeData : "input", 
        inputType : "email",
        rowsData : 1,
        selecteValue : {}, 
        required : true
    },
    {
        controlIdData: "Celular",
        placeholderData: "57586060",
        typeData : "input", 
        inputType : "tel",
        rowsData : 1,
        selecteValue : {}, 
        required : true
    },
    {
        controlIdData: "NIT",
        placeholderData: "1234567890123",
        typeData : "input", 
        inputType : "text",
        rowsData : 1,
        selecteValue : {}, 
        required : true
    },
    {
        controlIdData: "Departamento",
        placeholderData: "Guatemala",
        typeData : "select", 
        inputType : "text",
        rowsData : 1,
        selecteValue : {}, 
        required : true
    },
    {
        controlIdData: "Ciudad",
        placeholderData: "Guatemala",
        typeData : "select", 
        inputType : "text",
        rowsData : 1,
        selecteValue : {}, 
        required : true
    },
    {
        controlIdData: "Vehiculo",
        placeholderData: "Numero de vehiculos propios",
        typeData : "select", 
        inputType : "text",
        rowsData : 1,
        selecteValue : {}, 
        required : true
    },
    {
        controlIdData: "Licencia",
        placeholderData: "Tipo de Licencia",
        typeData : "select", 
        inputType : "password",
        rowsData : 1,
        selecteValue : {}, 
        required : true
    },
    {
        controlIdData: "Num.Licencia",
        placeholderData: "Numero de Licencia",
        typeData : "input", 
        inputType : "text",
        rowsData : 1,
        selecteValue : {}, 
        required : true
    },    
    {
        controlIdData: "Password",
        placeholderData: "*******",
        typeData : "input", 
        inputType : "password",
        rowsData : 1,
        selecteValue : {}, 
        required : true
    }
];