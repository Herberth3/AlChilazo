import React, { useState } from "react";
import { NavLink } from 'react-router-dom';
import '../styles/LoginUsuario.css';
import logo from '../assets/image/LogoRideza.png';
import HttpClientService from "../services/HttpClientService";
import { useHistory } from "react-router-dom";

const LoginUsuario = () => {
    /** 
     * useState: Recibe como parametro el valor con el que se inicializa la variable
     * Retorna un arreglo con dos variables (actualizar el componente, funcion SET para actualizar el estado)
    */
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const history = useHistory();

    // Evento que se ejecuta al momento de presionar el boton Iniciar Sesión en el form
    const eventSubmit = (event) => {
        event.preventDefault();

        const httpClientService = new HttpClientService();
        httpClientService.post('usuario/login', { correo: correo, password: password }).then(res => {
            alert(res.message)
            if (res.access) {
                history.push('/menuUsuario');
                localStorage.setItem('correo', res.correo);
                localStorage.setItem('nombre', res.nombre);
                localStorage.setItem('token', res.token);
            } else {
                setPassword("");
            }
        })
    }

    /**
     * return de la funcion LoginUsuario
     * Contiene la estructura HTML del contenedor
     */
    return (
        <div className='principal'>
            <div className='conteiner_login'>

                <div >
                    <img src={logo} alt='logo' className="logo" />
                </div>
                <div className='titulo'>
                    <h3>BIENVENIDO Alchilazo</h3>
                </div>
                <div className='formulario'>

                    <form onSubmit={eventSubmit}>
                        <div className="form-text">
                            <input type="text" required value={correo} onChange={(e) => setCorreo(e.target.value)} ></input>
                            <label className="lbl-nombre">
                                <span className="text-nomb">USUARIO</span>
                            </label>
                        </div>
                        <div className="form-contrasena">
                            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} ></input>
                            <label className="lbl-contrasena">
                                <span className="text-contrasena">CONTRASEÑA</span>
                            </label>
                        </div>
                        <button type="submit" className="form-boton">Iniciar Sesión</button>
                    </form>

                    <div className="form-boton2">
                        <NavLink to="/registroUsuario" >¿No tienes cuenta para nuestros servicios?</NavLink>
                        <hr />
                        <NavLink to="/formdv" >¿Quieres formar parte de nuestro equipo?</NavLink>
                        <hr />
                        <NavLink to="/empresa/registro" >¿Deseas que tu empresa forme parte de nuestra familia?</NavLink>

                    </div>
                </div>

            </div>
        </div>
    )
}

export default LoginUsuario;