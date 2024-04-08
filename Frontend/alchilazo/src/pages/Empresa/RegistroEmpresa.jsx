import { ButtonWrapper, ButtonGreen, ButtonRed } from "../../components/Empresa/Buttons";
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import "../../styles/Empresa.css"
import NavBar from "../../components/LandingPage/NavBar";
import UploadFile from "../../components/Empresa/UploadFile";
import React, {useEffect, useState} from 'react';
import sqlCommunication from "../../components/Empresa/sqlCommunication";
import { useHistory } from 'react-router-dom';

const RegistroEmpresa = () => {
    const history = useHistory();
    const [departamentos, setDepartamentos] = useState([]);
    const [municipios, setMunicipios] = useState([]);
    const [passwordValidation, setPasswordValidation] = useState(false)
    const [password, setPassword] = useState("");
    const [nombreEmpresa, setNombreEmpresa] = useState("");
    const [correo, setCorreo] = useState("");
    const [departamento, setDepartamento] = useState(0);
    const [municipio, setMunicipio] = useState(0);
    const [autenticidad, setAutenticidad] = useState(null);
    const [registro, setRegistro] = useState(null);
    const [permiso, setPermiso] = useState(null);
    const [logo, setLogo] = useState(null);
    const [descripcion, setDescripcion] = useState("");
    const [direccion, setDireccion] = useState("");
    const [validation, setValidation] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        if(!validation){
            sqlCommunication.registrarEmpresa(nombreEmpresa, correo, password, departamento,
                municipio, autenticidad, registro, permiso,logo, descripcion, direccion)
                .then((response) => {
                    alert(response.message);
                    if(response.data){
                        history.push('/empresa/login');
                    }
                });
        }else{
            alert("Las contraseñas no coinciden o no cumplen los estandares de seguridad");
        }
    }

    const checkPassword = (event) => {
        let newPassword = event.target.value;
        if(password != newPassword){
            setPasswordValidation(true);
        }else{
            setPasswordValidation(false);
        }
    }

    const handlePassword = (event) => {
        const string = event.target.value;
        if(string.length <8){
            setValidation(true);
            setMessage("La contraseña debe tener al menos 8 caracteres");
        }else{
            setValidation(false);
            setPassword(event.target.value);
        }
    }

    const handleMunicipios = (departamento) => {
        sqlCommunication.getMunicipios(departamento)
            .then((response) => {
                setMunicipios(response.data);
                setDepartamento(departamento);
            })
            .catch((error) => {
                console.error(JSON.stringify(error));
            });
    }

    useEffect(() => {
        sqlCommunication.getDepartamentos()
            .then((response) => {
                setDepartamentos(response.data);
            })
            .catch((error) => {
                console.log(JSON.stringify(error));
            })

    }, [])

    const printDepartamentos = departamentos.map((departamento) => {
        let key = departamento.idDepartamento;
        return(
            <>
                <option key={key} value={departamento.idDepartamento}>{departamento.departamento}</option>
            </>
        );
    });

    const printMunicipios = municipios.map((municipio) => {
        let key = (municipio.departamento).toString() + (municipio.idMunicipio).toString();
        return(
            <>
                <option key={key} value={municipio.idMunicipio}>{municipio.municipio}</option>
            </>
        );
    });

    return(
        <>
            <NavBar/>
            <div className="background-registro">
                
                <div className = "cardEmpresa container">
                    <h1 className='titulo-empresa'>Registro Empresa</h1>
                    <Form className='form-modal-empresa' onSubmit={handleSubmit}>
                        <div className='form-modal-empresa item'>
                            <Form.Group className="mb-3" controlId="entidad">
                                <FloatingLabel  label="Nombre Empresa *">
                                    <Form.Control type="text" placeholder="Nombre Empresa"
                                    onChange = {(e) => setNombreEmpresa(e.target.value)}
                                    required
                                />
                                </FloatingLabel>
                            </Form.Group>
                        </div>
                        <div className='form-modal-empresa item'>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <FloatingLabel  label="Correo Electronico *">
                                    <Form.Control type="email" placeholder="alguien@gmail.com" 
                                    onChange = {(e) => setCorreo(e.target.value)}
                                    required
                                />
                                </FloatingLabel>
                            </Form.Group>
                        </div>
                        <div className='form-modal-empresa item deploy'>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <FloatingLabel  label="Contraseña *">
                                    <Form.Control type="password" placeholder="Password" 
                                    onChange = {handlePassword}
                                    aria-describedby="passwordHelpBlock"
                                    required
                                    />
                                    <Form.Text id="passwordHelpBlock" muted>
                                        Tu contraseña debe contener 8 caracteres como minimo y sin espacios en blanco
                                    </Form.Text>
                                    {validation && (
                                    <Form.Text id="passwordHelpBlock"muted>                                        
                                        <div style={{color:'red'}}>
                                            {message}
                                        </div>
                                    </Form.Text>
                                )}
                                </FloatingLabel>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <FloatingLabel  label="Repita Contraseña">
                                    <Form.Control type="password" placeholder="Password" 
                                     onChange = {checkPassword}
                                     disabled = {validation}
                                    required
                                    />
                                </FloatingLabel>
                                {passwordValidation && (
                                    <Form.Text id="passwordHelpBlock"muted>                                        
                                        <div style={{color:'red'}}>
                                            Las contraseñas no coinciden
                                        </div>
                                    </Form.Text>
                                )}
                            </Form.Group>
                        </div>
                        <div className='form-modal-empresa item deploy'>    
                            <Form.Group className="mb-3" >
                                <Form.Label htmlFor="inputDepartamento">Departamento</Form.Label>                            
                                <Form.Select
                                    onChange = {(e) => handleMunicipios(e.target.value)}
                                    required
                                >
                                    <option value="">Seleccione Departamento</option>
                                    {printDepartamentos}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3" >
                                <Form.Label htmlFor="inputMunicipio">Municipio</Form.Label>                            
                                <Form.Select
                                    onChange = {(e) => setMunicipio(e.target.value)}
                                    required
                                >
                                    <option value="">Seleccione Municipio</option>
                                    {printMunicipios}
                                </Form.Select>
                            </Form.Group>
                            
                        </div>
                        <div className="form-modal-empresa item">
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="nameEncuesta">Descripcion de la Empresa</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows = {4}
                                        value={descripcion}
                                        onChange={(e) => setDescripcion(e.target.value)}
                                    />  
                            </Form.Group>
                        </div>
                        <div className='form-modal-empresa item'>
                        <Form.Group className="mb-3">
                                <Form.Label htmlFor="direccion">Direccion de la Empresa</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows = {2}
                                        value={direccion}
                                        onChange={(e) => setDireccion(e.target.value)}
                                        required
                                    />  
                            </Form.Group>
                        </div>
                        <div className='form-modal-empresa item deploy'>
                            <UploadFile 
                                setSelectedFile={setAutenticidad}
                                label = {"Certificado de Autenticidad"}
                                simpleLabel = {"autenticidad"}
                                type = {".png,.jpg,.jpeg,.pdf"}
                                required = {false}
                            />
                            <UploadFile 
                                setSelectedFile={setRegistro}
                                label = {"Registro de la Empresa"}
                                simpleLabel = {"registro"}
                                type = {".png,.jpg,.jpeg,.pdf"}
                                required = {false}
                            />
                            <UploadFile 
                                setSelectedFile={setPermiso}
                                label = {"Permiso Sanitario"}
                                simpleLabel = {"permiso"}
                                type = {".png,.jpg,.jpeg,.pdf"}
                                required = {false}
                            />
                            <UploadFile 
                                setSelectedFile={setLogo}
                                label = {"Logo de la Empresa"}
                                simpleLabel = {"Logo"}
                                type = {".png,.jpg,.jpeg"}
                                required = {true}
                            />
                        </div>
                        
                        <div className='form-modal-empresa item'>
                            <ButtonWrapper>
                                <ButtonGreen type='submit'>Registrar</ButtonGreen>
                            </ButtonWrapper>
                        </div>    
                    </Form>
                </div>
            </div>
        </>
    );
}

export default RegistroEmpresa;