import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import AccordionItemElement from './AccordionItemElement';
import Accordion from 'react-bootstrap/Accordion';
import React, { useState, useEffect } from 'react';
import '../../styles/RealizarPedidosUsuario.css';

const ModalListaPedidos = ({index, idListaPedido = 0, modalShow, setModalShow, isEditable = true}) => {
    //tenemos el id de ListadoPedidos    
    const [listaPedidos, setListaPedidos] = useState([]);
    
    //Use effect para cargar datos del listado de pedidos
	useEffect(() => {
        const api = "carrito/getPedidosListadoId";
		const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ codigo: idListaPedido })//enviamos el codigo para que retorne el listado de pedidos por id del Listado
        };
		fetch("http://137.184.41.188:4000/api/" + api, requestOptions)
			.then((response) => response.json())
			.then((result) => {
				if(result.statusCode === 200){//hay datos
                    setListaPedidos(result.data);
                }
			})
		.catch((error) => console.error(error));
	}, []);

    return (
        <>
            <div className="contenedor ">			
                <div className="contenedor">
                    <Modal  show={modalShow[index]} onHide={() => setModalShow(index)} 
                    dialogClassName='ModalSize'  >
                        <Modal.Header closeButton>
                            <Modal.Title>
                                Contenido listado : {idListaPedido}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body >
                            <Accordion defaultActiveKey="0">
                                {listaPedidos.map((item, index) => (
                                    <AccordionItemElement index={index} {...item} isEditable={isEditable} idListaPedido={idListaPedido}/>
                                ))}                    
                            </Accordion>
                        </Modal.Body>
                        <Modal.Footer>                            
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>	            
        </>          
    );
}

export default ModalListaPedidos;

