import { useState } from 'react';
import { campos } from "../components/Delivery/CamposDeliveryLogin.jsx";
import '../styles/style-delivery-reg.css';
import FormularioGenerico from "../components/Delivery/FormularioGenerico.jsx";
import { useHistory } from "react-router-dom";
import NavBar from '../components/LandingPage/NavBar.jsx';
const DeliveryLogin = () => {
	const history = useHistory();
	/**Esto va para ir a repartidor */
	const initialDatos = {
		correo: "",
		password: ""
	  };
	  const [datos, setDatos] = useState(initialDatos);	  
	  const resetDatos = () => {
		setDatos(initialDatos);
	  };

      //La accion que va a ejecutar el form al darle al boton submit
	  const handleSubmit = (event) => {
		console.log("Valores actuales de datos:", datos);		
        event.preventDefault();
        fetch('http://137.184.41.188:4000/api/delivery/login', {
            method: 'POST',
            headers: {
            	'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        })
        .then((response) => {
            if (response.status === 401) {
                alert('Usuario inexistente o datos incorrectos');
            } 
            else if(response.status === 200){
                resetDatos();
				response.json().then((data) => {
					localStorage.setItem('correo', data.correo);
					localStorage.setItem('token', data.token);
					 //--------------> retornar a home de delivery
					history.push('/delivery/home');              
				})
            }
        })
        .catch(error => console.log(error));	
	};

    //datos formulario es una variable que adjunta los valores necesarios para llamar a formulario generico
	const datosFormulario = {
		handleSubmit: handleSubmit, 
		campos: campos, 
		datos: datos, 
		setDatos: setDatos, 
		groupSizes: [1, 1], 
		resetDatos: resetDatos, 
		classNameDiv: "bg-dark cover-all",
		classNameForm: "modal-content container centered-form-register-delivery ",
        botonText: "Ingresar" 
	};
	
	return (
		<>
			<NavBar />
			<FormularioGenerico {...datosFormulario}/>
			<div className='form-modal-empresa item-center'>
				<a className="titulo" 
				href='/formdv'>¿No tienes Cuenta aun? ¡Registrate!</a>
			</div>
		</>
	);
  };

  
export default DeliveryLogin;
