import ControlFormGroupElement from './ControlFormGroupElement';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import '../../styles/style-delivery-reg.css';

/**
 * Funcion que retorna un formulario con estructura generica
 * se reciben los campos a renderizar, junto a los datos de un useState a modificar
 * 
 * @param {*} param0 Se recibe un objeto con los datos: {
 *  - handleSubmit: la funcion a ejecutar al darle al boton de submit del formulario
 *  - campos: los campos a renderizar, como 2 input por ejemplo
 *  - datos: campo que recibirá los datos a cambiar
 *  - setDatos: funcion que permite cambiar los datos de datos
 *  - resetDatos: funcion que permite resetear los valores de datos al default
 *  - classNameDiv: css para el div principal
 *  - classNameForm: css para el form
 *  - botonText: texto que debe llevar el boton submit
 * }
 * @returns 
 */
export const FormularioGenerico = ({handleSubmit, campos, datos, setDatos, groupSizes, resetDatos, classNameDiv, classNameForm, botonText = "Registrar"}) => {	
	
	/*
	Funcion que recibe un listado de campos a renderizar (como un input o select), retorna un row
	con 1 o mas cols (dependiendo del size del listado) 
	*/
	const renderGroup = (campos, index) => {
		return (
		  <Row className="mb-1 input-width" key={index + "_row_"+ botonText} >
			{campos.map((campo) => (
				<Col key={campo.controlIdData + "_col_"+ botonText}>
					<ControlFormGroupElement key={campo.controlIdData} setDatos={setDatos} datos={datos} {...campo} />
				</Col>			  
			))}
		  </Row>
		);
	  };

	let currentIndex = 0;
	return (
		<>
		<div className={classNameDiv}>
			<Form className={classNameForm} onSubmit={handleSubmit}>
			{groupSizes.map((size, index) => {
				const group = campos.slice(currentIndex, currentIndex + size);
				currentIndex += size;
				return renderGroup(group, index);
			})}
			<Button type="submit" className="button-form-dev">{botonText}</Button>
			</Form>
		</div>		
		</>				
	);
  };

export default FormularioGenerico;