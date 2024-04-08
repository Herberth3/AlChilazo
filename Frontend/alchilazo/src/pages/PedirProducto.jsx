import NavBarUser from '../components/User/NavBarUser';
import '../styles/RealizarPedidosUsuario.css';
import AccordionItemElement from '../components/Pedido/AccordionItemElement.jsx';
import Accordion from 'react-bootstrap/Accordion';
import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";

const PedirProducto = () => {
    const {id, esCombo} = useParams();
    console.log("codigo: " + id + " - isCombo: " + esCombo);
    const itemProp = (esCombo == true) ? "idCombo" : "idProducto";   
    //console.log("itemProp ES: " + itemProp); 
	const history = useHistory();	
	return (        	
        <>
            <NavBarUser />
            <div className="centered-form ">			
                <div className="contenedor container centered-form">
                    <h1 className='caja2'>Realizar pedido</h1>
                    <Accordion defaultActiveKey="0">
                        <AccordionItemElement index={0} {...{ [itemProp]: id }} />
                    </Accordion>
                </div>
            </div>	            
        </>        
      );
  };

export default PedirProducto;

