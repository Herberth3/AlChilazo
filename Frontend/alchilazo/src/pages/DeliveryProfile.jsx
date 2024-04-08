import NavbarRepartidor from '../components/Delivery/NavbarRepartidor.jsx';
import '../styles/style-delivery-reg.css';
import { campos as camposView } from "../components/Delivery/CamposDeliveryProfile.jsx";
import { campos as camposForm } from '../components/Delivery/CamposFormularioRegistroRepartidor.jsx';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import ControlFormGroupElement from '../components/Delivery/ControlFormGroupElement.jsx';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';
import { ControlViewGroupElement } from '../components/Delivery/ControlFormGroupElement.jsx';
import FormularioGenerico from '../components/Delivery/FormularioGenerico.jsx';
import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";

const DeliveryProfile = () => {
	const history = useHistory();
	const [profileAux, setProfileAux] = useState({});
	const correoAct = localStorage.getItem('correo');
	console.log("El correo recibido en deliveryProfile es: " + correoAct);
	const initialDatos = {
		nombre: "",
		apellido: "",
		correo: "",
		celular: "",
		departamento: "1",
		ciudad: "1",
		nit: "",
		password: "",
		password2: "",
		licencia: "A",
		numlicencia: "",
		vehiculo: "0",
		correoactual: correoAct,
		departamentosLista: [],
		ciudadesLista: [],
		nombreCampo: ""
	  }; 
	const [datos, setDatos] = useState(initialDatos);	  
	const resetDatos = () => {
		setDatos((prevDatos) => ({
		  ...initialDatos,
		  correoactual: prevDatos.correoactual
		}));
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
	const updateNombreCampo = (nombreCampo) => {
		setDatos((prevDatos) => ({
		  ...prevDatos,
		  nombreCampo: nombreCampo,
		}));
	  };

	//Use effect para cargar datos del repartidor
	useEffect(() => {
		const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo: correoAct })
        };
		fetch("http://137.184.41.188:4000/api/delivery/profile", requestOptions)
			.then((response) => response.json())
			.then((data) => {
				console.log(JSON.stringify(data.data));
			setProfileAux(data.data);
			console.log();
			// Actualizar initialDatos con el nuevo valor de correoactual
			setDatos((prevDatos) => ({
				...prevDatos,
				correoactual: data.data.correo,
				departamento: data.data.departamento,
				ciudad: data.data.ciudad
			}));
			// Resto del código del efecto...
			})
		.catch((error) => console.error(error));
	}, []);
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
            body: JSON.stringify({ departamento: datos.departamento })
        };
        fetch("http://137.184.41.188:4000/api/getMunicipios?departamento="+datos.departamento)
            .then((response) => response.json())
            .then((data) => {
                setCiudadesLista(data.data);
                console.log(JSON.stringify(data.data));
            })
            .catch((error) => console.error(error));
    }, [datos.departamento]);
	const [showInputs, setShowInputs] = useState(Array(11).fill(false));
	//showInputs[index] = true; // Inicializa el estado del índice en true al recibirlo

	const toggleInput = (index) => {
		let state = true;
		if(showInputs[index] === true){
			state = false;
		}		
		const updatedShowInputs = Array(groupSizes.length).fill(false); // Inicializa todos los estados en false
		updatedShowInputs[index] = state; // Cambia el estado del índice al recibirlo
		setShowInputs(updatedShowInputs);
	};	  

    const renderGroup = (campos, index) => {
		return (
		  <Row className="mb-1 input-width" key={"row_"+index}>			
			{campos.map((campo, index2) => (
				<Col key={campo.controlIdData+"col"}>
					<ControlViewGroupElement 
						key={campo.controlIdData} 
						//si es password no se coloca ni recibe nada
						valueData={(campo.controlIdData.toLowerCase() === "password") ? "" : profileAux[campo.controlIdData.toLowerCase()]} 
						onclickButton={() => {
							toggleInput(index + index2);
							updateNombreCampo(campo.controlIdData);
						  }}
						{...campo} 
					/>		
				</Col>			  
			))}			
		  </Row>
		);
	  };

	//const groupSizes = [2, 2, 2, 1, 1];
	const groupSizes = [2, 3, 2, 3, 1];
	let currentIndex = 0;
	return (
		<>
        <NavbarRepartidor />
		<div className="centered-form ">			
			<div className="modal-content container centered-form">
				<h1 className='caja2'>MI PERFIL</h1>
				{groupSizes.map((size) => {
					const group = camposView.slice(currentIndex, currentIndex + size);
					currentIndex += size;
					return renderGroup(group, (currentIndex - size));
				})}
				{camposView.map((campo, index) => {
					return FormularioModificarRepartidor(showInputs, index, campo, datos, setDatos, resetDatos);
				})}
			</div>
		</div>		
		</>	
			
	);
  };

const generarCampos2 = (campo/*datosCampos*/) => {
	//return datosCampos.map((campo) => {
		if (campo.controlIdData !== "Password") {
		return [campo, {
			controlIdData: "Password",
			placeholderData: "*******",
			typeData: "input",
			inputType: "password",
			rowsData: 1,
			selecteValue: {},
			required: true
		}].flat();
		}
		return [campo, {
			controlIdData: "Password2",
			placeholderData: "*******",
			typeData: "input",
			inputType: "password",
			rowsData: 1,
			selecteValue: {},
			required: true
		}].flat();
	//}).flat();
};

const FormularioModificarRepartidor = (showInputs, index, campo, datos, setDatos, resetDatos) => {	  
	const history = useHistory();
	const handleSubmit = (event) => {
		console.log("Valores actuales de datos:", datos);
		event.preventDefault();
		fetch('http://137.184.41.188:4000/api/delivery/profile/modify', {
			method: 'POST',
			headers: {
			'Content-Type': 'application/json'
			},
			body: JSON.stringify(datos)
		})
		.then(response => {
			if (response.status === 400) {
				alert('El usuario ya existe');
			} 
			else if(response.status === 200){
				alert('Su solicitud se ha registrado con eexito!!!')
				// Restablecer los valores iniciales del estado
				resetDatos();
				//--------------> retornar a home
				//history.push('/delivery/profile');
				window.location.reload();				
			}
		})
		.catch(error => console.log(error));
	};
	
	const camposNuevos = generarCampos2(campo);
	const datosFormulario = {
		handleSubmit: handleSubmit, 
		campos: camposNuevos, 
		datos: datos, 
		setDatos: setDatos, 
		groupSizes: [1, 1], 
		resetDatos: resetDatos, 
		classNameDiv: "",
		classNameForm: "modal-content2 container centered-form",
		botonText: "Modificar" 
	};
	return (
		<>
			{showInputs[index] && <FormularioGenerico {...datosFormulario} />}
		</>
	);
};
  

export default DeliveryProfile;
