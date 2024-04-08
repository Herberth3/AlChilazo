import React, { useState } from 'react';
import {ButtonWrapper, ButtonGreen, ButtonYellow, ButtonBlueSmall} from './Buttons'
import FormText from 'react-bootstrap/esm/FormText';
function UploadFile({ setSelectedFile, label, simpleLabel, type, required}) {

    const [mensaje, setMensaje] = useState("");
    const [validation, setValidation] = useState(false)

    const isValidFileType = (file) => {
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
        return allowedTypes.includes(file.type);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        
        // Verificar si el archivo es de uno de los tipos permitidos
        if (file && isValidFileType(file)) {
            setSelectedFile(file);
            setValidation(false);
        } else {
            event.target.value = null;
            setMensaje(`Por favor, seleccione un archivo válido (${type}).`);
            setValidation(true);
        }
    };

    return (
        <div className="container">
            <div className="mb-3">
                <label htmlFor="fileUpload" className="form-label">
                {label}
                </label>
                <input
                    type= "file"
                    accept={type}
                    id={simpleLabel}
                    className="form-control"
                    required={required}
                    onChange={handleFileChange}
                />
            </div>
            {validation && (
                <FormText id="fileTypeInvalid"muted>                                        
                    <div style={{color:'red'}}>
                        {mensaje}
                    </div>
                </FormText>
            )}
        </div>
    );
}

export default UploadFile;
