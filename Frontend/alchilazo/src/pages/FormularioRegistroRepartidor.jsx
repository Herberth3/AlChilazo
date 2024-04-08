import ControlFormGroupElement from "../components/Delivery/ControlFormGroupElement.jsx";
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Stack from 'react-bootstrap/Stack';
import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import { campos } from "../components/Delivery/CamposFormularioRegistroRepartidor.jsx";
import '../styles/style-delivery-reg.css';
import FormularioGenerico from "../components/Delivery/FormularioGenerico.jsx";
import NavbarRepartidor from "../components/Delivery/NavbarRepartidor.jsx";
import { useHistory } from "react-router-dom";
import NavBar from '../components/LandingPage/NavBar.jsx';
import { HttpEmpresaService } from "../services/HttpEmpresaService.js";

const FormularioRegistroRepartidor = () => {
	const history = useHistory();
	/**Esto va para ir a repartidor */
	const initialDatos = {
		nombre: "",
		apellido: "",
		correo: "",
		celular: "",
		departamento: "1",
		ciudad: "1",
		nit: "",
		cv: null,
		password: "",
		password2: "",
		licencia: "A",
		numlicencia: "",
		vehiculo: "0",
		estado: false,
		departamentosLista: [],
		ciudadesLista: []
	  };
	  const [datos, setDatos] = useState(initialDatos);	  
	  const resetDatos = () => {
		setDatos(initialDatos);
	  };
	  const setDepartamentosLista = (listado) => {
		setDatos((prevDatos) => ({
			...prevDatos,
			departamentosLista: listado,
		  }));
	  }	
	  const setCiudadesLista = (listado) => {
		setDatos((prevDatos) => ({
			...prevDatos,
			ciudadesLista: listado,
		  }));
	  }

	/**
	 * useEffect: Recibe como parametro una funcion () => {}
	 * Dentro afecta el ciclo de la app. Por ejemplo, cuando la aplicacion se acaba de correr,
	 * cuando un valor cambia o cuando la app se desmonte
	 */
	// Extrae de la BD todos los departamentos almacenados para mostrarlos en el combo box
	useEffect(() => {
		fetch("http://137.184.41.188:4000/api/getDepartamentos")
			.then((response) => response.json())
			.then((data) => setDepartamentosLista(data.data))
			.catch((error) => console.error(error));
	}, []);
    // Extrae de la BD los municipios relacionados con el departamento enviado
    useEffect(() => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            parameters: JSON.stringify({ departamento: datos.departamento })
        };
        fetch("http://137.184.41.188:4000/api/getMunicipios?departamento="+datos.departamento)
            .then((response) => response.json())
            .then((data) => {
                setCiudadesLista(data.data);
                console.log(data.data);
            })
            .catch((error) => console.error(error));
    }, [datos.departamento]);

	const handleSubmit = (event) => {
		console.log("Valores actuales de datos:", datos);
		if(datos.password === datos.password2){
			event.preventDefault();
			const nombreArchivo = datos.nombre+"_cv";
			HttpEmpresaService.uploadFile(datos.cv, nombreArchivo)
				.then((url) => {
					if(url == null || url == undefined){
						alert("Error al subir el archivo");
					}else{
						const newData = {
							nombre: datos.nombre,
							apellido: datos.apellido,
							correo: datos.correo,
							celular: datos.celular,
							departamento: datos.departamento,
							ciudad: datos.ciudad,
							nit: datos.nit,
							cv: url,
							password: datos.password,
							password2: datos.password2,
							licencia: datos.licencia,
							numlicencia: datos.numlicencia,
							vehiculo: datos.vehiculo,
							estado: datos.estado,
							departamentosLista: datos.departamentosLista,
							ciudadesLista: datos.ciudadesLista
						};
						fetch('http://137.184.41.188:4000/api/registroRepartidor', {
							method: 'POST',
							headers: {
							'Content-Type': 'application/json'
							},
							body: JSON.stringify(newData)
						})
						.then(response => {
							if (response.status === 400) {
								alert('El usuario ya existe');
							} 
							else if(response.status === 200){
								alert('Su registro se ha realizado con exito!!!')
								// Restablecer los valores iniciales del estado
								//--------------> retornar a la landing page
								history.push('/');
								resetDatos();
							}
						})
						.catch(error => console.log(error));	
					}
			})
		}else{
			alert("Las contraseñas no coinciden");
		}		
	};

	const datosFormulario = {
		handleSubmit: handleSubmit, 
		campos: campos, 
		datos: datos, 
		setDatos: setDatos, 
		groupSizes: [2, 3, 2, 3, 1, 1, 1], 
		resetDatos: resetDatos, 
		classNameDiv: "bg-dark cover-all",
		classNameForm: "modal-content container centered-form-register-delivery "
	};
	
	return (
		<>
			<NavBar />
			<FormularioGenerico {...datosFormulario}/>
		</>
	);
  };
  
export default FormularioRegistroRepartidor;
