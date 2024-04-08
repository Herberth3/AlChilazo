import NavbarRepartidor from '../components/Delivery/NavbarRepartidor.jsx';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import { campos } from "../components/Delivery/CamposFormularioRegistroRepartidor.jsx";
import '../styles/style-delivery-reg.css';
import { useHistory } from "react-router-dom";

const DeliveryHome = () => {
	const history = useHistory();
	return (
		<NavbarRepartidor />			
	);
  };

export default DeliveryHome;
