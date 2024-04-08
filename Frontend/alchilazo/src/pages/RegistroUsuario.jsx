import React, { useState, useEffect } from "react";
import { NavLink } from 'react-router-dom';
import '../styles/RegistroUsuario.css';
import logo from '../assets/image/logoUsu.png';
import HttpClientService from "../services/HttpClientService";
import { useHistory } from "react-router-dom";

const RegistroUsuario = () => {
    /** 
     * useState: Recibe como parametro el valor con el que se inicializa la variable
     * Retorna un arreglo con dos variables (actualizar el componente, funcion SET para actualizar el estado)
    */
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [correo, setCorreo] = useState("");
    const [tarjeta, setTarjeta] = useState("");
    const [celular, setCelular] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    // Array para almacenar los departamentos, el departamento seleccinado se guarda en selectedDepartamentoGlobal
    const [departamentos, setDepartamentos] = useState([]);
    const [selectedDepartamento, setSelectedDepartamento] = useState("");
    const [selectedDepartamentoGlobal, setSelectedDepartamentoGlobal] = useState(0);
    /** Guarda en el Combo-Box los departamentos y despues guarda este valor en selectedCiudadGlobal **/
    const [ciudades, setCiudades] = useState([]);
    const [selectedCiudad, setSelectedCiudad] = useState("");
    const [selectedCiudadGlobal, setSelectedCiudadGlobal] = useState(0);
    const history = useHistory();

    // Funcion que almacena el valor del departamento seleccionado
    function deptoSelectChange(event) {
        const selectedDepartamento = event.target.value;
        setSelectedDepartamento(selectedDepartamento);
        setSelectedDepartamentoGlobal(selectedDepartamento);
    }
    // Funcion que almacena el valor del municipio seleccionado
    function townSelectChange(event) {
        const selectedCiudad = event.target.value;
        setSelectedCiudad(selectedCiudad);
        setSelectedCiudadGlobal(selectedCiudad);
    }

    /**
     * useEffect: Recibe como parametro una funcion () => {}
     * Dentro afecta el ciclo de la app. Por ejemplo, cuando la aplicacion se acaba de correr,
     * cuando un valor cambia o cuando la app se desmonte
     */
    // Extrae de la BD todos los departamentos almacenados para mostrarlos en el combo box
    useEffect(() => {
        const httpClientService = new HttpClientService()
        httpClientService.get('departamento').then(res => {
            if (!res.error) {
                setDepartamentos(res.depa)
            } else { console.log('ERROR: ', res.error) }
        })

        return () => { }
    }, []);
    // Extrae de la BD los municipios relacionados con el departamento enviado
    useEffect(() => {
        const httpClientService = new HttpClientService()
        httpClientService.post('municipio', { departamento: selectedDepartamentoGlobal }).then(res => {
            if (!res.error) {
                setCiudades(res.ciu)
            } else { console.log('ERROR: ', res.error) }
        });

    }, [selectedDepartamentoGlobal]);

    // Evento que se ejecuta al momento de presionar el boton REGISTRARME en el form
    const eventSubmit = (event) => {

        event.preventDefault();
        if (password === passwordConfirm) {

            let departamento = parseInt(selectedDepartamentoGlobal);
            let municipio = parseInt(selectedCiudadGlobal);

            const httpClientService = new HttpClientService()
            httpClientService.post('usuario/registro', { nombre: nombre, apellido: apellido, correo: correo, tarjeta: tarjeta, celular: celular, departamento: departamento, municipio: municipio, password: password }).then(res => {
                alert(res.message)
                if (res.data) {
                    setNombre('');
                    setApellido('');
                    setCorreo('');
                    setTarjeta('');
                    setCelular('');
                    setPassword('');
                    setPasswordConfirm('');
                    history.push('/loginUsuario');
                } else { console.log('ERROR: ', res.error) }
            });
        } else {
            alert("Las contraseñas no coinciden!");
        }


    }

    /**
     * return de la funcion RegistroUsuario
     * Contiene la estructura HTML del contenedor
     */
    return (
        <div className="principal">
            <div className="conteiner-registro-usuario">

                <div>
                    <img src={logo} alt='logo' className='logo-registro-usuario' />
                </div>
                <div className="titulo-registro-usuario">
                    <h3>INGRESA TUS DATOS Y USA NUESTROS SERVICIOS</h3>
                </div>
                <div className="formulario-registro-usuario">

                    <form onSubmit={eventSubmit}>
                        <div className="form-text-registro-usuario">
                            <input type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)} ></input>
                            <label className="lbl-registro-usuario">
                                <span className="text-usuario">INGRESE SU NOMBRE DE PILA</span>
                            </label>
                        </div>
                        <br />
                        <div className="form-text-apellido">
                            <input type="text" required value={apellido} onChange={(e) => setApellido(e.target.value)} ></input>
                            <label className="lbl-apellido">
                                <span className="text-apellido">INGRESE SU APELLIDO</span>
                            </label>
                        </div>
                        <br />
                        <div className="form-text-correo-usuario">
                            <input type="email" required value={correo} onChange={(e) => setCorreo(e.target.value)} ></input>
                            <label className="lbl-correo-usuario">
                                <span className="text-correo-usuario">INGRESE EL CORREO ELECTRONICO</span>
                            </label>
                        </div>
                        <br />
                        <div className='form-text-tarjeta-usuario'>
                            <input type="number" required value={tarjeta} onChange={(e) => setTarjeta(e.target.value)}></input>
                            <label className="lbl-tarjeta-usuario">
                                <span className="text-tarjeta-usuario">INGRESE SU NUMERO DE TARJETA</span>
                            </label>
                        </div>
                        <br />
                        <div className="form-text-contrasena-usuario">
                            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}></input>
                            <label className="lbl-contrasena-usuario">
                                <span className="text-contrasena-usuario">INGRESE SU CONTRASEÑA</span>
                            </label>
                        </div>
                        <br />
                        <div className="form-text-contrasena-usuarioConfirm">
                            <input type="password" required value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)}></input>
                            <label className="lbl-contrasena-usuarioConfirm">
                                <span className="text-contrasena-usuarioConfirm">CONFIRME SU CONTRASEÑA</span>
                            </label>
                        </div>
                        <br />
                        <div className="form-text-telefono-usuario">
                            <input type="number" required value={celular} onChange={(e) => setCelular(e.target.value)}></input>
                            <label className="lbl-telefono-usuario">
                                <span className="text-telefono-usuario">INGRESE SU NUMERO DE TELEFONO</span>
                            </label>
                        </div>
                        <br />
                        <div className="form-enlaces-departamento-usuario" >
                            <select id="enlaces" onChange={deptoSelectChange} value={selectedDepartamento} required>
                                <option value="">DEPARTAMENTO</option>
                                {departamentos.map((departamento) => (
                                    <option key={departamento.idDepartamento} value={departamento.idDepartamento}>{departamento.departamento}</option>
                                ))}
                            </select>
                        </div>
                        <br />
                        <div className="form-enlaces-municipio-usuario">
                            <div>
                                <select id="enlaces1" onChange={townSelectChange} value={selectedCiudad} required>
                                    <option value="">MUNICIPIO</option>
                                    {ciudades.map((ciu) => (
                                        <option key={ciu.idMunicipio} value={ciu.idMunicipio}>{ciu.municipio}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <br />
                        <button type="submit" className="form-boton-usuario">REGISTRARME</button>
                    </form>

                </div>
                <NavLink to="/" className="boton-usuario-return" >Ir a Inicio</NavLink>
            </div>
        </div>
    )
}

export default RegistroUsuario;