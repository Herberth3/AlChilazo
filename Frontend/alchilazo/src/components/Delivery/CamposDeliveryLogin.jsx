/*
Los campos requeridos para mostrar en un repartidor son:
    * correo
    * password
    

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
        controlIdData: "Correo",
        placeholderData: "email@gmail.com",
        typeData : "input", 
        inputType : "email",
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