import { ButtonWrapper, ButtonGreen } from "../../components/Empresa/Buttons";
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import "../../styles/Empresa.css"
import NavBar from "../../components/LandingPage/NavBar";
import { useState } from "react";
import sqlCommunication from "../../components/Empresa/sqlCommunication";
import { useHistory } from "react-router-dom";

const LoginEmpresa = () => {
    const history = useHistory();
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        sqlCommunication.loginEmpresa(correo, password)
            .then((res) => {
                alert(res.message)
                if(res.access){
                    history.push('/empresa/menu');
                    localStorage.setItem('correo', res.correo);
                    localStorage.setItem('nombre', res.nombre);      
                    localStorage.setItem('token', res.token);
                }else{
                    setPassword("");
                }
            })
    }

    return(
        <>
            <NavBar/>
            <div className="background-empresa">
                <div className = "small-cardEmpresa">
                    <h1 className='titulo-empresa-white'>Iniciar Sesión</h1>
                    <Form className='form-modal-empresa' onSubmit={handleSubmit}>
                        <div className='form-modal-empresa item-center'>
                            <Form.Group className="mb-5" controlId="formBasicEmail">
                                <FloatingLabel  label="Empresa">
                                    <Form.Control type="text" placeholder="alguien@gmail.com" 
                                    onChange={(e) => setCorreo(e.target.value)}
                                    required
                                />
                                </FloatingLabel>
                            </Form.Group>
                        </div>
                    
                        <div className='form-modal-empresa item-center'>
                            <Form.Group className="mt-2" controlId="formBasicPassword">
                                <FloatingLabel  label="Contraseña">
                                    <Form.Control type="password" placeholder="Password" 
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                    required
                                    />
                                </FloatingLabel>
                            </Form.Group>
                        </div>
                        
                        
                        <div className='form-modal-empresa item'>
                            <ButtonWrapper>
                                <ButtonGreen type='submit'>Entrar</ButtonGreen>
                            </ButtonWrapper>
                        </div>    
                        <div className='form-modal-empresa item-center'>
                            <a className="black" 
                            href='/empresa/registro'>¿No tienes Cuenta aun? ¡Registrate!</a>
                        </div>
                    </Form>
                </div>
            </div>
        </>
    );
}

export default LoginEmpresa;